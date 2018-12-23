<template>
  <div class="home">
    <search-form :location="location"  :left-options="{showBack: false}" @do-search="changeShow" style="position: fixed; top: 0px;"></search-form>
    <!--<a class="left-text" @click="switchCity" v-if="location">-->
      <!--{{location.name}}-->
      <!--<i class="fa fa-angle-down" style="font-size: 20px;padding-top: 10px"></i>-->
    <!--</a>-->
    <div style="z-index: 999;position: fixed;top: 10px;right: 10px;" @click="openScan">
      <img src="~assets/ic_scan.png" style="width: 24px;padding-left: 6px;">
    </div>
    <div class="pad-content" style="padding-left: 0px; padding-right: 0px;">
      <swiper :list="bannerList"
              auto
              style="width: 100%; margin:0 auto; background-color: #F7F7F7"
              :aspect-ratio="360/900"
              dots-class="custom-bottom"
              dots-position="center">
      </swiper>
      <home-remind></home-remind>
      <fun-menu></fun-menu>
      <recom-insur></recom-insur>
      <recom-doc></recom-doc>
      <home-info :id="19"></home-info>
      <home-info :id="18"></home-info>
    </div>
    <div v-transfer-dom>
      <alert v-model="isShowHint" title="提示">{{hintText}}</alert>
    </div>
  </div>
