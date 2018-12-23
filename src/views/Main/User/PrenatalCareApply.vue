<template>
  <div class="prenatal-care-apply">
    <div class="appoint-header">
      <x-header :left-options="{showBack: true, backText:'返回'}">在线建档</x-header>
    </div>
    <div class="appoint-content">
      <!--<div style="background-color: #eeeeee;padding-top: 10px;">-->
      <!--<span style="color: #999999;padding: 4px;">温馨提醒：</span><br>-->
      <!--<p style="color: orange;padding: 4px 4px 12px 4px; height: auto;">。。。</p>-->
      <!--</div>-->
      <!--地区选择-->
      <group title="医院信息" class="" style="padding-top: 2px;">
        <div class="booking-info">
          <p><span class="title">预约医院：</span>{{ deptInfos.hospital_name }}</p>
          <p><span class="title">预约科室：</span>{{ deptInfos.dept_name }}</p>
        </div>
      </group>

      <div class="content"
           style='font-family: "Hiragino Sans GB","Microsoft Yahei",SimSun,Arial,"Helvetica Neue",Helvetica;'>
        <group title="个人信息">
          <!--患者姓名-->
          <x-input is-type="china-name"
                   v-model='form.patient_name'
                   placeholder="请输入真实姓名">
            <span slot="label" style="padding-right:10px;font-size: 15px; display:block;"><span style="color: red;">*</span>姓名</span>
          </x-input>

          <!--onKeypress中js是为了限制该input不能输入空格-->
          <x-input placeholder="请输入手机号码"
                   keyboard="number"
                   is-type="china-mobile"
                   v-model='form.patient_phone'
                   onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false">
            <span slot="label" style="padding-right:10px;font-size: 15px; display:block;"><span style="color: red;">*</span>手机号</span>
          </x-input>

          <x-input placeholder="请输入校验码" v-model="form.imageCode" style="height: 30px;">
            <span slot="label" style="padding-right:10px;font-size: 15px; display:block;">校验码</span>
            <img slot="right" :src="imgCode" style="max-height: 40px; margin-top: 5px;" @click="$store.dispatch('getImgCode')">
          </x-input>
          <x-input placeholder="请输入短信验证码" v-model="form.sms_code" :min="6"
                   :max="6">
            <span slot="label" style="padding-right:10px;font-size: 15px; display:block;"><span style="color: red;">*</span>验证码</span>
            <x-button type="default"
                      mini
                      slot="right"
                      @click.native="sendSmsCode"
                      :disabled="smsButton.isSending">{{smsButton.title}}
            </x-button>
          </x-input>

          <!--出生日期-->
          <datetime style="height: 25px;"
                    v-model="form.patient_born_time"
                    :min-year=1900
                    :max-year=2017
                    @on-change="onBirthdayDateChange"
                    title="出生日期"
                    :end-date="endDate"
                    year-row="{value}年"
                    month-row="{value}月"
                    day-row="{value}日"
                    confirm-text="完成"
                    cancel-text="取消">
          </datetime>

          <!--身份证-->
          <x-input title="身份证号码"
                   :show-clear="false"
                   placeholder="请输入身份证号（非必填）"
                   :min="18"
                   :max="18"
                   v-model="form.patient_identity"
                   :required="false"
                   @on-blur="checkIdentity"
                   onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false">
          </x-input>
          <selector title="*孕期" placeholder="请选择孕期" :options="prenatalList" v-model="form.patient_pregnant_period" :value-map="['id', 'val']">
          </selector>
          <!--期望入院日期-->
          <datetime style="height: 25px;"
                    v-model="form.patient_apply_in_time"
                    :start-date="startDate"
                    @on-change="onCheckInDateChange"
                    title="<span style='color: red;'>*</span>预约产检日期"
                    year-row="{value}年"
                    month-row="{value}月"
                    day-row="{value}日"
                    confirm-text="完成"
                    cancel-text="取消">
          </datetime>
        </group>

        <!--疾病情况和说明-->
        <group title="备注">

          <x-textarea :max="200"
                      placeholder="请填写备注信息"
                      v-model="form.patient_notes"
                      :show-counter="false"
                      :height="100"
                      :rows="8"
                      :cols="30">
          </x-textarea>
        </group>

        <!--提交按钮-->
        <div style="margin-bottom: 50px;margin-top: 20px;">
          <x-button style="width: 98%;margin: 10px auto; "
                    @click.native="onFormSubmit()"
                    :disabled="submitBtn.isDisabled">{{ submitBtn.txt }}
          </x-button>
        </div>
      </div>

      <!--提示-->
      <div class="alert-message">
        <alert v-model="alertMessage.isShow"
               title="提示"
               button-text="确定"
               @on-show="onAlertMessageShow"
               @on-hide="onAlertMessageHide">
          <div v-html="alertMessage.message"></div>
        </alert>
        <toast v-model="toastMessage.isShow" type="text" width="20em">{{toastMessage.message}}</toast>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {
    XHeader,
    XButton,
    ButtonTab,
    ButtonTabItem,
    Group,
    XInput,
    Cell,
    CheckerItem,
    Checker,
    Datetime,
    XTextarea,
    Popup,
    Picker,
    Radio,
    Alert,
    Loading,
    Confirm,
    PopupPicker,
    Checklist,
    Toast,
    XSwitch,
    Selector
  } from 'vux'
  import moment from 'moment'
  import { Prenatal, Obstetrics } from '../../../api'
  import { RESULT_CODE } from '../../../config/ResultCode'
  import { QUERY_NAME } from '../../../config/Constant'

  export default {
    components: {
      XHeader,
      XButton,
      ButtonTab,
      ButtonTabItem,
      Group,
      XInput,
      Cell,
      CheckerItem,
      Checker,
      Datetime,
      XTextarea,
      Popup,
      Picker,
      Radio,
      Alert,
      Loading,
      Confirm,
      PopupPicker,
      Checklist,
      Toast,
      XSwitch,
      Selector
    },
    computed: {
      ...mapGetters({
        timeDate: 'timeDate',
        smsButton: 'updateSmsButton',
        imgCode: 'imgCode',
        deptInfos: 'deptInfos'
      }),
      // 孕期
      prenatalList () {
        let maxWeek = this.$store.getters.dataDict
        let weeks = []
        let length = maxWeek.length ? maxWeek[0].val : 1
        for (let i = 1; i <= length; i++) {
          weeks.push({
            id: i.toString(),
            val: `第${i}周`
          })
        }
        return weeks
      }
    },
    data: function () {
      return {
        loginData: '',
        isIdentityTrue: true, // 身份证号码是否正确, 默认为true, 如果用户没填, 默认不提示,
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        isShowDeptPopupPicker: false,
        deptValue: [],
        // 要提交服务器的数据
        form: {
          dept_id: 521, // 科室id
          patientGender: '0', // 性别
          patient_apply_in_time: '', // 预约日期
          patient_born_time: '', // 出生日期
          patient_identity: '', // 身份证
          patient_name: '', // 患者姓名
          patient_notes: '', // 备注
          patient_phone: '', // 手机号
          patient_pregnant_period: '', // 孕期
          imageCode: '', // 图形验证码
          sms_code: '' // 短信验证码
        },
        submitBtn: {
          isDisabled: false,
          txt: '提交'
        },
        alertMessage: {
          isShow: false,
          message: ''
        },
        toastMessage: {
          isShow: false,
          message: ''
        }
      }
    },
    watch: {},
    methods: {
      queryGestInfo () {
        Obstetrics.queryGestInfo().then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            let gest = res.data.data
            if (gest && gest.infos && gest.infos.gestational_weeks) {
              this.form.patient_pregnant_period = gest.infos.gestational_weeks
            }
          }
        })
      },
      /**
       * 出生日期
       */
      onBirthdayDateChange: function (d) {
        this.bornTime = d
        this.form.patient_born_time = this.bornTime
      },
      onAlertMessageShow () {
      },
      onAlertMessageHide () {
        this.alertMessage = {isShow: false, message: ''}
      },
      /**
       * 发送短信验证码
       */
      sendSmsCode () {
        if (!this.form.patient_phone) {
          this.$vux.toast.show({
            text: '请输入手机号码',
            type: 'text'
          })
          return
        }
        if (!(/^1[3|4|5|7|8]\d{9}$/).test(this.form.patient_phone)) {
          this.$vux.toast.show({
            text: '请输入正确手机号码',
            type: 'text'
          })
          return
        }
        if (!this.form.imageCode) {
          this.$vux.toast.show({
            text: '请输入图形验证码',
            type: 'text'
          })
          return
        }
        this.$store.dispatch('sendSmsCode', {
          imageCode: this.form.imageCode,
          form: {
            phone: this.form.patient_phone
          },
          _this: this
        })
      },

      /**
       * 期望入住院日期
       */
      onCheckInDateChange: function (d) {
        this.applyInTime = d
        this.form.patient_apply_in_time = this.applyInTime
      },

      /**
       * 校验身份证信息
       */
      checkIdentity (id) {
        if (id) {
          // 如果用户输入了身份证信息, 则进行校验
          this.$store.dispatch('checkVerifyId', {id: id, _this: this})
        } else {
          // 如果用户清除了身份证信息, 则不校验
          this.isIdentityTrue = true
        }
      },
      /** 提交 */
      onFormSubmit: function () {
        let _realName = this.form.patient_name
        let _mobile = this.form.patient_phone
        let _smsCode = this.form.sms_code
        let _applyTime = this.form.patient_apply_in_time
        let _period = this.form.patient_pregnant_period
        let errorMsgArr = []
        if (!_realName || _realName.length < 2) {
          errorMsgArr.push('请输入真实姓名')
        }
        if (!(/^1[3|4|5|7|8]\d{9}$/).test(_mobile)) {
          errorMsgArr.push('请输入正确的手机号')
        }
        if (!_smsCode) {
          errorMsgArr.push('请输入短信验证码')
        }
        if (!this.isIdentityTrue) {
          errorMsgArr.push('请输入正确的身份证号码')
        }
        if (!_period) {
          errorMsgArr.push('请选择孕期')
        }
        if (!_applyTime) {
          errorMsgArr.push('请选择预约产检日期')
        }

        // console.log('form---->', this.form)
        if (errorMsgArr.length === 0) {
          this.submitBtn = {isDisabled: true, txt: '提交中...'}
          const _this = this
          Prenatal.prenatalCommonApply(this.form).then(res => {
            if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
              this.$vux.alert.show({
                title: '提示',
                content: '预约成功!',
                onHide () {
                  _this.$router.back()
                }
              })
            } else {
              this.$vux.alert.show({
                title: '提示',
                content: res.data.data || '预约失败, 请稍后再试'
              })
              this.submitBtn = {isDisabled: false, txt: '提交'}
            }
          })
        } else {
          this.submitBtn = {isDisabled: false, txt: '提交'}
          this.alertMessage = {isShow: true, message: errorMsgArr.join('<br/>')}
        }
      },
      /**
       * 获取孕妇信息
       * @param id
       */
      getPrenatalInfo (id) {
        this.$vux.loading.show({
          text: '加载中...'
        })
        Prenatal.getPrenatalInfo(id).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            let info = res.data.data
            this.prenatalInfo = info
            this.form.patient_born_time = moment(info.patient_born_time).format('YYYY-MM-DD')
            this.form.patient_identity = info.patient_identity
            this.form.patient_name = info.patient_name
            this.form.patient_phone = info.patient_phone
            this.$vux.loading.hide()
          }
        })
      }
    },
    mounted () {
      let query = this.$route.query
      this.form.dept_id = query.id
      if (query.id) {
        // 从科室进来
        if (query.t === QUERY_NAME.DEPARTMENT) {
          this.$store.dispatch('getDeptInfo', query.id)
          // 从孕检记录进来
        } else if (query.t === QUERY_NAME.PRENATAL_RECORD) {
          if (query.dept_id) {
            this.$store.dispatch('getDeptInfo', query.dept_id)
          }
          this.getPrenatalInfo(query.id)
        }
      }
      this.$store.dispatch('updateSmsButton', {isSending: false})
      this.$store.dispatch('getImgCode')
      this.$store.dispatch('findDataDict', 'obst_max_weeks')
      this.loginData = this.$auth.user()
      this.queryGestInfo()
    }
  }
</script>

<style lang="scss">
  @import "style/prenatalCareApply.scss";
</style>
