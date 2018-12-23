<template>
  <div class="remind">
    <div class="app-header">
      <x-header :left-options="{showBack: false}">提醒
         <a slot="left" class="vux-header-back" @click="goBack">返回</a>
      </x-header>
    </div>
    <div class="app-content">
      <loading :show="isLoading" text="加载中..."></loading>
      <panel-card class="content-card" :data-list="msgNotify.list" :type="15" @card-click="cardClick"></panel-card>
    </div>
    <confirm v-model="isShowLogin"
             @on-cancel="onCancel"
             @on-confirm="onConfirm">
      <p style="text-align:center;">您尚未登录, 请先登录再进行操作</p>
    </confirm>
    <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-show="!isLoading&&msgNotify.list.length==0"></load-more>
  </div>
</template>
<script>
  import { Swiper, XHeader, Loading, Confirm, LoadMore } from 'vux'
  import { mapGetters } from 'vuex'
  import PanelCard from '../../../components/panel-card'
  import {LOCATION_DATA} from '../../../config/sessionStorage'

  export default {
    components: {
      XHeader,
      Swiper,
      Loading,
      Confirm,
      LoadMore,
      PanelCard
    },
    computed: {
      ...mapGetters({
        msgNotify: 'msgNotify',
        isLoading: 'is_show_notify_loading'
      })
    },
    data: function () {
      return {
        isShowLogin: false
      }
    },
    watch: {},
    methods: {
      goBack () {
        if (this.$route.query.openId) {
          this.$router.push({name: 'Home'})
        } else {
          this.$router.go(-1)
        }
      },
      onCancel () {
        let qrCodeData = window.localStorage.getItem(LOCATION_DATA.QRCODE_DEPT)
        if (qrCodeData) {
          this.$router.push({path: '/main/special-dept/' + JSON.parse(qrCodeData).deptId})
        } else {
          this.$router.push({path: '/main/home'})
        }
      },
      onConfirm () {
        this.$router.push({name: 'Login'})
      },
      getMsgNotify () {
        this.$store.dispatch('getMsgNotify', {
          'page_number': 1,
          'page_size': 100,
          'read_flag': ''
        })
      },
      cardClick (id) {
        this.$router.push({name: 'RemindDetail', params: {id: id}})
      },
      /**
       *  使用openId登录
       */
      loginWithOpenId (id) {
        this.$auth.login({
          body: {
            open_id: id,
            accountType: 'user'
          },
          rememberMe: false,
          redirect: {name: ''},
          success () {
            this.getMsgNotify()
          },
          error (err) {
            console.log(err)
          }
        })
      },
      checkLogin () {
        if (this.$auth.check()) { // 已登录
          this.getMsgNotify()
        } else if (this.$route.query.openId) {  // 有openId, 说明是从微信公众号点击了公众号的消息提醒内容进来的, 使用openId进行登录, 再加载数据
          this.loginWithOpenId(this.$route.query.openId)
        } else { // 其他情况, 提示需要登录
          this.isShowLogin = true
          this.$store.dispatch('updateNotifyLoading', false)
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.checkLogin()
      })
    },
    destroyed () {
      this.$store.dispatch('updateNotifyLoading')
    }
  }
</script>

<style lang="scss">
  .remind {
    padding-bottom: 70px;

  .content-title {
    height: 30px;
    background-color: #FFFFFF;
    line-height: 30px;
    padding-left: 12px;
    font-size: 16px;
    color: red;
  }

  .content-card {
    margin: 8px 0;
  }

  }
</style>

