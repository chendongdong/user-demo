<template>
  <div class="insurance-apply">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}" v-if="insurInfos.name">{{insurInfos.name}}</x-header>
    </div>
    <div class="app-content" v-if="insurCategorys&&insurInfos.id">
      <group title="保障项目">
        <div class="insur-item">
          <p>投保份数：<span class="number">1份</span></p>
          <p>每份：</p>
          <p v-for="(range, idx) in insurInfos.insur_range" :key="idx" class="range-item">
            {{range.title}}付给{{range.value}}
          </p>
        </div>
      </group>
      <group title="投保人信息" class="content-box">
        <x-input title="*姓名" :max="30" placeholder="请输入" v-model='form.applicant_name' required></x-input>
        <x-input title="*手机号码" type="tel" :max="11" placeholder="请输入" v-model='form.applicant_mobile_telephone' required></x-input>
        <selector title="*证件类型" :options="certTypes" placeholder="请选择" v-model="form.applicant_certificate_type"></selector>
        <x-input title="*证件号码" :max="18" placeholder="请输入" v-model='form.applicant_certificate_no' required></x-input>
        <datetime v-model="form.applicant_birthday" title="出生日期" placeholder="请选择"></datetime>
        <!--<x-input title="出生日期" placeholder="请输入" v-model='form.applicant_birthday' :required="form.applicant_certificate_type!=1"></x-input>-->
        <!--<checklist :options="sexTypes" v-model="appSex" :max="1"></checklist>-->
        <div class="weui-cell sex-cell">
          <label class="weui_label" style="width: 4em;">性别</label>
          <checker v-model="appSex"
                   default-item-class="sex-checker-item"
                   selected-item-class="sex-checker-item-selected"
                   style="height: 25px;">
            <checker-item v-for='list in sexTypes' :key="list.key" :value="list.key">{{list.value}}</checker-item>
          </checker>
        </div>
        <x-input title="地址" :max="100" placeholder="请输入" v-model='form.applicant_address'></x-input>
        <x-input title="电子邮箱" placeholder="请输入" v-model='form.applicant_email'></x-input>
        <x-input title="邮政编码" placeholder="请输入" v-model='form.applicant_postcode'></x-input>
      </group>

      <group title="被投保人信息" class="content-box">
        <selector title="*与投保人关系" :options="relaTypes" placeholder="请选择" v-model="form.relationship_with_applicant"></selector>
        <x-input title="*姓名" placeholder="请输入" v-model='form.name' required></x-input>
        <selector title="*证件类型" :options="certTypes" placeholder="请选择" v-model="form.certificate_type"></selector>
        <x-input title="*证件号码" placeholder="请输入" v-model='form.certificate_no' required></x-input>
        <datetime v-model="form.birthday" title="出生日期" placeholder="请选择"></datetime>
        <!--<x-input title="出生日期" placeholder="请输入" v-model='form.birthday' :required="form.certificate_type!=1"></x-input>-->
        <!--<checklist :options="sexTypes" v-model="sex" :max="1"></checklist>-->
        <div class="weui-cell sex-cell">
          <label class="weui_label" style="width: 4em;">性别</label>
          <checker v-model="sex"
                   default-item-class="sex-checker-item"
                   selected-item-class="sex-checker-item-selected"
                   style="height: 25px;">
            <checker-item v-for='list in sexTypes' :key="list.key" :value="list.key">{{list.value}}</checker-item>
          </checker>
        </div>
        <x-input title="地址" placeholder="请输入" v-model='form.address'></x-input>
      </group>

      <group title="保障时间" class="content-box content-footer">
        <datetime
          placeholder="请选择"
          v-model="form.insurance_begin_date"
          @on-change="changeStartTime"
          title="*开始时间"></datetime>
        <x-input title="结束时间" placeholder="从开始时间起30日内有效" readonly v-model='form.insurance_end_date' disabled></x-input>
      </group>

      <group title="发票" class="content-box content-footer">
        <x-input title="手机号码" type="tel" :max="11" placeholder="请输入" v-model='form.invoke_mobile_phone'></x-input>
        <x-input title="邮箱" placeholder="请输入" v-model='form.invoke_email'></x-input>
      </group>

    </div>

    <div class="footer">
      <flexbox class="footer-box">
        <flexbox-item>
          <x-button type="default btn-money">保费: <span class="footer-btn-money">¥ {{insurInfos.price}}元</span>
          </x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="primary" @click.native="submitBuy">立即投保</x-button>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>
