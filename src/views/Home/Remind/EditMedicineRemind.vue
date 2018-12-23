<template>
  <div class="edit-remind">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">用药提醒</x-header>
    </div>
    <div class="app-content">
      <group title="">
        <!-- 药品名称 -->
        <x-input title="药品名称" placeholder="请输入药品名称" v-model='form.medicine_name'></x-input>
        <!-- 提醒次数 -->
        <popup-picker title="提醒次数"
                      :data="medicinePointTypeData"
                      v-model="notifyCountValue"
                      @on-change="medicinePointChange"
                      placeholder="选择提醒次数"
                      show-name>
        </popup-picker>
        <!-- 提醒时间 -->
        <cell v-for="i in timeCellCount"
              :key="i"
              class="time-cell"
              :title="eatTimeArray[i-1]['time']"
              is-link
              :border-intent="false"
              :value="eatTimeArray[i-1]['count']"
              @click.native="showPopup(i-1)">
        </cell>
        <!-- 提醒时间的popup -->
        <div class="content-popup">
          <popup v-model="isShowPopup" height="270px" is-transparent>
            <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
              <group>
                <datetime title="时间"
                          v-model="eatTime"
                          format="HH:mm">
                </datetime>
                <!--<x-input title="时间" placeholder="请输入时间" v-model='eatTime'></x-input>-->
                <x-input title="剂量" placeholder="请输入剂量" v-model='eatCount'></x-input>
              </group>
              <div style="padding:20px 15px;">
                <x-button type="primary" @click.native="onPopupSubmit">确定</x-button>
                <x-button @click.native="isShowPopup = false">取消</x-button>
              </div>
            </div>
          </popup>
        </div>
        <!-- 剂量单位 -->
        <popup-picker title="剂量单位"
                      :data="medicineUnitData"
                      v-model="form.unit"
                      placeholder="选择剂量单位"
                      show-name>
        </popup-picker>
      </group>

      <group title="时间安排">
        <!-- 开始时间 -->
       <datetime title="开始时间"
                  v-model="form.start_time"
                  :start-date="startDate"
                  :end-date="endDate"
                  format="YYYY-MM-DD HH:mm">
        </datetime>
        <!-- 是否连续提醒 -->
        <x-switch title="是否连续提醒" v-model="isNeedLongRemind"></x-switch>
        <!-- 提醒频率 -->
        <popup-picker title="提醒频率"
                      v-show="isNeedLongRemind"
                      :data="remindFrequencyData"
                      v-model="form.remind_frequency"
                      placeholder="选择提醒频率"
                      show-name>
        </popup-picker>
      </group>
      <group title="其他">
        <x-input title="服药原因" placeholder="请输入服药原因" v-model='form.cause'></x-input>
        <x-input title="药品来源" placeholder="请输入药品来源" v-model='form.origin'></x-input>
        <x-textarea :max="200"
                    placeholder="备注"
                    v-model="form.remark"
                    :show-counter="true"
                    :height="100"
                    :rows="8"
                    :cols="30">
        </x-textarea>
      </group>
      <div class="submit-button" style="margin-top: 20px;">
        <x-button style="width: 80%;margin: 10px auto;height: 40px;font-size: 15px;background-color: #68C84F"
                  type="primary"
                  @click.native="onSubmit"
                  :disabled="isSubmitButtonDisabled">确定
        </x-button>
      </div>
      <loading :show="isShowLoading && form.id.length!=''" text="加载中..."></loading>
    </div>
  </div>
