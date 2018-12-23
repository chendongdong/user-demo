<template>
  <div class="booking" v-show="isShowPage">
    <div class="app-header">
      <x-header :left-options="{showBack: false}">医秘约床
        <a slot="left" class="vux-header-back" @click="goBack">返回</a>
      </x-header>
    </div>
    <div class="content" style="margin-top: 60px;">
      <!--约医院的床-->
      <div class="booking-info" v-if="type=='3'">
        <p><span class="title">预约医院：</span>{{ hospitalsInfo.base_info.hos_name }}</p>
        <div style="display: flex">
          <div class="title" style="padding-top: 20px; width:80px;">*预约科室：</div>
          <g-select style="margin-top:10px;width:78%;"
                    :options="hospitalsInfo.list"
                    @select="selectDept"
                    placeholder="请选择科室"
                    label="dept_name">
          </g-select>
        </div>
      </div>
      <!--约科室的床-->
      <div class="booking-info" v-if="type=='2'">
        <p><span class="title">预约医院：</span>{{ deptInfos.hospital_name }}</p>
        <p><span class="title">预约科室：</span>{{ deptInfos.dept_name }}</p>
        <span v-if="deptInfos.deposits > 0" style="font-size: 14px;color: #999999">需支付预约押金:
            <span style="color: orange">{{deptInfos.deposits}}</span>元
          </span>
      </div>
      <!--约医生的床-->
      <div class="booking-info" v-if="type=='1'">
        <p><span class="title">预约医院：</span>{{ doctorInfo.hospital_name }}</p>
        <p><span class="title">预约科室：</span>{{ doctorInfo.dept_show_name }}</p>
        <p><span class="title">预约医生：</span>{{ doctorInfo.doctor_name }}</p>
        <span v-if="doc_doc_dept.deposits > 0" style="font-size: 14px;color: #999999">需支付预约押金:
            <span style="color: orange">{{doc_doc_dept.deposits}}</span>元
          </span>
      </div>

      <!--患者信息-->
      <group title="*账户信息">
        <!--手机号-->
        <!--onKeypress中js方法是为了限制该input不能输入空格-->
        <x-input title="*手机号"
                 placeholder="请输入手机号码"
                 keyboard="number"
                 is-type="china-mobile"
                 v-model='patientPhone'
                 onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false">
        </x-input>
        <x-input title="*校验码" placeholder="请输入校验码" v-model="bookingForm.imageCode" style="height: 30px;">
          <img slot="right" :src="imgCode" style="max-height: 40px; margin-top: 5px;" @click="refreshImageCode">
        </x-input>
        <x-input title="*验证码" placeholder="短信验证码" v-model="bookingForm.sms_code" :min="6"
                 :max="6">
          <x-button type="default"
                    mini
                    slot="right"
                    @click.native="sendSmsCode"
                    :disabled="updateSmsButton.isSending">{{updateSmsButton.title}}
          </x-button>
        </x-input>
      </group>

      <group title="个人资料">
        <!--姓名-->
        <x-input title="*姓名" placeholder="请输入您的真实姓名" v-model='bookingForm.patient_name'></x-input>
        <!--出生日期-->
        <datetime style="height: 25px;"
                  title="出生日期"
                  v-model="bookingForm.patient_born_time"
                  :min-year=1900
                  :max-year=2020
                  @on-change="onBirthdayDateChange"
                  placeholder=""
                  year-row="{value}年"
                  month-row="{value}月"
                  day-row="{value}日"
                  confirm-text="确定"
                  cancel-text="取消">
        </datetime>
        <!--性别-->
        <div class="weui-cell sex-cell">
          <label class="weui_label" style="width: 4em;">*性别</label>
          <checker v-model="bookingForm.patientGender"
                   default-item-class="sex-checker-item"
                   selected-item-class="sex-checker-item-selected"
                   style="height: 25px;">
            <checker-item v-for='list in gender' :key="list.key" :value="list.key">{{list.val}}</checker-item>
          </checker>
        </div>

        <!--身份证号码-->
        <x-input title="身份证号"
                 :show-clear="false"
                 placeholder="请输入身份证号"
                 :min="18"
                 :max="18"
                 v-model="bookingForm.patient_identity"
                 :required="false"
                 @on-blur="checkIdentity"
                 onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false">
        </x-input>
      </group>

      <group title="预约信息">
        <cell title="床位类型" is-link :value="bedTypeName" @click.native="isShowBedPopup=true"></cell>
        <!--转诊期望入院日期-->
        <datetime title="*期望入院日期"
                  class="tran-date-time"
                  v-model="applyInTime"
                  :min-year='2017'
                  :max-year='2030'
                  @on-change="onCheckInDateChange"
                  placeholder=""
                  year-row="{value}年"
                  month-row="{value}月"
                  day-row="{value}日"
                  confirm-text="确定"
                  cancel-text="取消">
        </datetime>

        <!--最迟入院日期-->
        <datetime title="最迟入院日期"
                  style="height: 25px;"
                  v-model="latestTime"
                  :min-year='2017'
                  :max-year='2030'
                  @on-change="onLastDateChange"
                  placeholder=""
                  year-row="{value}年"
                  month-row="{value}月"
                  day-row="{value}日"
                  confirm-text="完成"
                  cancel-text="取消">
        </datetime>
      </group>
      <group title="请认真填写一下信息(若有)" class="priorities" v-show="deptSetting.params.length">
        <checklist :options="deptSettingData"
                   :max="0"
                   v-model="priValues"
                   @on-change="prioritiesChange">
        </checklist>
      </group>

      <group title="疾病情况和备注">
        <x-textarea :max="200"
                    placeholder="请简要填写疾病情况"
                    v-model="bookingForm.patient_reason"
                    :show-counter="true"
                    :height="100"
                    :rows="8"
                    :cols="30">
        </x-textarea>
        <x-textarea :max="200"
                    placeholder="其它说明事项（若有）"
                    v-model="bookingForm.patient_notes"
                    :show-counter="true"
                    :height="100"
                    :rows="8"
                    :cols="30">
        </x-textarea>
      </group>

      <div class="booking-action" style="margin-top: 20px;">
        <x-button style="width: 80%;margin: 10px auto;height: 40px;font-size: 15px;"
                  type="primary"
                  @click.native="onSubmit"
                  :disabled="updateSubmitButton.isDisabled">{{updateSubmitButton.title}}
        </x-button>

      </div>

      <!--床位类型popup-->
      <popup v-model="isShowBedPopup" class="checker-popup">
        <div style="padding:10px 10px 40px 10px;">
          <p style="padding: 5px 5px 5px 2px;color:#888;">床位类型</p>
          <checker v-model="bedTypeName"
                   default-item-class="bed-type-item"
                   selected-item-class="bed-type-item-selected"
                   disabled-item-class="bed-type-item-disabled">
            <checker-item v-for='list in applyBedTypes' :key="list.type_id" :value="list.type_name"
                          @on-item-click="bedTypeClick">{{list.type_name}}
            </checker-item>
          </checker>
        </div>
      </popup>
    </div>
    <toast v-model="toastMessage.isShow" type="text" width="20em">{{toastMessage.message}}</toast>
    <alert v-model="alertMessage.isShow" title="提示">
      <div v-html="alertMessage.message"></div>
    </alert>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import GSelect from 'components/Select/'
  import DateUtil from '../../utils/DateUtil'
  import { QUERY_NAME } from '../../config/Constant'
  import {
    XHeader,
    Cell,
    XButton,
    Search,
    Group,
    XInput,
    CheckerItem,
    Checker,
    Datetime,
    XTextarea,
    Picker,
    Tip,
    Alert,
    Loading,
    Confirm,
    Selector,
    ButtonTabItem,
    ButtonTab,
    PopupPicker,
    Icon,
    XDialog,
    Popup,
    Checklist,
    Radio,
    Toast
  } from 'vux'

  export default {
    components: {
      GSelect,
      XHeader,
      Cell,
      XButton,
      Search,
      Group,
      XInput,
      CheckerItem,
      Checker,
      Datetime,
      XTextarea,
      Picker,
      Tip,
      Alert,
      Loading,
      Confirm,
      Selector,
      ButtonTabItem,
      ButtonTab,
      PopupPicker,
      Icon,
      XDialog,
      Popup,
      Checklist,
      Radio,
      Toast
    },
    computed: {
      ...mapGetters({
        updateSmsButton: 'updateSmsButton',
        gender: 'gender',
        deptSetting: 'deptSetting',
        applyBedTypes: 'ApplyBedTypeByDeptData',
        dept: 'deptInfos',
        updateSubmitButton: 'updateSubmitButton',
        allProvinceCities: 'allProvinceCities',
        hospitals: 'hospitalDataByArea',
        encryptionDetail: 'encryptionDetail',
        doc_doc_dept: 'doc_doc_dept',
        imgCode: 'imgCode'
      }),
      deptSettingData () {
        let setting = this.deptSetting.params.slice()
        return setting.map(s => {
          return {
            key: s.param_id,
            value: s.param_name
          }
        })
      },
      //   医院信息
      hospitalsList () {
        return (this.hospitals || []).slice().map(function (e) {
          return {
            name: e.name,
            value: e.id.toString(),
            parent: 0
          }
        })
      },
      //   科室信息
      departmentsList () {
        return (this.departments || []).slice().map(function (e) {
          return {
            name: e.name,
            value: e.id.toString(),
            parent: 0
          }
        })
      },
      deptInfos: {
        // 修复 'deptInfos' was assigned to but it has no setter. 错误
        set: function (newValue) {
          this.deptTempInfo = newValue
        },
        get: function () {
          return this.deptTempInfo || this.dept
        }
      }
    },
    data: function () {
      return {
        patientPhone: '',
        startDate: new Date(),
//        nowDate: NOW.getFullYear() + '/' + (NOW.getMonth() + 1) + '/' + NOW.getDate(),  // safari不支持yyyy-MM-dd格式化
        // 要提交服务器的数据
        bookingForm: {
          dept_id: '',
          patientGender: '',
          patient_apply_in_time: '',
          patient_born_time: '',
          patient_identity: '',
          patient_latest_time: '',
          patient_name: '',
          patient_notes: '',
          patient_phone: '',
          patient_reason: '',
          patient_room_type: 1,
          priorities: [],
          recommend_id: '',
          sms_code: '',
          imageCode: ''
        },
        doctorInfo: [],
        deptTempInfo: [],
        locationValue: [],
        hosValue: [],
        deptValue: [],
        applyInTime: '',
        latestTime: '',
        priValues: [],  // 科室优先级
        isShowBedPopup: false,
        bedTypeName: '不限', //  在cell展示的床位名称,
        type: 0,
        isIdentityTrue: true, // 身份证号码是否正确, 默认为true, 如果用户没填, 默认不提示
        isShowPage: true, // 是否展示页面
        toastMessage: {
          isShow: false,
          message: ''
        },
        alertMessage: {
          isShow: false,
          message: ''
        }
      }
    },
    watch: {
      encryptionDetail (val) {
        this.$vux.loading.hide()
        if (!val.isError) {
          if (this.type === 1) { // 医生二维码
            this.doctorInfo = val.data
            this.bookingForm.recommend_id = val.data.doctor_id
            this.bookingForm.dept_id = val.data.dept_id
            this.getDeptSetting(val.data.dept_id)
          } else if (this.type === 2) { // 科室二维码
            if (val.data) {
              // 判断科室约床与孕检功能是否打开
              this.judgeDeptServiceType(val.data)
            }
          } else if (this.type === 3) { // 医院二维码

          }
        } else { // 信息有误
          this.toastMessage.isShow = true
          if (this.type === 1) {
            this.toastMessage.message = '医生不存在'
          } else if (this.type === 2) {
            this.toastMessage.message = '科室不存在'
          } else if (this.type === 3) {
            this.toastMessage.message = '医院不存在'
          }
          setTimeout(() => {
            this.$router.push({name: 'Home'})
          }, 3000)
        }
      },
      locationValue (lo) {
        this.hosValue = []
        this.hospitalsList = []
        this.$store.dispatch('getHospitalByArea', lo[1])
      },
      hosValue (hos) {
        this.departmentsList = []
        this.deptValue = []
        if (hos.length) {
          this.$store.dispatch('getAllDepartments', hos[0])
        }
      },
      deptValue (d) {
        this.bookingForm.dept_id = d[0]
        //  获取科室优先级信息
        this.getDeptSetting(d[0])
      },
      deptSetting (val, oldVal) {
        let newArr = []
        if (val.params) {
          for (let i = 0; i < val.params.length; i++) {
            let newPri = {
              label: val.params[i].param_name,
              value: val.params[i].param_id
            }
            newArr.push(newPri)
          }
        }
      },
      patientPhone (val) {
        if (val && (/^1[3|4|5|7|8]\d{9}$/).test(val)) {
          this.$store.dispatch('updateSmsButton', {isSending: false})
          this.bookingForm.patient_phone = val
        } else {
          this.$store.dispatch('updateSmsButton', {isSending: true})
        }
      },
      doctorInfo: function (val) {
        this.$store.dispatch('getDeptInfo', val.dept_id)
      },
      deptInfos: function (val) {
        this.bookingForm.dept_id = val.dept_id
        this.getDeptSetting(val.dept_id)
      }
    },
    methods: {
      goBack () {
//        this.$router.push({name: 'Home'})
        this.toastMessage.isShow = true
        this.toastMessage.message = '请关闭页面，重新进入微信公众号'
      },
      /**
       * 获取科室相关设置
       */
      getDeptSetting (id) {
        this.$store.dispatch('getDeptsSetting', id)
        this.$store.dispatch('getApplyBedTypeByDept', id)
      },
      selectDept (dept) {
        this.bookingForm.dept_id = dept.department_id
      },
      /**
       * 刷新图形验证码
       */
      refreshImageCode () {
        this.$store.dispatch('getImgCode')
      },
      /**
       * 床位选择
       */
      bedTypeClick: function (bedType) {
        this.bookingForm.patient_room_type = this.applyBedTypes.filter(
          function (bed) {
            return bedType === bed.type_name
          }
        )[0].type_id
        this.isShowBedPopup = false
      },
      /**
       * 出生日期
       */
      onBirthdayDateChange (d) {
        this.bookingForm.patient_born_time = d
        let tomorrow = DateUtil.getDate(0)
        if (d > tomorrow) {
          this.alertMessage = {isShow: true, message: '出生日期不能大于今日'}
          setTimeout(() => {
            this.bookingForm.patient_born_time = DateUtil.getDate(0)
          }, 1000)
        }
      },
      /**
       * 期望入住院日期
       */
      onCheckInDateChange (d) {
        this.applyInTime = d
        let nowTime = DateUtil.getDate(0)
        if (d && d < nowTime) {
          this.alertMessage = {isShow: true, message: '期望入院日期不能小于今天'}
          setTimeout(() => {
            this.applyInTime = nowTime
          }, 1000)
        }
        this.bookingForm.patient_apply_in_time = this.applyInTime
      },
      /**
       * 最迟入院日期
       */
      onLastDateChange (d) {
        this.latestTime = d
        let nowTime = DateUtil.getDate(0)
        if (d && d < nowTime) {
          this.alertMessage = {isShow: true, message: '最迟入院日期不能小于今天'}
          setTimeout(() => {
            this.latestTime = nowTime
          }, 1000)
        }
        if (this.applyInTime) {
          if (d < this.applyInTime) {
            this.alertMessage = {isShow: true, message: '最迟入院日期不能小于期望入院日期'}
            let day = addDate(this.applyInTime.replace('/-/g', '/'), 5)
            setTimeout(() => {
              this.latestTime = getDate(day)
            }, 1000)
          }
        }
        this.bookingForm.patient_latest_time = this.latestTime
      },
      /**
       * 科室优先级
       */
      prioritiesChange (val) {
        this.bookingForm.priorities = []
        for (let i = 0; i < val.length; i++) {
          let prioritiesID = val[i]
          let priorities = this.deptSetting.params
          this.bookingForm.priorities.push(priorities.filter(
            function (p) {
              return prioritiesID === p.param_id
            })[0]
          )
        }
      },
      /**
       * 发送短信验证码
       */
      sendSmsCode () {
        this.$store.dispatch('sendSmsCode', {
          imageCode: this.bookingForm.imageCode,
          form: {
            phone: this.bookingForm.patient_phone
          },
          _this: this
        })
      },
      /**
       * 检查身份证
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
      /**
       * 约床
       */
      onSubmit () {
        let _deptID = this.bookingForm.dept_id
        let _gender = this.bookingForm.patientGender
        let _applyTime = this.bookingForm.patient_apply_in_time
        let _realName = this.bookingForm.patient_name
        let _phone = this.bookingForm.patient_phone
        let _sms = this.bookingForm.sms_code
        let _imgCode = this.bookingForm.imageCode

        let errorMsgArr = []

        if (this.type === 3 && _deptID.length === 0) {
          errorMsgArr.push('请选择科室')
        }
        if (!_realName || _realName.length < 2) {
          errorMsgArr.push('请输入真实姓名')
        }
        if (!(/^1[3|4|5|7|8]\d{9}$/).test(_phone)) {
          errorMsgArr.push('请输入正确的手机号')
        }
        if (!_imgCode) {
          errorMsgArr.push('请输入校验码')
        }
        if (!_sms || _sms.length !== 6) {
          errorMsgArr.push('请输入正确的短信验证码')
        }
        if (_gender !== '0' && _gender !== '1') {
          errorMsgArr.push('请选择性别')
        }
        if (!this.isIdentityTrue) {
          errorMsgArr.push('请输入正确的身份证号码')
        }
        if (!_applyTime) {
          errorMsgArr.push('请选择期望入院日期')
        }
        // 区分扫码约床患者
        if (this.bookingForm.recommend_id) {
          // 扫医生二维码
          this.bookingForm.access_type = 9
        } else {
          // 扫科室或者医院二维码约床患者
          this.bookingForm.access_type = 1
        }
        if (errorMsgArr.length === 0) {
          this.$store.dispatch('updateSubmitBtn', {isDisabled: true, title: '正在提交...'})
          this.$store.dispatch('newBooking', {
            form: this.bookingForm,
            _this: this
          })
        } else {
          this.$store.dispatch('updateSubmitBtn', {isDisabled: false})
          this.alertMessage = {isShow: true, message: errorMsgArr.join('<br/>')}
        }
      },
      /**
       * 获取加密信息
       */
      getEncryptionInfo () {
        let path = this.$route.path
        let id = this.$route.params.id
        if (path.indexOf('doctor') > 0) { // 医生二维码
          this.type = 1
          this.$store.dispatch('getEncryptionDoctorDetail', id)
        } else if (path.indexOf('dept') > 0) { // 科室二维码
          // 先不显示页面, 待判断完科室服务类型, 如果只有约床, 再放开
          this.isShowPage = false
          this.type = 2
          this.$store.dispatch('getEncryptionDeptDetail', id)
        } else if (path.indexOf('hospital') > 0) { // 医院二维码
          this.type = 3
        }
        this.$vux.loading.show({
          text: '加载中...'
        })
      },
      /**
       * 判断科室二维码类型,
       * @param info
       * service_type: 1=约床，2=产检，100=全部
       */
      judgeDeptServiceType (info) {
        if (info.service_type === 100) { // 全部
          this.$router.push({name: 'DeptServiceType', params: {deptId: info.dept_id}})
        } else if (info.service_type === 2) { // 产检
          this.$router.push({name: 'PrenatalCareApply', query: {id: info.dept_id, t: QUERY_NAME.PRENATAL_RECORD}})
        } else { // 只有约床
          this.isShowPage = true // 显示页面
          this.deptInfos = info
          this.bookingForm.dept_id = info.dept_id
          this.getDeptSetting(info.dept_id)
        }
      }
    },
    mounted () {
      this.$store.dispatch('updateSubmitBtn')
      this.$store.dispatch('getApplyBedTypes')
      this.$store.dispatch('getGender')
      this.$store.dispatch('getImgCode')
      // 获取加密信息
      this.getEncryptionInfo()
    },
    destroyed () {
      this.$store.dispatch('updateSmsButton')
      this.$store.dispatch('clearSmsInterval')
    }
  }

  // 输入一个日期和要增加或减少的天数, 返回结果日期
  function addDate (date, addDay) {
    let a = new Date(date)
    a = a.valueOf()
    a = a + addDay * 24 * 60 * 60 * 1000
    a = new Date(a)
    return a
  }

  // 格式化时间
  function getDate (day) {
    return day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
  }
</script>
<style lang="scss">
  @import '../Booking/style/booking.scss';
</style>
