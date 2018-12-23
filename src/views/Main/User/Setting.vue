<template>
  <div id="setting">
    <div class="app-header">
      <x-header :left-options="{showBack: false}">设置
        <a slot="right"></a>
        <a slot="left" class="vux-header-back" @click="$router.push({name: 'User'})">返回</a>
      </x-header>
    </div>
    <div class="app-content">
      <group>
        <cell title="修改登录密码" is-link :link="{name: 'ChangePassword', query:{type: 'loginPwd'}}"></cell>
        <cell title="修改支付密码" is-link :link="{name: 'ChangePassword', query:{type: 'payPwd'}}"></cell>
        <cell title="意见反馈" is-link :link="{name: 'Suggest', params: {phone: this.$auth.user().account}}"></cell>
      </group>

      <div style="padding:30px; max-width:90%;">
        <x-button text="退出登录" @click.native="loginOutClick" style="background-color:#ff3333; color:#FFFFFF; font-size:15px;"></x-button>
      </div>
    </div>
    <confirm v-model="confirm.isShow" :title="confirm.title" @on-confirm="onConfirm" confirm-text="确定" cancel-text="取消"></confirm>
  </div>
</template>
<script>
  import { XHeader, XButton, Group, Cell, Confirm } from 'vux'
  import {LOCATION_DATA} from '../../../config/sessionStorage'
  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      Confirm
    },
    data: function () {
      return {
        confirm: {
          isShow: false,
          title: ''
        }
      }
    },
    methods: {
      loginOutClick () {
        this.confirm = {isShow: true, title: '确定退出登录?'}
      },
      onConfirm: function () {
        let _this = this
        this.$auth.logout({
          success (res) {
            let qrCodeData = window.localStorage.getItem(LOCATION_DATA.QRCODE_DEPT)
            if (qrCodeData) {
              _this.$router.push({path: '/main/special-dept/' + JSON.parse(qrCodeData).deptId})
            } else {
              _this.$router.push({path: '/main/home'})
            }
          }
        })
//        window.localStorage.clear()
//        window.sessionStorage.clear()
      }
    }
  }
</script>

<style lang="scss">
  @import 'style/setting.scss';
</style>