<script>
  import {
    Swiper,
    XHeader,
    XButton,
    Flexbox,
    FlexboxItem,
    PopupPicker,
    Group,
    XInput,
    Tab,
    TabItem,
    SwiperItem,
    Datetime,
    XSwitch,
    Selector,
    Cell,
    Checklist,
    Checker,
    CheckerItem
  } from 'vux'
  import {mapGetters} from 'vuex'
  import CloneData from '../../utils/CloneData'
  import { BaseData } from '../../api'
  import DateUtil from '../../utils/DateUtil'

  export default {
    components: {
      XHeader,
      Swiper,
      XButton,
      Flexbox,
      FlexboxItem,
      PopupPicker,
      Group,
      XInput,
      Tab,
      TabItem,
      SwiperItem,
      Datetime,
      XSwitch,
      Selector,
      Cell,
      Checklist,
      Checker,
      CheckerItem
    },
    computed: {
      ...mapGetters([
        'insurCategorys',
        'isLoadInsur'
      ])
    },
    watch: {
      insurCategorys (val) {
        this.insurInfos = {}
        if (val && val.list.length > 0) {
          CloneData.extend(this.insurInfos, val.list[0])
        }
      }
    },
    data: function () {
      return {
        appSex: [],
        sex: [],
        sexTypes: [
          {
            key: '0',
            value: '女'
          },
          {
            key: '1',
            value: '男'
          }
        ],
        insurInfos: {},
        id: '',
        relaTypes: [],
        certTypes: [],
        form: {
          address: '',
          applicant_address: '',
          applicant_birthday: '',
          applicant_certificate_no: '431124199210134022',
          applicant_certificate_type: '',
          applicant_email: '',
          applicant_mobile_telephone: '18520369621',
          applicant_name: '陈冬冬',
          applicant_postcode: '',
          applicant_sex_code: '',
          apply_num: 1,
          birthday: '',
          category_id: 0,
          certificate_no: '431124199210134022',
          certificate_type: '',
          cpny_id: 3,
          insurance_begin_date: '',
          insurance_end_date: '',
          invoke_email: '',
          invoke_mobile_phone: '',
          name: '陈冬冬',
          recommend_info: '',
          relationship_with_applicant: '',
          sex_code: '',
          total_actual_premium: 0
        },
        errMsg: []
      }
    },
    methods: {
      checkHint () {
        let that = this
        this.$vux.alert.show({
          title: '提示',
          content: that.errMsg.toString(),
          onHide () {
            that.errMsg = []
          }
        })
      },
      submitBuy () {
        this.form.category_id = this.insurInfos.id
        this.form.cpny_id = this.insurInfos.company_id
        this.form.total_actual_premium = this.insurInfos.price
        this.errMsg = []
        if (!this.form.applicant_name.trim()) {
          this.errMsg.push('请输入投保人姓名')
        }
        if (!this.form.name.trim()) {
          this.errMsg.push('请输入被保人姓名')
        }
        let phoneReg = /^1[3|4|5|7|8]\d{9}$/
        if (!this.form.applicant_mobile_telephone.trim()) {
          this.errMsg.push('请输入投保人手机号码')
        } else if (!phoneReg.test(this.form.applicant_mobile_telephone.trim())) {
          this.errMsg.push('请输入投保人正确的手机号')
        }
        if (!this.form.applicant_certificate_type) {
          this.errMsg.push('请选择投保人证件类型')
        }
        if (!this.form.certificate_type) {
          this.errMsg.push('请选择被保人证件类型')
        }
        if (!this.form.applicant_certificate_no.trim()) {
          this.errMsg.push('请输入投保人证件号')
        }
        if (!this.form.certificate_no.trim()) {
          this.errMsg.push('请输入被保人证件号')
        }
        if (!this.form.applicant_birthday.trim() && this.form.applicant_certificate_type !== '1') {
          this.errMsg.push('请选择投保人出生日期')
        }
        if (!this.form.birthday.trim() && this.form.certificate_type !== '1') {
          this.errMsg.push('请选择被保人出生日期')
        }
        if (!this.form.relationship_with_applicant) {
          this.errMsg.push('请选择与投保人关系')
        }
        if (this.sex.length > 0) {
          this.form.sex_code = this.sex[0]
        } else if (this.form.certificate_type !== '1') {
          this.errMsg.push('请选择被保人性别')
        } else {
          delete this.form.sex_code
        }
        if (this.appSex.length > 0) {
          this.form.applicant_sex_code = this.appSex[0]
        } else if (this.form.applicant_certificate_type !== '1') {
          this.errMsg.push('请选择投保人性别')
        } else {
          delete this.form.applicant_sex_code
        }
        if (this.form.invoke_mobile_phone.trim() && !phoneReg.test(this.form.invoke_mobile_phone.trim())) {
          this.errMsg.push('请输入正确的发票手机号')
        }
        let myreg = /\w@\w*\.\w/
        if (this.form.applicant_email.trim() && !myreg.test(this.form.applicant_email.trim())) {
          this.errMsg.push('请输入正确的投保人电子邮箱')
        }
        if (this.form.invoke_email.trim() && !myreg.test(this.form.invoke_email.trim())) {
          this.errMsg.push('请输入正确的发票邮箱')
        }
        let postreg = /^[a-zA-Z0-9 ]{3,12}$/
        if (this.form.applicant_postcode.trim() && !postreg.test(this.form.applicant_postcode.trim())) {
          this.errMsg.push('请输入正确的投保人邮政编码')
        }
        if (this.errMsg.length > 0) {
          this.checkHint()
        } else {
          this.$store.dispatch('subInsurOrder', this.form)
        }
      },
      changeStartTime (val) {
        this.form.insurance_end_date = DateUtil.getAssignDate(val, 30)
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.id = this.$route.params.id
        this.$store.dispatch('getInsurCate', {id: this.id})
        let that = this
        // pingan_relat_type 获取与投保人关系
        BaseData.findDataDict('pingan_relat_type').then(function (res) {
          let data = res.data.data
          for (let i = 0; i < data.length; i++) {
            data[i].value = data[i].val
          }
          that.relaTypes = data
        })
        // pingan_cert_type 获取证件类型
        BaseData.findDataDict('pingan_cert_type').then(function (res) {
          let data = res.data.data
          for (let i in data) {
            data[i].value = data[i].val
          }
          that.certTypes = data
        })
      })
    }
  }
</script>

<style lang="scss">
  @import 'style/InsuranceApply.scss';
</style>



