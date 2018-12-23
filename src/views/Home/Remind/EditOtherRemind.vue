<template>
  <div class="edit-remind">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">其他提醒</x-header>
    </div>
    <div class="app-content">
      <group title="">
        <!--开始提醒时间-->
        <datetime title="开始提醒时间"
                  v-model="form.start_time"
                  :start-date="startDate"
                  :end-date="endDate"
                  format="YYYY-MM-DD HH:mm">
        </datetime>
      </group>
      <group title="">
        <x-switch title="是否连续提醒" v-model="isNeedLongRemind"></x-switch>
        <popup-picker title="提醒频率"
                      v-if="isNeedLongRemind"
                      :data="remindFrequencyData"
                      v-model="form.remind_frequency"
                      placeholder="选择提醒频率"
                      show-name>
        </popup-picker>
      </group>
      <group title="">
        <x-textarea :max="200"
                    placeholder="请输入提醒内容"
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
    XButton,
    Group,
    Datetime,
    XTextarea,
    PopupPicker,
    XSwitch
  } from 'vux'
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import { Notify } from '../../../api'
  import { RESULT_CODE } from '../../../config/ResultCode'

  export default {
    components: {
      XHeader,
      Loading,
      XButton,
      Group,
      Datetime,
      XTextarea,
      PopupPicker,
      XSwitch
    },
    computed: {
      ...mapGetters({
        isShowLoading: 'isShowLoading'
      }),
      remindFrequencyData () {
        let data = this.$store.getters.dataDict
        let newData = []
        data.forEach(function (dict) {
          newData.push({
            name: dict.val,
            value: dict.key
          })
        }, this)
        return [newData]
      }
    },
    data: function () {
      return {
        title: '我的提醒',
        startDate: moment().format('L'),
        endDate: moment().add(3, 'years').format('L'),
        isNeedLongRemind: false,
        isSubmitButtonDisabled: false,
        form: {
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
        let _sec = this.form.remind_frequency
        let _remark = this.form.remark
        let errorMsgArr = []
        if (this.isNeedLongRemind) {
          if (!_sec.length) {
            errorMsgArr.push('请选择提醒频率')
          }
        }
        if (!_remark) {
          errorMsgArr.push('请输入提醒内容')
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
        if (this.form.remind_frequency.length) {
          intervalSec = this.form.remind_frequency[0]
          this.form.notify_time = 0
        }
        let payload = {
          interval_sec: intervalSec,
          notify_time: this.form.notify_time,
          params: {
            remark: this.form.remark
          },
          start_time: this.form.start_time,
          type: 4,
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
      getData (id) {
        Notify.findNotifyTemplate({
          'id': id
        }).then(res => {
          this.$store.dispatch('updateLoading', false)
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            let data = res.data.data[0]
            this.form.start_time = moment(data.start_time).format('YYYY-MM-DD HH:mm')
            this.form.remark = data.params.remark
            this.isNeedLongRemind = data.notify_time === '0'
            this.form.remind_frequency = data.interval_sec === '0' ? [] : [data.interval_sec]
            this.form.id = data.id
          }
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        let query = this.$route.query
        if (query.id) {
          this.getData(parseInt(query.id))
        }
        this.$store.dispatch('findDataDict', 'interval_sec_type')
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

