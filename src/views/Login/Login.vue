<template>
  <div class="login">
    <x-header :left-options="{showBack: false}">医秘登录</x-header>
    <div class="content">
      <!--提示-->
      <div class="explanation">
        <!--<p class="primary-font">请输入您的医秘账号和密码进行登录</p>-->
        <!--<img src="../../assets/logo.png" alt="">-->
      </div>

      <!--账号和密码输入框-->
      <div class="input-group">
        <x-input title="" class="username" placeholder="请输入账号" v-model="form.userMobile" :show-clear="false">
          <i slot="label" class="fa fa-user-o" style="color:#7B7B8C;font-size: 22px;padding-right: 10px;"></i>
        </x-input>
        <x-input title="密码：" type="password" class="password" placeholder="请输入密码" v-model="form.userPwd" :show-clear="false">
          <i slot="label" class="fa fa-lock" style="color:#7B7B8C;font-size: 26px;padding-right: 10px;"></i>
        </x-input>
      </div>

      <!--注册账号和忘记密码-->
      <div class="btn-group-1">
        <check-icon class="pull-left" :value.sync="isRemPwd" style="margin: 10px; display: inline-block">记住密码</check-icon>
        <div class="pull-right" @click="go2ForgetPwd()" style="margin:10px">忘记密码？</div>
      </div>

      <!--登录-->
      <div class="confirm">
        <x-button class="login-button" @click.native="onSubmit" type="primary">立即登录</x-button>
        <x-button class="login-button" @click.native="go2Register()" type="default">没有账号，请先注册</x-button>
      </div>
    </div>
    <loading v-model="isLoading" text="登录中..."></loading>

    <alert v-model="alertMessage.isShow" title="提示">
      <div v-html="alertMessage.message"></div>
    </alert>

  </div>
</template>
<script>
  import { XHeader, XButton, Group, XInput, Alert, Loading, CheckIcon } from 'vux'
  import { SESSION_DATA, LOCATION_DATA } from '../../config/sessionStorage'

  export default {
    components: {
      XHeader,
      Group,
      XButton,
      XInput,
      Alert,
      Loading,
      CheckIcon
    },
    data: function () {
      return {
        isLoading: false,
        form: {
          userMobile: '',
          userPwd: ''
        },
        alertMessage: {
          isShow: false,
          message: ''
        },
        isRemPwd: true
      }
    },
    watch: {},
    methods: {
      go2Register () {
        this.$router.push({name: 'CheckPhone', query: {type: 'register'}})
      },
      go2ForgetPwd () {
        this.$router.push({name: 'CheckPhone', query: {type: 'forgetPwd'}})
      },

      /**
       * 登录
       */
      onSubmit () {
        let _mobile = this.form.userMobile
        let _pwd = this.form.userPwd
        let errorMsgArr = []

//        if (!(/^1[3|4|5|7|8]\d{9}$/).test(_mobile)) {
        if (_mobile.length < 6 || _mobile.length > 24) {
          errorMsgArr.push('请输入正确的账号')
        }
        if (!_pwd) {
          errorMsgArr.push('请输入密码')
        }

        if (errorMsgArr.length) {
          this.alertMessage.isShow = true
          this.alertMessage.message = errorMsgArr.join('<br/>')
          errorMsgArr = []
        } else { // 没有错误, 进行登录
          this.isLoading = true
          let wxCode = window.sessionStorage.getItem(SESSION_DATA.WE_CHAT_CODE)
          if (wxCode) {
            wxCode = JSON.parse(wxCode)
          }
          let _this = this
          this.$auth.login({
            body: {
              account: _mobile,
              password: _pwd,
              accountType: 'user',
              wechat_code: wxCode
            },
            rememberMe: false,
            success (res) {
              this.isLoading = false
              window.localStorage.setItem('IS_REM_PWD', JSON.stringify(this.isRemPwd))
              window.sessionStorage.setItem('IS_FIRST', 'logined')
              let qrCodeData = window.localStorage.getItem(LOCATION_DATA.QRCODE_DEPT)
              if (qrCodeData) {
                _this.$router.push({path: '/main/special-dept/' + JSON.parse(qrCodeData).deptId})
              } else {
                _this.$router.push({path: '/main/home'})
              }
            },
            error (err) {
              this.isLoading = false
              this.alertMessage.isShow = true
              if (err.body) {
                if (err.body.status === 401 || err.status === 401) { // 账号或者密码错误
                  this.alertMessage.message = '账号或密码错误!'
                }
              } else {
                this.alertMessage.message = '登录失败, 请稍后再试!'
              }
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  @import 'styles/login.scss';
</style>
