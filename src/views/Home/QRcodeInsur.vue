<template>
  <div class="home">
    <div class="app-header">
      <x-header :left-options="{showBack: false, backText: '返回'}">保险购买</x-header>
    </div>
    <div class="app-content">
      <div v-if="isShowPhone">
        <!--填写手机号码-->
        <group title="医秘99账号：">
          <x-input type="text" placeholder="请输入手机号码" v-model="phone"></x-input>
        </group>
        <div style="padding: 40px 20px;">
          <x-button text="下一步" @click.native="next" type="primary" style="height: 40px;font-size: 16px;"></x-button>
        </div>
      </div>
      <div v-if="insurCategorys && insurCategorys.list.length > 1 && qrType == 'doc'">
        <recom-insur type="qrcode" @buy-click="buyInsurance"></recom-insur>
      </div>
    </div>
  </div>
</template>
<!--1.先获取医生的手机号，掉接口去获取医生信息->
<!--2.判断是否登录，已经登录直接跳转3，否则填写患者手机，掉接口自动注册跳转到3-->
<!--3.掉接口获取科室险种，有多个险种，则显示险种列表，否则跳转4-->
<!--4.购买保险界面-->
<script>
  import {XHeader, XInput, Group, XButton} from 'vux'
  import { mapGetters } from 'vuex'
  import RecomInsur from 'components/home-menu/RecomInsur'
  import BridgeUtil from '../../utils/bridgeUtil/index'

  export default {
    components: {
      XHeader, XInput, Group, XButton, RecomInsur
    },
    computed: {
      ...mapGetters([
        'encryptionDetail',
        'insurCategorys',
        'autoRegisterMsg'
      ])
    },
    watch: {
      autoRegisterMsg (val) {
        if (val) {
          this.$store.dispatch('clearAutoRegister')
          this.getInsurData()
          this.isShowPhone = false
        }
      },
      encryptionDetail (val) {
        if (val.data.dept_id) {
          this.deptId = val.data.dept_id
          if (this.$auth.check()) {
            this.next()
          }
        }
      },
      insurCategorys (val) {
        if (this.qrType === 'doc') {
          if (val.list.length === 0) {
            this.$vux.confirm.show({
              title: '提示',
              content: '该医生还没有关联保险',
              onConfirm () {
                this.$router.push({name: 'Home'})
              }
            })
          } else if (val.list.length === 1) {
              // 跳转到购买保险
            this.buyInsurance(val.list[0])
          }
        } else if (this.qrType === 'sale') {
          for (let i = 0; i < val.list.length; i++) {
            if (val.list[i].id === Number(this.insurId)) {
              this.buyInsurance(val.list[i])
              break
            }
          }
        }
      }
    },
    data () {
      return {
        saleAccount: '',
        insurId: '',
        docId: 0,
        deptId: 0,
        phone: '',
        isShowPhone: false,
        qrType: ''
      }
    },
    methods: {
      next () {
        // 自动注册
        this.phone = this.phone.replace(/(^\s*)|(\s*$)/g, '')
        if (this.qrType === 'doc') {
          this.$store.dispatch('autoRegister', {doctor_id: this.encryptionDetail.data.doctor_id, phone: this.phone})
        } else if (this.qrType === 'sale') {
          this.$store.dispatch('autoRegister', {phone: this.phone})
        }
        // 保存患者填写的手机号码
        window.sessionStorage.setItem('insur-phone', this.phone)
      },
      getInsurData () {
        let data
        if (this.qrType === 'doc') {
          data = {
            dept_id: this.deptId,
            page_number: 1,
            page_size: 10000
          }
        } else if (this.qrType === 'sale') {
          data = {
            page_number: 1,
            page_size: 10000
          }
        }
        this.$store.dispatch('getInsurCate', data)
      },
      buyInsurance (item) {
        if (item.has_detail) {
          this.$router.push({path: '/insurance/introduce/' + item.id})
        } else {
          let url = ''
          if (item.code === 'myaxzhbx') { // id=2: 母婴安心险 新建保
            // 扫一扫二维码推荐,母婴安心险 新建保
            if (this.qrType === 'doc') {
              // 医生推荐
              url = item.url + this.phone + '&platform_info=D' + this.encryptionDetail.data.doctor_account
            } else if (this.qrType === 'sale') {
              // 业务员推荐
              url = item.url + this.phone + '&platform_info=S' + this.saleAccount
            }
          } else { // 人保
            url = item.url
          }

          // iOS APP 打开, 使用APP进行跳转
          if (BridgeUtil.isiOSApp) {
            BridgeUtil.iOS.push(url)
          } else {
            window.location.href = url
          }
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        if (this.$auth.check()) {
          this.phone = this.$auth.user().account
        } else {
          this.isShowPhone = true
        }
        if (this.$route.path.indexOf('doc') > 0) {
          this.qrType = 'doc'
          this.docId = this.$route.params.id
          this.$store.dispatch('getEncryptionDoctorDetail', this.docId)
        } else if (this.$route.path.indexOf('sale') > 0) {
          this.qrType = 'sale'
          this.insurId = this.$route.params.insurId
          this.saleAccount = this.$route.params.saleAccount
          if (this.$auth.check()) {
            this.next()
          }
        }
        let pageParams = {
          browser_type: 'h5',
          page_name: 'h5患者端-扫二维码购买保险界面',
          req_url: this.$route.path,
          terminal_type: 'user'
        }
        this.$store.dispatch('pageStatis', pageParams)
      })
    }
  }
</script>
<style lang="scss">
  @import "style/home.scss";
</style>
