<template>
  <div class="check-phone">
    <x-header :left-options="{showBack: true, backText: '返回'}">{{title}}</x-header>
    <div class="content">
      <!--提示-->
      <div class="explanation">
        <p class="primary-font">{{expTitle}}</p>
      </div>

      <div class="input-group">
        <x-input title="手机号：" placeholder="请输入手机号" v-model="phone">
          <img slot="label" src="../../assets/image/check_phone_1.png" alt="" style="color:#7B7B8C;font-size: 22px;padding-right: 10px;">
        </x-input>

        <x-input title="校验码：" class="image-code" placeholder="请输入校验码" v-model="imageCode" :show-clear="false">
          <img slot="label" src="../../assets/image/check_phone_2.png" alt="" style="color:#7B7B8C;font-size: 22px;padding-right: 10px;margin-left: -5px;">
          <img slot="right" class="pull-right" :src="imgCode" style="height: 35px;" @click="refreshImg">
        </x-input>

        <x-input title="验证码：" placeholder="请输入验证码" v-model="sms">
          <img slot="label" src="../../assets/image/check_phone_3.png" alt="" style="color:#7B7B8C;font-size: 22px;padding-right: 10px;">
          <x-button mini slot="right" type="default" @click.native="checkPhone" :disabled="updateSmsButton.isSending" style="padding:1px 5px;">{{updateSmsButton.title}}</x-button>
        </x-input>
      </div>


      <!--登录-->
      <div class="confirm">
        <x-button class="login-button" @click.native="onSubmit" type="primary">{{pageType=='register' ? '注册' : '下一步'}}</x-button>
        <x-button class="login-button" @click.native="back" type="default" v-show="pageType=='register' ">已有账号，立即登录</x-button>
      </div>
    </div>
    <toast v-model="toastMessage.isShow" type="text" width="20em">{{toastMessage.message}}</toast>
    <alert v-model="alertMessage.isShow" title="提示">{{alertMessage.message}}</alert>
    {{checkPhoneRet}}
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { XHeader, XButton, Group, XInput, Toast, Alert } from 'vux'

  export default {
    components: {
      XHeader,
      Group,
      XButton,
      XInput,
      Toast,
      Alert
    },
    computed: {
      ...mapGetters({
        updateSmsButton: 'updateSmsButton',
        imgCode: 'imgCode'
      }),
      checkPhoneRet () {
        let ret = this.$store.getters.checkPhoneRet
        if (ret === '0') {
          // 未注册
          this.sendSmsCode()
        } else if (ret === '1') {
          // 已经注册，提示
          this.toastMessage = {
            isShow: true,
            message: '该手机号码已经注册'
          }
        }
        this.$store.dispatch('clearCheckRet')
      }
    },
    data: function () {
      return {
        imageCode: '',
        backPath: '',
        pageType: '',
        title: '',
        expTitle: '',
        phone: '',
        sms: '',
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
      phone (p) {
        // 检查手机号, 手机号符合格式, 则能点击发送短信验证码按钮
        if ((/^1[3|4|5|7|8]\d{9}$/).test(p)) {
          this.$store.dispatch('updateSmsButton', {isSending: false})
        } else {
          this.$store.dispatch('updateSmsButton')
        }
      }
    },
    methods: {
      back () {
        this.$router.go(-1)
      },
      refreshImg () {
        this.$store.dispatch('getImgCode')
      },
      /**
       * 发送短信验证码
       */
      sendSmsCode () {
        this.$store.dispatch('sendSmsCode', {
          _this: this,
          imageCode: this.imageCode,
          form: {
            phone: this.phone
          }
        })
      },
      checkPhone () {
        if (this.pageType === 'register') {
          this.$store.dispatch('checkPhone', {phone: this.phone})
        } else {
          this.sendSmsCode()
        }
      },
      /**
       * 下一步
       */
      onSubmit () {
        let _phone = this.phone
        let _sms = this.sms
        let _imgCode = this.imageCode
        let form = {
          phone: _phone,
          sms: _sms,
          imageCode: _imgCode
        }
        if (!(/^1[3|4|5|7|8]\d{9}$/).test(_phone) || !(/^\d{6}$/).test(_sms) || !_imgCode.length) {
          this.alertMessage = {isShow: true, message: '手机号码或者验证码不正确'}
        } else {
          if (this.pageType === 'forgetPwd') {
            this.$router.push({name: 'ForgetPassword'})
            window.sessionStorage.setItem('forgetPwdInfo', JSON.stringify(form))
          } else if (this.pageType === 'register') {
            window.sessionStorage.setItem('registerInfo', JSON.stringify(form))
            this.$router.push({name: 'Register'})
//          } else if (this.pageType === 'changePwd') {
//            window.sessionStorage.setItem('changePwdInfo', JSON.stringify(form))
//            this.$router.push({name: 'ChangePassword'})
          }
        }
      }
    },
    destroyed () {
      this.$store.dispatch('clearSmsInterval')
    },
    mounted () {
      this.$nextTick(function () {
        this.$store.dispatch('updateSmsButton')
        this.$store.dispatch('getImgCode')
        this.pageType = this.$route.query.type
        if (this.pageType === 'forgetPwd') {
          this.backPath = '/login'
          this.title = '忘记密码'
          this.expTitle = '请输入您的手机号, 获取验证码'
        } else if (this.pageType === 'register') {
          this.backPath = '/login'
          this.title = '注册'
          this.expTitle = '请输入您的手机号, 获取验证码进行注册'
//        } else if (this.pageType === 'changePwd') {
//          this.backPath = '/user/setting'
//          this.title = '修改登录密码'
//          this.expTitle = '请输入您的手机号, 获取验证码'
        }
      })
    }
  }
</script>

<style lang="scss">
  @import 'styles/checkPhone.scss';
</style>

