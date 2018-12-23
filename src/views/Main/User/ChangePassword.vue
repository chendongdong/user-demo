<template>
  <div id="change-pwd">
    <div class="app-header">
      <x-header :left-options="{showBack: false}">{{title}}
        <a slot="right"></a>
        <a slot="left" class="vux-header-back" @click="$router.push({name: 'Setting'})">返回</a>
      </x-header>
    </div>
    <div class="app-content">
      <group v-if="passwordType == 'loginPwd'">
        <x-input title="旧密码:" name="passwordBefore" type="password" placeholder="请输入原始密码" v-model="password.oldPwd"></x-input>
        <x-input title="新密码:" name="password" type="password" placeholder="请输入新密码" v-model="password.newPwd"></x-input>
        <x-input title="确认新密码:" name="passwordCheck" type="password" placeholder="请确认新密码" v-model="password.checkPwd"></x-input>
      </group>
      <group v-if="passwordType == 'payPwd'">
        <!--手机号-->
        <!--onKeypress中js方法是为了限制该input不能输入空格-->
        <x-input title="*手机号"
                 placeholder="请输入手机号码"
                 keyboard="number"
                 is-type="china-mobile"
                 v-model='phone'
                 onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false">
        </x-input>
        <x-input title="*校验码" placeholder="请输入校验码" v-model="password.imageCode" style="height: 30px;">
          <img slot="right" :src="imgCode" style="max-height: 40px; margin-top: 5px;" @click="refreshImageCode">
        </x-input>
        <x-input title="*验证码" placeholder="请输入短信验证码" v-model="password.smsCode" :min="6"
                 :max="6">
          <x-button type="default"
                    mini
                    slot="right"
                    @click.native="sendSmsCode"
                    :disabled="updateSmsButton.isSending">{{updateSmsButton.title}}
          </x-button>
        </x-input>
        <x-input title="新密码:" name="password" type="password" placeholder="请输入新密码" v-model="password.newPwd"></x-input>
        <x-input title="确认新密码:" name="passwordCheck" type="password" placeholder="请确认新密码" v-model="password.checkPwd"></x-input>
      </group>
      <div class="conform" style="padding: 30px;max-width: 90%">
        <x-button class="login-button" @click.native="onSubmit" type="primary">提交</x-button>
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
  import { XHeader, XButton, Group, Cell, XInput, Toast, Alert } from 'vux'
  import { mapGetters } from 'vuex'
  export default {
    components: {XHeader, Group, Cell, XButton, XInput, Toast, Alert},
    computed: {
      ...mapGetters({
        isChangeSuccess: 'isChangePwdSuccess',
        updateSmsButton: 'updateSmsButton',
        imgCode: 'imgCode'
      })
    },
    data: function () {
      return {
        title: '',
        passwordType: '',
        phone: '',
        password: {
          oldPwd: '',
          newPwd: '',
          checkPwd: '',
          smsCode: '',
          imageCode: ''
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
    watch: {
      phone (val) {
        if (val && (/^1[3|4|5|7|8]\d{9}$/).test(val)) {
          this.$store.dispatch('updateSmsButton', {isSending: false})
        } else {
          this.$store.dispatch('updateSmsButton', {isSending: true})
        }
      }
    },
    methods: {
      onSubmit () {
        let _oldPwd = this.password.oldPwd
        let _newPwd = this.password.newPwd
        let _checkPwd = this.password.checkPwd
        let _phone = this.phone
        let _smsCode = this.password.smsCode
        let _imageCode = this.password.imageCode

        // 修改登录密码
        if (this.passwordType === 'loginPwd') {
          if (!_oldPwd || !_newPwd || !_checkPwd) {
            this.$vux.alert.show({title: '提示', content: '请输入密码'})
          } else if (_oldPwd.length < 6 || _newPwd.length < 6 || _checkPwd.length < 6) {
            this.$vux.alert.show({title: '提示', content: '密码位数不能小于6位, 请确认后重新输入!'})
          } else if (_checkPwd !== _newPwd) {
            this.$vux.alert.show({title: '提示', content: '新密码先后两次密码输入不一致, 请重新输入!'})
          } else if (_newPwd === _oldPwd) {
            this.$vux.alert.show({title: '提示', content: '新密码不能与旧密码相同, 请重新输入!'})
          } else {
            this.$store.dispatch('changePassword', {
              form: {
                new_password: _newPwd,
                old_password: _oldPwd,
                phone: this.$auth.user().account,
                sms_code: ''
              },
              _this: this
            })
          }
          // 修改支付密码
        } else if (this.passwordType === 'payPwd') {
          if (!(/^1[3|4|5|7|8]\d{9}$/).test(_phone)) {
            this.$vux.alert.show({title: '提示', content: '请输入正确的手机号码'})
          } else if (_imageCode.length !== 4) {
            this.$vux.alert.show({title: '提示', content: '校验码不正确'})
          } else if (_smsCode.length !== 6) {
            this.$vux.alert.show({title: '提示', content: '短信验证码不正确'})
          } else if (_newPwd.length < 6 || _checkPwd.length < 6) {
            this.$vux.alert.show({title: '提示', content: '密码位数不能小于6位'})
          } else if (_checkPwd !== _newPwd) {
            this.$vux.alert.show({title: '提示', content: '新密码先后两次密码输入不一致, 请重新输入!'})
          } else {
            this.$store.dispatch('changePayPassword', {
              form: {
                password: _newPwd,
                phone: _phone,
                sms_code: _smsCode
              },
              _this: this
            })
          }
        }
      },
      showAlert (msg) {
        this.alertMessage = {isShow: true, message: msg}
      },
      onAlertMessageHide () {
        if (this.isChangeSuccess) {
          this.$auth.logout({ // 修改密码成功后, 需注销并重新登录
            success (res) {
              if (res.data.status === 200) {
                setTimeout(function () {
                  this.$router.push({path: '/login'})
                }, 100)
              }
            }
          })
        }
      },
      sendSmsCode () {
        this.$store.dispatch('sendSmsCode', {
          imageCode: this.password.imageCode,
          form: {
            phone: this.phone
          },
          _this: this
        })
      },
      refreshImageCode () {
        this.$store.dispatch('getImgCode')
      }
    },
    destroyed () {
      this.$store.dispatch('clearSmsInterval')
    },
    beforeMount () {
      this.$nextTick(function () {
        let query = this.$route.query
        this.passwordType = query.type
        if (query.type === 'loginPwd') { // 修改登录密码
          this.title = '修改登录密码'
        } else if (query.type === 'payPwd') { // 修改支付密码
          this.title = '修改支付密码'
          this.refreshImageCode()
        }
      })
    }
  }
</script>

<style lang="scss">
</style>

