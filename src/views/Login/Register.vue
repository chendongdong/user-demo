<template>
  <div class="register">
    <x-header :left-options="{showBack: true, backText: '返回'}">注册</x-header>
    <div class="content">
      <!--提示-->
      <div class="explanation">
        <p class="primary-font explanation-title">请设置您的医秘账号的密码</p>
      </div>

      <!--账号和密码输入框-->
      <group class="input-group">
        <x-input title="输入密码：" type="password" placeholder="请输入密码" v-model="form.pwd"></x-input>
        <x-input title="确认密码：" type="password" placeholder="请确认密码" v-model="form.checkPwd"></x-input>
      </group>

      <!--<div style="padding: 10px;">-->
      <!--<mt-switch v-model="value1" @change="handleChange">-->
      <!--<label>同意 <a href="/user-agreement">《医秘约床平台服务协议》</a></label>-->
      <!--</mt-switch>-->
      <!--</div>-->

      <!--登录-->
      <div class="confirm">
        <x-button class="login-button" @click.native="onSubmit" type="primary">立即注册</x-button>
      </div>
    </div>
    <toast v-model="toastMessage.isShow" type="text" width="20em">{{toastMessage.message}}</toast>
    <alert v-model="alertMessage.isShow"
           title="提示"
           @on-hide="onAlertMessageHide">
      {{alertMessage.message}}
    </alert>
  </div>
</template>
<script>
  import { XHeader, XButton, Group, XInput, Toast, Alert } from 'vux'
  import { mapGetters } from 'vuex'
  import {SESSION_DATA} from '../../config/sessionStorage'
  export default {
    components: {XHeader, Group, XButton, XInput, Toast, Alert},
    computed: {
      ...mapGetters({
        isRegisterSuccess: 'isRegisterSuccess'
      })
    },
    data: function () {
      return {
        phoneInfo: {},
        form: {
          pwd: '',
          checkPwd: ''
        },
        value: '',
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
    watch: {},
    methods: {
      /**
       * 存储手机号码和验证码, 到注册界面, 再发起注册
       */
      onSubmit () {
        let _pwd = this.form.pwd
        let _checkPwd = this.form.checkPwd

        if (_pwd.length < 6) {
          this.showAlert('密码不应小于6位')
        } else if (_pwd !== _checkPwd) {
          this.showAlert('两次设置的密码不一致, 请重新输入')
        } else {
          // 发起注册
          let form = {
            password: _pwd,
            phone: this.phoneInfo.phone,
            sms_code: this.phoneInfo.sms
          }
          // 注册患者来源，扫科室二维码或者客户端平台（分为公众号和app）
          let registerStatic = window.sessionStorage.getItem(SESSION_DATA.REGISTER_STATIC)
          if (registerStatic) {
            registerStatic = JSON.parse(registerStatic)
            form.reg_type = registerStatic.type
            form.from_dept_id = registerStatic.deptId
          } else {
            let code = window.sessionStorage.getItem(SESSION_DATA.WE_CHAT_CODE)
            if (code) {
                // 公众号进入
              form.reg_type = 3
            } else {
                // app进入
              form.reg_type = 8
            }
          }
          this.$store.dispatch('register', {form: form, _this: this})
        }
      },
      showAlert (msg) {
        this.alertMessage = {isShow: true, message: msg}
      },
      onAlertMessageHide () {
        // 注册成功, 跳转到登录界面
        if (this.isRegisterSuccess) {
          this.$router.push({path: '/login'})
        }
      }
    },
    mounted () {
      this.phoneInfo = JSON.parse(window.sessionStorage.getItem('registerInfo'))
    },
    beforeMount () {
    }
  }
</script>

<style lang="scss">
  @import 'styles/register.scss';
</style>

