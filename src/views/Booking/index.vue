<template>
  <div class="booking">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        医秘约床
      </x-header>
    </div>
    <div class="content" style="margin-top: 46px;">
      <div style="background-color: #eeeeee">
        <span style="color: #999999;padding: 4px;">温馨提醒：</span><br>
        <p style="color: orange;padding: 4px 4px 12px 4px; height: auto;">请您先去门诊进行检查，如需住院，可快速进行约床申请。</p>
      </div>
      <group title="请选择区域和科室信息" v-if="!$route.query.id">
        <cell is-link :value="$refs.areaPicker&&$refs.areaPicker.getNameValues()" @click.native="isShowAreaPopupPicker=true">
          <span slot="title" class="custom-cell-title" >
            <span class="custom-mark">*</span>
            <span style="vertical-align:middle;">选择地区</span>
          </span>
        </cell>
        <cell is-link :value="$refs.hosPicker&&$refs.hosPicker.getNameValues()" @click.native="showHosPickerClick">
          <span slot="title" class="custom-cell-title" >
            <span class="custom-mark">*</span>
            <span style="vertical-align:middle;">选择医院</span>
          </span>
        </cell>
        <cell is-link :value="$refs.deptPicker&&$refs.deptPicker.getNameValues()" @click.native="showDeptPickerClick">
          <span slot="title" class="custom-cell-title" >
            <span class="custom-mark">*</span>
            <span style="vertical-align:middle;">选择科室</span>
          </span>
        </cell>

        <popup-picker ref="areaPicker"
                      :data="localData"
                      v-model="locationValue"
                      :show.sync="isShowAreaPopupPicker"
                      :show-cell="false"
                      @on-shadow-change="onLocationChange"
                      @on-hide="onLocationPickerHide">
        </popup-picker>
        <popup-picker ref="hosPicker"
                      :data="hospitalsList"
                      :columns="1"
                      v-model="hosValue"
                      :show.sync="isShowHosPopupPicker"
                      :show-cell="false"
                      @on-hide="onHosPickerHide">
        </popup-picker>
        <popup-picker ref="deptPicker"
                      :data="departmentsList"
                      :columns="1"
                      :show.sync="isShowDeptPopupPicker"
                      :show-cell="false"
                      @on-hide="onDeptPickerHide"
                      v-model="deptValue">
        </popup-picker>
      </group>

      <div v-if="$route.query.id">
        <!--约医院的床-->
        <div class="booking-info" v-if="$route.query.t==='hospital'">
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
        <div class="booking-info" v-if="$route.query.t==='department'">
          <p><span class="title">预约医院：</span>{{ deptInfos.hospital_name }}</p>
          <p><span class="title">预约科室：</span>{{ deptInfos.dept_name }}</p>
          <span v-if="deptInfos.deposits > 0" style="font-size: 14px;color: #999999">需支付预约押金:
            <span style="color: orange">{{deptInfos.deposits}}</span>元
          </span>
        </div>
        <!--约医生的床-->
        <div class="booking-info" v-if="$route.query.t==='doctor'">
          <p><span class="title">预约医院：</span>{{ doc_doctor.hos_name }}</p>
          <p><span class="title">预约科室：</span>{{ doc_doctor.dept_name }}</p>
          <p><span class="title">预约医生：</span>{{ doc_doctor.name }}</p>
          <span v-if="doc_doc_dept.deposits > 0" style="font-size: 14px;color: #999999">需支付预约押金:
            <span style="color: orange">{{doc_doc_dept.deposits}}</span>元
          </span>
        </div>
      </div>

      <!--患者信息-->
      <group title="*账户信息">
        <!--手机号-->
        <!--onKeypress中js方法是为了限制该input不能输入空格-->
        <x-input placeholder="请输入手机号码"
                 keyboard="number"
                 is-type="china-mobile"
                 v-model='patientPhone'
                 onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false">
          <span slot="label" style="padding-right:10px;font-size: 15px; display:block;"><span style="color: red;">*</span>手机号</span>
        </x-input>
        <x-input placeholder="请输入校验码" v-model="bookingForm.imageCode" style="height: 30px;">
          <span slot="label" style="padding-right:10px;font-size: 15px; display:block;"><span style="color: red;">*</span>校验码</span>
          <img slot="right" :src="imgCode" style="max-height: 40px; margin-top: 5px;" @click="refreshImageCode">
        </x-input>
        <x-input placeholder="请输入短信验证码" v-model="bookingForm.sms_code" :min="6"
                 :max="6">
          <span slot="label" style="padding-right:10px;font-size: 15px; display:block;"><span style="color: red;">*</span>验证码</span>
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
        <x-input placeholder="请输入您的真实姓名" v-model='bookingForm.patient_name'>
          <span slot="label" style="padding-right:10px;font-size: 15px; display:block;"><span style="color: red;">*</span>姓名</span>
        </x-input>
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
          <label class="weui_label" style="width: 4em;"><span style='color: red;'>*</span>性别</label>
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
        <datetime title="<span style='color: red;'>*</span>期望入院日期"
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

        <x-switch title="是否复诊" v-model="isReturnRemind" @on-change="returnRemindSwitchChange"></x-switch>
        <!--开始提醒时间-->
        <datetime title="开始提醒时间"
                  v-model="bookingForm.notify_template.start_time"
                  :start-date="startDate"
                  :end-date="endDate"
                  v-show="isReturnRemind"
                  format="YYYY-MM-DD HH:mm">
        </datetime>
        <x-switch title="是否连续提醒"
                  v-model="isNeedLongRemind"
                  v-show="isReturnRemind"
                  @on-change="longRemindSwitchChange">
        </x-switch>
        <popup-picker title="提醒频率"
                      v-show="isNeedLongRemind && isReturnRemind"
                      :data="remindFrequencyData"
                      v-model="remind_frequency"
                      placeholder="选择提醒频率"
                      show-name>
        </popup-picker>
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

      <!-- 提交约床按钮 -->
      <div class="booking-action" style="margin-top: 20px;">
        <x-button style="width: 80%;margin: 10px auto;height: 40px;font-size: 15px;background-color: #68C84F"
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
      <alert v-model="alertMessage.isShow" title="提示">
        <div v-html="alertMessage.message"></div>
      </alert>
    </div>

  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import GSelect from 'components/Select/'
  import DateUtil from '../../utils/DateUtil'
  import moment from 'moment'
  import {
    XHeader,
    Cell,
    XButton,
    Group,
    XInput,
    CheckerItem,
    Checker,
    Datetime,
    XTextarea,
    Picker,
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
    XSwitch
  } from 'vux'

  export default {
    components: {
      GSelect,
      XHeader,
      Cell,
      XButton,
      Group,
      XInput,
      CheckerItem,
      Checker,
      Datetime,
      XTextarea,
      Picker,
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
      XSwitch
    },
    computed: {
      ...mapGetters({
        updateSmsButton: 'updateSmsButton',
        gender: 'gender',
        deptSetting: 'deptSetting',
        applyBedTypes: 'ApplyBedTypeByDeptData',
        deptInfos: 'deptInfos',
        hospitalsInfo: 'hospitalsInfo',
//        doctorInfo: 'doctorInfo',
        updateSubmitButton: 'updateSubmitButton',
        allProvinceCities: 'allProvinceCities',
        hospitals: 'hospitalDataByArea',
        departments: 'allDeptOfHos',
        doc_doctor: 'doc_doctor',
        doc_doc_dept: 'doc_doc_dept',
        imgCode: 'imgCode',
        localData: 'localData'
      }),
      deptSettingData () {
        let setting = this.deptSetting.params.slice()
        return (setting || []).map(s => {
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
        nowProvinceID: '',
        nowCityID: '',
        nowAreaID: '',
        isShowAreaPopupPicker: false,
        isShowHosPopupPicker: false,
        isShowDeptPopupPicker: false,
        patientPhone: '',
        remind_frequency: [],

        // startDate: new Date(),
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
          imageCode: '',
          // start_remind_time: moment().format('L'),
          notify_flag: 1, // 1: 不提醒, 2:提醒
          notify_template: {
            // id: 0,
            interval_sec: 0,
            // notify_point: [],
            // notify_target: '',
            notify_time: 1,
            params: {
              doctor_name: '',
              return_time: '',
              remark: '',
              hos_name: ''
            },
            start_time: '',
            type: 2,
            valid: 1
          }
        },
        locationValue: [],
        hosValue: [],
        deptValue: [],
        applyInTime: '',
        latestTime: '',
        priValues: [],  // 科室优先级
        isShowBedPopup: false,
        bedTypeName: '不限', //  在cell展示的床位名称
        isIdentityTrue: true, // 身份证号码是否正确, 默认为true, 如果用户没填, 默认不提示
        alertMessage: {
          isShow: false,
          message: ''
        },
        isReturnRemind: false,
        isNeedLongRemind: false,
        startDate: moment().format('L'),
        endDate: moment().add(3, 'years').format('L')
      }
    },
    watch: {
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
//      doctorInfo: function (val) {
//        this.$store.dispatch('getDeptInfo', val.dept_id)
//      },
      deptInfos: function (val) {
        this.bookingForm.dept_id = val.dept_id
        this.getDeptSetting(val.dept_id)
      },
      doc_doctor (doc) {
        this.bookingForm.dept_id = doc.dept_id
        this.getDeptSetting(doc.dept_id)
      }
    },
    methods: {
      /**
       *  地区picker改变
       */
      onLocationChange (val) {
        let provinceID = val[0]
        if (this.nowProvinceID !== provinceID) {
          this.$store.dispatch('getCity', provinceID)
          this.nowProvinceID = provinceID
        }
        if (val.length > 1) {
          var cityID = val[1]
          if (this.nowCityID !== cityID) {
            this.$store.dispatch('getArea', cityID)
            this.nowCityID = cityID
          }
        }
        this.nowAreaID = val[val.length - 1]
      },
      /**
       *  地区picker点击确定
       */
      onLocationPickerHide (closeType) {
        if (closeType) {
          this.hosValue = []
          this.$store.dispatch('cleanAreaHospitals')
          this.$store.dispatch('cleanAllDeptOfHos')
          let area = this.locationValue
          this.$store.dispatch('getHospitalByArea', area[area.length - 1])
        }
      },
      /**
       * 医院picker点击了确定
       */
      onHosPickerHide (closeType) {
        if (closeType) {
          this.deptValue = []
          if (this.hosValue.length) {
            this.$store.dispatch('cleanAllDeptOfHos')
            this.$store.dispatch('getAllDepartments', this.hosValue[0])
          }
        }
      },
      /**
       * 科室picker点击了确定
       */
      onDeptPickerHide (closeType) {
        if (closeType) {
          let deptId = this.deptValue
          this.bookingForm.dept_id = deptId[0]
          //  获取科室优先级信息
          this.getDeptSetting(deptId[0])
        }
      },
      /**
       * 点击医院picker
       */
      showHosPickerClick () {
        if (!this.locationValue.length) {
          this.showToast('请先选择地区')
        } else if (!this.hospitalsList.length) {
          this.showToast('该地区暂无可选择医院, 敬请期待!', '16em')
        } else {
          this.isShowHosPopupPicker = true
        }
      },
      /**
       * 点击科室picker
       */
      showDeptPickerClick () {
        if (!this.hosValue.length) {
          this.showToast('请先选择医院')
        } else if (!this.departmentsList.length) {
          this.showToast('暂无科室, 敬请期待!', '16em')
        } else {
          this.isShowDeptPopupPicker = true
        }
      },
      /**
       * 是否提醒切换
       */
      returnRemindSwitchChange (currentValue) {
        if (currentValue) {
          this.bookingForm.notify_flag = 2
          this.bookingForm.notify_template.start_time = moment().format('YYYY-MM-DD HH:mm')
        } else {
          this.bookingForm.notify_flag = 1
          this.bookingForm.notify_template.start_time = ''
          this.isNeedLongRemind = false
          this.remind_frequency = []
        }
      },
      /**
       * 连续提醒切换
       */
      longRemindSwitchChange (currentValue) {
        // 连续提醒时(currentValue==true), notify_time设为0
        if (currentValue) {
          this.bookingForm.notify_template.notify_time = 0
        } else {
          this.bookingForm.notify_template.notify_time = 1
          this.remind_frequency = []
        }
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
          this.showAlert('出生日期不能大于今日')
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
          this.showAlert('期望入院日期不能小于今天')
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
          this.showAlert('最迟入院日期不能小于今天')
          setTimeout(() => {
            this.latestTime = nowTime
          }, 1000)
        }
        if (this.applyInTime) {
          if (d < this.applyInTime) {
            this.showAlert('最迟入院日期不能小于期望入院日期')
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
      sendSmsCode () {
        this.$store.dispatch('sendSmsCode', {
          imageCode: this.bookingForm.imageCode,
          form: {
            phone: this.bookingForm.patient_phone
          },
          _this: this
        })
      },
      checkIdentity (id) {
        if (id) {
          // 如果用户输入了身份证信息, 则进行校验
          this.$store.dispatch('checkVerifyId', {id: id, _this: this})
        } else {
          // 如果用户清除了身份证信息, 则不校验
          this.isIdentityTrue = true
        }
      },
      onSubmit () {
        let _dept = this.deptValue
        let _deptID = this.bookingForm.dept_id
        let _gender = this.bookingForm.patientGender
        let _applyTime = this.bookingForm.patient_apply_in_time
        let _realName = this.bookingForm.patient_name
        let _phone = this.bookingForm.patient_phone
        let _sms = this.bookingForm.sms_code
        let _imgCode = this.bookingForm.imageCode
        let _startRemindTime = this.bookingForm.notify_template.start_time
        let _remindFrequency = this.remind_frequency
        let errorMsgArr = []

        if (!this.$route.query.id) {
          if (!_dept.length) {
            errorMsgArr.push('请选择科室')
          }
        } else {
          if (this.$route.query.t === 'hospital' && _deptID.length === 0) {
            errorMsgArr.push('请选择科室')
          }
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
        if (this.isReturnRemind) { // 如果需要复诊提醒, 则检查提醒和是否连续提醒
          if (!_startRemindTime) {
            errorMsgArr.push('请选择开始提醒时间')
          }
          if (this.isNeedLongRemind) {
            if (!_remindFrequency.length) {
              errorMsgArr.push('请选择提醒频率')
            } else {
              this.bookingForm.notify_template.interval_sec = _remindFrequency[0]
            }
          }
        }
        // 设置提醒的医生/医院等信息
        let hosName = ''
        let docName = ''
        if (this.$route.query.t === 'doctor') {
          docName = this.doc_doctor.name
          hosName = this.doc_doctor.hos_name
        } else if (this.$route.query.t === 'department') {
          hosName = this.deptInfos.hospital_name
        } else if (this.$route.query.t === 'hospital') {
          hosName = this.hospitalsInfo.base_info.hos_name
        } else {
          let hos = this.hospitalsList.filter(function (hos) {
            return hos.value === this.hosValue[0]
          }, this)
          if (hos.length && hos[0].name) {
            hosName = hos[0].name
          }
        }
        this.bookingForm.notify_template.params.hos_name = hosName
        this.bookingForm.notify_template.params.doctor_name = docName

        // console.log('form---->', this.bookingForm)
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
      showAlert (msg) {
        this.$vux.alert.show({
          title: '提示',
          content: msg
        })
      },
      showToast (msg, width = '8em', type = 'cancel') {
        this.$vux.toast.show({
          text: msg,
          width: width,
          type: type
        })
      }
    },
    mounted () {
      this.$store.dispatch('updateSubmitBtn')
      this.$store.dispatch('getGender')
      this.$store.dispatch('getImgCode')
      this.$store.dispatch('findDataDict', 'msg_return_notify_sec_type') // 提醒频率

      let query = this.$route.query
      if (query.id) {
        // 从医院约床
        if (query.t === 'hospital') {
          this.$store.dispatch('getProvince')
          this.$store.dispatch('getHospitalInfo', query.id)

          // 从科室约床
        } else if (query.t === 'department') {
          this.$store.dispatch('getDeptInfo', query.id)

          // 从医生约床
        } else if (query.t === 'doctor') {
          this.bookingForm.recommend_id = query.id
          this.$store.dispatch('getDoctor', query.id)
        }
      } else {
        this.$store.dispatch('getProvince')
      }
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
  @import 'style/booking.scss';
</style>

