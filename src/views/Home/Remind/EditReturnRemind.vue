<template>
  <div class="edit-remind">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">复诊提醒</x-header>
    </div>
    <div class="app-content">
      <group title="">
        <x-input title="医生" placeholder="请输入医生的姓名" v-model='form.doctor_name'></x-input>
        <x-input title="医院名称" placeholder="请输入医院名称" v-model='form.hos_name'></x-input>
        <!--复诊时间-->
        <calendar v-model="form.return_time"
                  title="复诊时间"
                  disable-past>
        </calendar>
        <!--开始提醒时间-->
        <datetime title="开始提醒时间"
                  v-model="form.start_time"
                  :start-date="startDate"
                  :end-date="endDate"
                  format="YYYY-MM-DD HH:mm">
        </datetime>
        <x-switch title="是否连续提醒" v-model="isNeedLongRemind"></x-switch>
        <popup-picker title="提醒频率"
                      v-show="isNeedLongRemind"
                      :data="remindFrequencyData"
                      v-model="form.remind_frequency"
                      placeholder="选择提醒频率"
                      show-name>
        </popup-picker>
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
    Calendar
  } from 'vux'
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import { Notify } from '../../../api'
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
      Calendar
    },
    computed: {
      ...mapGetters({
        isShowLoading: 'isShowLoading'
      }),
      remindFrequencyData () {
        let data = this.$store.getters.dataDict
        if (data && data.length) {
          let newData = []
          data.forEach(function (dict) {
            newData.push({
              name: dict.val,
              value: dict.key
            })
          }, this)
          return [newData]
        }
      }
    },
    data: function () {
      return {
        title: '我的提醒',
        startDate: moment().format('L'),
        endDate: moment().add(3, 'years').format('L'),
        return_time: '',
        start_time: '',
        isNeedLongRemind: false, // 是否需要连续提醒
        isSubmitButtonDisabled: false, // 提交按钮是否可用
        remind_frequency: [],
        form: {
          hos_name: '',
          doctor_name: '',
          return_time: moment().format('YYYY-MM-DD'),
          start_time: moment().format('YYYY-MM-DD HH:mm'),
          remind_frequency: [],
          remark: '',
          notify_time: 1,
          id: ''
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
      onSubmit () {
        this.isSubmitButtonDisabled = true
        this.checkForm()
      },
      /**
       * 检查数据
       */
      checkForm () {
        let _doc = this.form.doctor_name
        let _sec = this.form.remind_frequency
        let _hos = this.form.hos_name
        let errorMsgArr = []
        if (!_doc) {
          errorMsgArr.push('请输入医生姓名')
        }
        if (!_hos) {
          errorMsgArr.push('请输入医院名称')
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
          this.updateReturnRemind()
        }
      },
      /**
       * 更新提醒
       */
      updateReturnRemind () {
        const _this = this
        let intervalSec = 0
        if (this.form.remind_frequency.length) {
          intervalSec = this.form.remind_frequency[0]
          this.form.notify_time = 0
        }
        let payload = {
          interval_sec: intervalSec,
          notify_time: this.form.notify_time,
          params: {
            doctor_name: this.form.doctor_name,
            return_time: this.form.return_time,
            remark: this.form.remark,
            hos_name: this.form.hos_name
          },
          start_time: this.form.start_time,
          type: 2,
          valid: 1
        }
        if (this.form.id) {
          payload['id'] = this.form.id
        }
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
      /**
       * 获取数据
       */
      getData (id) {
        Notify.findNotifyTemplate({
          'id': id
        }).then(res => {
          this.$store.dispatch('updateLoading', false)
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            let data = res.data.data[0]
            this.form.doctor_name = data.params.doctor_name
            this.form.hos_name = data.params.hos_name
            this.form.return_time = data.params.return_time
            this.form.start_time = moment(data.start_time).format('YYYY-MM-DD HH:mm')
            this.isNeedLongRemind = data.notify_time === '0'
            this.form.remind_frequency = data.interval_sec === '0' ? [] : [data.interval_sec]
            this.form.remark = data.params.remark
            this.form.id = data.id
          }
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        let query = this.$route.query
        this.$store.dispatch('findDataDict', 'msg_return_notify_sec_type')
        if (query.id) {
          this.getData(parseInt(query.id))
        }
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

