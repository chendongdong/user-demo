<template>
  <div class="forget-pwd">
    <x-header :left-options="{showBack: true, backText: '返回'}">忘记密码</x-header>
    <div class="content">
      <!--密码输入框-->
      <group class="input-group">
        <x-input title="输入密码：" type="password" placeholder="请输入密码" v-model="form.pwd"></x-input>
        <x-input title="确认密码：" type="password" placeholder="请确认密码" v-model="form.checkPwd"></x-input>
      </group>

      <!--登录-->
      <div class="confirm">
        <x-button class="login-button" @click.native="onSubmit" type="primary">修改</x-button>
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
  import { mapGetters } from 'vuex'
  import { XHeader, XButton, Group, XInput, Toast, Alert } from 'vux'
  export default {
    components: {XHeader, XButton, Group, XInput, Toast, Alert},
    computed: {
      ...mapGetters({
        isResetSuccess: 'isResetPwdOfForgetSuccess'
      })
    },
    data: function () {
      return {
        phoneInfo: '',
        form: {
          pwd: '',
          checkPwd: ''
        },
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
      onSubmit () {
        let _pwd = this.form.pwd
        let _checkPwd = this.form.checkPwd

        if (_pwd.length < 6) {
          this.showAlert('密码不应小于6位')
        } else if (_pwd !== _checkPwd) {
          this.showAlert('两次设置的密码不一致, 请重新输入')
        } else {
          this.$store.dispatch('forgetLoginPassword', {
            _this: this,
            form: {
              password: _pwd,
              phone: this.phoneInfo.phone,
              sms_code: this.phoneInfo.sms
            }
          })
        }
      },
      showAlert (msg) {
        this.alertMessage = {isShow: true, message: msg}
      },
      onAlertMessageHide () {
        // 注册成功, 跳转到登录界面
        if (this.isResetSuccess) {
          this.$router.push({path: '/login'})
        }
      }
    },
    mounted () {
      this.phoneInfo = JSON.parse(window.sessionStorage.getItem('forgetPwdInfo'))
    },
    beforeMount () {
    }
  }
</script>

<style lang="scss">
  @import 'styles/forgetPwd.scss';
</style>