</template>
<script>
  import {
    XHeader,
    Loading,
    Cell,
    XButton,
    Group,
    XInput,
    Datetime,
    XTextarea,
    PopupPicker,
    XSwitch,
    Calendar,
    Popup
  } from 'vux'
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import { Notify, BaseData } from '../../../api'
  import { RESULT_CODE } from '../../../config/ResultCode'

  export default {
    components: {
      XHeader,
      Loading,
      Cell,
      XButton,
      Group,
      XInput,
      Datetime,
      XTextarea,
      PopupPicker,
      XSwitch,
      Calendar,
      Popup
    },
    computed: {
      ...mapGetters({
        isShowLoading: 'isShowLoading'
      })
    },
    data: function () {
      return {
        title: '我的提醒',
        startDate: moment().format('L'),
        endDate: moment().add(3, 'years').format('L'),
        remindFrequencyData: [],
        medicineUnitData: [],
        medicinePointTypeData: [],
        isNeedLongRemind: false,
        isSubmitButtonDisabled: false,
        isShowPopup: false,
        timeCellCount: 0,
        cellIndex: 0,
        notifyCountValue: [],
        eatTimeArray: [],
        eatTime: '',
        eatCount: '',
        form: {
          medicine_name: '',
          start_time: moment().format('YYYY-MM-DD HH:mm'),
          notify_point: [],
          remind_frequency: [],
          remark: '',
          notify_time: 1, // n:n次, 0:无限
          id: '',
          unit: [],
          cause: '',
          origin: ''
        }
      }
    },
    watch: {
      isNeedLongRemind (val) {
        if (!val) {
          this.form.notify_time = 1
          this.form.remind_frequency = []
        }
      }
    },
    methods: {
      medicinePointChange (val) {
        let cellCount = 24 / parseInt(val[0])
        let eatArrayCount = this.eatTimeArray.length
        if (cellCount > eatArrayCount) {
          for (let i = 0; i < (cellCount - eatArrayCount); i++) {
            this.eatTimeArray.push({
              'time': '选择服用时间',
              'count': '选择服用剂量'
            })
          }
        } else if (cellCount < eatArrayCount) {
          this.eatTimeArray.splice(cellCount, eatArrayCount - cellCount)
        }
        this.timeCellCount = 24 / parseInt(val[0])
      },
      showPopup (index) {
        this.cellIndex = index
        this.isShowPopup = true
        let eatTime = this.eatTimeArray[index]['time']
        let eatCount = this.eatTimeArray[index]['count']
        let time = moment().add(index, 'hours').format('HH:mm')
        this.eatTime = eatTime === '选择服用时间' ? time : eatTime
        this.eatCount = eatCount === '选择服用剂量' ? '1.0' : eatCount
      },
      onPopupSubmit () {
        this.isShowPopup = false
        let index = this.cellIndex
        this.eatTimeArray[index]['time'] = this.eatTime
        this.eatTimeArray[index]['count'] = this.eatCount
      },
      onSubmit () {
        this.isSubmitButtonDisabled = true
        let _medicine = this.form.medicine_name
        let _unit = this.form.unit
        let _sec = this.form.remind_frequency
        let errorMsgArr = []
        if (!_medicine) {
          errorMsgArr.push('请输入药品名称')
        }
        if (!this.eatTimeArray.length) {
          errorMsgArr.push('请选择提醒次数')
        }
        if (!_unit.length) {
          errorMsgArr.push('请选择剂量单位')
        }
        if (this.isNeedLongRemind) {
          if (!_sec.length) {
            errorMsgArr.push('请选择提醒频率')
          }
        }
        if (errorMsgArr.length !== 0) {
          this.isSubmitButtonDisabled = false
          this.$vux.alert.show({
            title: '提示',
            content: errorMsgArr.join('<br/>')
          })
          return false
        } else {
          this.updateRemind()
        }
      },
      updateRemind () {
        const _this = this
        let intervalSec = 0
        let notifyPoint = []
        let unit = this.form.unit[0]
        let unitName = ''
        this.form.notify_time = this.eatTimeArray.length
        // 如果选择了提醒频率, 说明是"无限"提醒, notify_time设为0(默认为1, 一次)a
        if (this.form.remind_frequency.length) {
          intervalSec = this.form.remind_frequency[0]
          this.form.notify_time = 0
        }
        this.medicineUnitData[0].forEach(function (u) {
          if (u.value === unit) {
            unitName = u.name
          }
        })
        this.eatTimeArray.forEach(function (time) {
          notifyPoint.push(time['time'])
        })
        let payload = {
          interval_sec: intervalSec,
          notify_time: this.form.notify_time,
          notify_point: notifyPoint,
          params: {
            medicine_name: this.form.medicine_name,
            eat_time: this.eatTimeArray,
            unit: this.form.unit[0],
            cause: this.form.cause,
            origin: this.form.origin,
            remark: this.form.remark,
            count_name: unitName
          },
          start_time: this.form.start_time,
          type: 3,
          valid: 1
        }
        if (this.form.id) {
          payload['id'] = this.form.id
        }
        // console.log(payload)
        Notify.setNotifyTemplate(payload).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS && res.data.message === '请求成功') {
            this.$vux.toast.show(this.form.id ? '修改成功!' : '新增成功!')
            setTimeout(function () {
              _this.$router.go(-1)
            }, 1000)
          } else {
            this.isSubmitButtonDisabled = false
            this.$vux.alert.show({
              title: '提示',
              content: '添加失败, 请稍后再试'
            })
          }
        })
      },
      getData (id) {
        Notify.findNotifyTemplate({
          'id': id
        }).then(res => {
          this.$store.dispatch('updateLoading', false)
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            let data = res.data.data[0]
            this.form.medicine_name = data.params.medicine_name
            this.eatTimeArray = data.params.eat_time
            if (this.eatTimeArray.length) {
              this.notifyCountValue = [(24 / this.eatTimeArray.length).toString()]
              this.timeCellCount = this.eatTimeArray.length
            }
            this.form.unit = [data.params.unit]
            this.form.start_time = moment(data.start_time).format('YYYY-MM-DD HH:mm')
            this.isNeedLongRemind = data.notify_time === '0'
            this.form.remind_frequency = data.interval_sec === '0' ? [] : [data.interval_sec]
            this.form.cause = data.params.cause
            this.form.origin = data.params.origin
            this.form.remark = data.params.remark
            this.form.id = data.id
          }
        })
      },
      getDataDict () {
        BaseData.findDataDict('interval_sec_type').then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            this.remindFrequencyData = this.configDataDict(res.data.data)
          }
        })
        BaseData.findDataDict('msg_notify_medicine_unit_type').then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            this.medicineUnitData = this.configDataDict(res.data.data)
          }
        })
        BaseData.findDataDict('msg_notify_medicine_point_type').then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            this.medicinePointTypeData = this.configDataDict(res.data.data)
          }
        })
      },
      configDataDict (data) {
        let arr = []
        data.forEach(function (d) {
          arr.push({
            name: d.val,
            value: d.key
          })
        }, this)
        return [arr]
      }
    },
    mounted () {
      this.$nextTick(function () {
        let query = this.$route.query
        if (query.id) {
          this.getData(parseInt(query.id))
        }
        this.getDataDict()
      })
    },
    destroyed () {
      this.$store.dispatch('updateLoading')
    }
  }
</script>

<style lang="scss">
  @import "../style/editReturnRemind.scss";
</style>