</template>
<script>
  import SearchForm from 'components/search/SearchForm.vue'
  import RecomInsur from 'components/home-menu/RecomInsur'
  import HomeInfo from 'components/home-menu/HomeInfo'
  import RecomDoc from 'components/home-menu/RecomDoc'
  import HomeRemind from 'components/home-menu/HomeRemind'
  import FunMenu from 'components/home-menu/FunMenu'
  import {XButton, Swiper, SwiperItem, GroupTitle, Grid, GridItem, Badge, Alert, TransferDomDirective as TransferDom, Group, Cell} from 'vux'
  import { mapGetters } from 'vuex'
  import wx from 'weixin-js-sdk'
  import {SESSION_DATA} from '../../config/sessionStorage'
  export default {
    directives: {
      TransferDom
    },
    components: {
      SearchForm,
      XButton,
      Swiper,
      SwiperItem,
      GroupTitle,
      Grid,
      GridItem,
      Badge,
      Alert,
      Group,
      Cell,
      RecomInsur,
      HomeInfo,
      RecomDoc,
      HomeRemind,
      FunMenu
    },
    computed: {
      ...mapGetters([
        'homeBanner',
        'wxConfigParam',
        'cityInfo'
      ])
    },
    watch: {
      homeBanner (val) {
        this.bannerList = []
        for (let i = 0; i < val.length; i++) {
          let url = ':javascript'
          if (i === 0) {
            url = '/booking'
          }
          let temp = {
            url: url,
            img: this.$store.state.imgServer + val[i].img_addr,
            title: ''
          }
          this.bannerList.push(temp)
        }
      },
      wxConfigParam (data) {
        if (data && data.flag === 1) {
          // 微信分享配置
          this.wxConfig(data)
          // 处理成功
          this.wxReady()
          // 处理失败
          this.wxError()
        }
      },
      cityInfo (val) {
        if (val) {
          if (val.area_id && val.area_name) {
            this.location = {
              value: val.area_id,
              name: val.area_name
            }
            window.sessionStorage.setItem(SESSION_DATA.LOCATION_CITY, JSON.stringify(this.location))
            window.sessionStorage.setItem(SESSION_DATA.SET_CITY, JSON.stringify(this.location))
          }
        }
      }
    },
    data () {
      return {
        hintText: '此功能暂未开通，敬请期待！',
        isShowHint: false,
        location: {value: 0, name: '全国'},
        bannerList: []
      }
    },
    methods: {
      openScan () {
        if (window.sessionStorage.getItem(SESSION_DATA.WE_CHAT_CODE)) {
          let that = this
          wx.scanQRCode({
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
//          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
//              let result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
//              window.alert('result=' + res)
            },
            error: function (res) {
              window.alert(res)
              that.isShowHint = true
              that.hintText = '请退出微信公众号，重新进入'
            },
            fail: function (res) {
              that.$vux.alert.show({
                title: '提示--fail',
                content: res
              })
//              window.location.reload()
            }
          })
        } else {
          this.isShowHint = true
          this.hintText = '该平台暂不支持此功能，请关注微信公众号：医秘99'
        }
      },
      switchCity () {
        this.$router.push({name: 'SelectLocation'})
      },
      changeShow () {
      },
      /**
       * 通过config接口注入权限验证配置
       * 请参考: 微信JS_SDK说明文档: https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
       * @param data
       */
      wxConfig (data) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: [
            'translateVoice',
            'scanQRCode',
            'getLocation'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
      },
      /**
       * 通过ready接口处理成功验证
       */
      wxReady () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
        // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
        // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        let _this = this
        wx.ready(() => {
          // 调用微信公众号支付接口
          if (!window.sessionStorage.getItem(SESSION_DATA.SET_CITY)) {
            _this.wxGetLocation()
          }
        })
      },
      /**
       * 通过error接口处理失败验证
       */
      wxError () {
        wx.error(error => {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          if (error) {
//            this.$vux.alert.show({
//              title: '提示--error',
//              content: error
//            })
            let reloadTimes = JSON.parse(window.sessionStorage.getItem('TRANS_RELOAD_TIMES'))
//             确保页面最多只刷新一次
            if (isNaN(parseInt(reloadTimes))) {
              this.$store.dispatch('clearBaseData')
              window.sessionStorage.setItem('TRANS_RELOAD_TIMES', JSON.stringify(1))
              window.location.reload()
            } else {
              this.$store.dispatch('getIPCity')
            }
          }
        })
      },
      wxGetLocation () {
        let that = this
        wx.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            that.$store.dispatch('getLocationCity', {latitude: res.latitude, longitude: res.longitude})
//            window.alert('latitude=' + res.latitude + '  longitude=' + res.longitude)
            // 腾讯地图 key: POPBZ-HDVWX-WND4O-ZZJNO-MXWHQ-KPBBX
//            let geocoder = new qq.maps.Geocoder({
//              complete: function (result) {
//                console.log('address====', result.detail)
//                this.currentCity = result.detail.addressComponents.city
//                console.log('city====', this.currentCity)
//                window.alert('当前城市：' + this.currentCity)
//              }
//            })
//            var coord = new qq.maps.LatLng(res.latitude, res.longitude)
//            geocoder.getAddress(coord)
          },
          error: function (res) {
//            window.alert('error=' + res)
            console.log('error=', res)
            this.$store.dispatch('getIPCity')
          },
          cancel: function (res) {
//            window.alert('cancel=' + res)
            this.$store.dispatch('getIPCity')
          }
        })
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        console.log('count=', window.history.length)
        this.$store.dispatch('clearBaseData')
        let cityInfo = window.sessionStorage.getItem(SESSION_DATA.SET_CITY) || ''
        // 每次从微信公众号打开医秘约床的时候, 微信都会在地址栏上拼接一个code, 作为用户的识别码
        // 微信支付的时候, 需要将此code传回给微信, 作为身份判断
        if (this.$route.query.code) {
          window.sessionStorage.setItem(SESSION_DATA.WE_CHAT_CODE, JSON.stringify(this.$route.query.code))
        } else {
          // 从网站或者手机app进入的，使用ip定位
          if (cityInfo) {
            this.location = JSON.parse(cityInfo)
          } else {
            this.$store.dispatch('getIPCity')
          }
        }
        if (window.sessionStorage.getItem(SESSION_DATA.WE_CHAT_CODE)) {
          // 从微信公众号进入的，使用微信sdk定位
          this.$store.dispatch('getWxConfig', window.location.href)
        }
        this.$store.dispatch('clearNotify')
        window.sessionStorage.setItem(SESSION_DATA.SEARCH_VALUE, '')
        // tabbar选中的下标
        this.$store.dispatch('setTabIdx', 0)
        this.$store.dispatch('getHomeBanner')
        let pageParams = {
          browser_type: 'h5',
          page_name: 'h5患者端首页',
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
