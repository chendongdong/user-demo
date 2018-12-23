<template>
  <div class="pay">
    <div class="app-header">
      <x-header :left-options="{showBack: false}">{{title}}
        <a slot="left" class="vux-header-back" @click="goBack">返回</a>
      </x-header>
    </div>

    <div class="pay-content">
      <div v-show="isLoaded">
        <icon type="success" is-msg style="margin-top: 50px;" v-if="isPaySuccess"></icon>
        <icon type="warn" is-msg style="margin-top: 50px;" v-else></icon>
        <br>
        <span style="font-size: 18px;margin-top: 20px;">{{isPaySuccess ? '支付成功' : '支付失败'}}!</span>
      </div>

      <div v-show="isShowQrCode" style="text-align: center">
        <div style="margin-top: 50px;">
          <img :src="$store.state.imgServer + qrCode" alt="">
        </div>
        <br>
        <p>使用微信扫描二维码完成支付</p>
      </div>
      <loading v-model="isShowLoading" text="支付中..."></loading>
    </div>
  </div>
</template>
<script>
  import { XHeader, Icon, Loading } from 'vux'
  import { mapGetters } from 'vuex'
  import wx from 'weixin-js-sdk'
  import {SESSION_DATA} from '../../../config/sessionStorage'
  export default {
    components: {XHeader, Icon, Loading},
    computed: {
      ...mapGetters({
        weChatPayWepParams: 'weChatPayWepParams',
        weChatQrCodePayRes: 'weChatQrCodePayRes',
        weChatPayResultRes: 'weChatPayResultRes'
      })
    },
    data: function () {
      return {
        isLoaded: false,
        isPaySuccess: false,
        isShowLoading: true,
        isShowQrCode: false,
        orderId: '',
        title: '支付中',
        intervalTimer: {},
        timeOut: {},
        qrCode: ''
      }
    },
    watch: {
      // 微信支付参数
      weChatPayWepParams (params) {
        this.isShowLoading = false
        /**
         * pay_flag 等于1, 可以支付
         * pay_flag 等于0, 不可以支付, 且data里有msg
         */
        if (params && params.pay_flag === 1) {
//          this.onBridgeReady(params)
          // 微信分享配置
          this.wxConfig(params)
          // 处理成功
          this.wxReady(params)
          // 处理失败
          this.wxError()
        } else {
          // 服务器返回微信支付参数失败
          this.$vux.alert.show({
            title: '提示',
            content: params.msg
          })
        }
      },
      // 微信扫码支付
      weChatQrCodePayRes (res) {
        /**
         * pay_flag 等于1, 可以支付
         * pay_flag 等于0, 不可以支付, 且data里有msg
         */
        if (res && res.pay_flag === 1) {
          this.isShowLoading = false
          this.isShowQrCode = true
          this.qrCode = res.qr_code
          this.getWeChatPayResult()
        } else {
          // 服务器返回微信支付参数失败
          this.$vux.alert.show({
            title: '提示',
            content: res.msg || '支付失败, 请稍后再试',
            onHide () {
              this.$router.push({name: 'User'})
            }
          })
        }
      },
      // 查询微信支付扫描结果的回调
      weChatPayResultRes (res) {
        if (res && res.pay_flag) {
          /**
           * 完成支付, 清除间隔定时器和超时定时器, 并显示完成支付
           * order_state: 1: 已付款, 3: 代付款
           */
          if (res.order_state === 1) {
            this.isShowQrCode = false
            this.isLoaded = true
            this.isPaySuccess = true
            clearInterval(this.intervalTimer)
            clearTimeout(this.timeOut)
            this.intervalTimer = {}
            this.timeOut = {}
          }
        }
      }
    },
    methods: {
      wxPay (data) {
        let _this = this
        wx.chooseWXPay({
          timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
          package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySign, // 支付签名
          success: function (res) {
            // 支付成功后的回调函数
            _this.title = '支付结果'
            _this.isLoaded = true
            _this.isPaySuccess = true
          },
          error: function (res) {
            _this.title = '支付结果'
            _this.isLoaded = true
            _this.isPaySuccess = false
          },
          cancel: function (res) {
            _this.title = '支付结果'
            _this.isLoaded = true
            _this.isPaySuccess = false
          },
          fail: function (res) {
            _this.title = '支付结果'
            _this.isLoaded = true
            _this.isPaySuccess = false
          }
        })
      },
      /**
       * 通过config接口注入权限验证配置
       *
       * 请参考: 微信JS_SDK说明文档: https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
       * @param data
       */
      wxConfig (data) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: [
            'chooseWXPay'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
      },
      /**
       * 通过ready接口处理成功验证
       */
      wxReady (data) {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
        // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
        // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        let _this = this
        wx.ready(() => {
          // 调用微信公众号支付接口
          _this.wxPay(data)
        })
      },
      /**
       * 通过error接口处理失败验证
       */
      wxError () {
        wx.error(error => {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          if (error) {
            this.$vux.alert.show({
              title: '提示',
              content: error
            })
            let reloadTimes = JSON.parse(window.sessionStorage.getItem('TRANS_RELOAD_TIMES'))
            // 确保页面最多只刷新一次
            if (isNaN(parseInt(reloadTimes))) {
              window.sessionStorage.setItem('TRANS_RELOAD_TIMES', JSON.stringify(1))
              window.location.reload()
            }
          }
        })
      },
      /**
       * 在微信浏览器里面打开H5网页中执行JS调起支付。接口输入输出数据格式为JSON。
       * 注意：WeixinJSBridge内置对象在其他浏览器中无效。
       * 参数名区分大小，大小写错误签名验证会失败。
       *
       * 注：JS API的返回结果get_brand_wcpay_request:ok仅在用户成功完成支付时返回。
       * 由于前端交互复杂，get_brand_wcpay_request:cancel
       * 或者get_brand_wcpay_request:fail
       * 可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
       *
       * 微信支付官方开发文档: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7
       *
       */
//      onBridgeReady (params) {
//        let _this = this
//        WeixinJSBridge.invoke(
//          'getBrandWCPayRequest', {
//            'appId': params.appId,          // 公众号名称，由商户传入
//            'timeStamp': params.timeStamp,  // 时间戳，自1970年以来的秒数
//            'nonceStr': params.nonceStr,    // 随机串
//            'package': params.package,
//            'signType': params.signType,    // 微信签名方式：
//            'paySign': params.paySign       // 微信签名
//          },
//          function (res) {
//            _this.title = '支付结果'
//            _this.isLoaded = true
//            if (res.err_msg === 'get_brand_wcpay_request:ok') {
//              _this.isPaySuccess = true
//            } else if (res.err_msg === 'get_brand_wcpay_request:fail' || res.msg === 'get_brand_wcpay_request:cancel') {
//              _this.isPaySuccess = false
//            }   // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
//          }
//        )
//      },
      /**
       * 定时查询微信支付扫描结果
       */
      getWeChatPayResult () {
        const _this = this
        this.intervalTimer = setInterval(function () {
          _this.$store.dispatch('getWeChatPayResult', {orderId: _this.orderId})
        }, 5000)

        this.timeOut = setTimeout(function () {
          if (_this.intervalTimer) {
            clearInterval(_this.intervalTimer)
            // 超时, 支付失败
            _this.$vux.alert.show({
              title: '提示',
              content: '支付失败, 请重新支付!',
              onHide () {
                // 返回到上一个页面(订单确认页面或者余额充值页面)
                _this.$router.go(-1)
              }
            })
          }
        }, 1000 * 60 * 5)
      },
      /**
       * 导航栏返回
       */
      goBack () {
        // 如果不在微信浏览器中, 按下面程序返回
        if (typeof WeixinJSBridge === 'undefined') {
          // 支付成功
          if (this.isPaySuccess) {
            // 约床后直接支付的订单, 支付成功后返回到约床订单详情
            if (this.$route.query.sourceRoute && this.$route.query.sourceRoute === 'Booking') {
              this.$router.push({name: 'BookingDetail', params: {id: this.$route.query.id}})
            } else { // 其他的比如充值或者在约床订单详情进行支付的, 退回两步, 即: 充值的返回到钱包, 约床详情支付的返回到约床详情
              this.$router.go(-2)
            }
          } else { // 没有支付成功, 返回上一步, 可以继续支付
            this.$router.go(-1)
          }
        } else { // 在微信浏览器中, 不管成功或者失败, 关闭微信浏览器
//          WeixinJSBridge.call('closeWindow')
        }
      }
    },
    beforeMount () {
      this.$nextTick(function () {
        const query = this.$route.query
        const code = JSON.parse(window.sessionStorage.getItem(SESSION_DATA.WE_CHAT_CODE))

        // 微信支付的处理
        if (query.orderId) {
          // 微信支付
          if (query.payType === 'weChatPay') {
            this.orderId = query.orderId
            // 当前浏览器不是微信浏览器, 使用扫码支付
            if (typeof WeixinJSBridge === 'undefined') {
              this.$store.dispatch('weChatQrCodePay', {orderId: this.orderId})
            } else {  // 当前浏览器是微信
              if (code) { // 在公众号中支付，调用微信公众号支付
                // 查询微信支付的支付参数, 获取到结果后, 执行微信支付的JS代码
                this.$store.dispatch('getWeChatPayWepParams', {
                  orderId: this.orderId,
                  code: code
                })
              } else {  // 没有Code, 说明不是在微信公众号打开的, 需进行扫码支付
                this.$store.dispatch('weChatQrCodePay', {orderId: this.orderId})
              }
            }
          }
        }

        // 支付宝支付的处理
        if (query.type && query.type === 'success') {
          this.isPaySuccess = true
        } else {
          this.isPaySuccess = false
        }
      })
    },
    /**
     * 页面销毁时, 清除定时器
     */
    destroyed () {
      clearInterval(this.intervalTimer)
      clearTimeout(this.timeOut)
      this.intervalTimer = {}
      this.timeOut = {}
    }
  }
</script>

<style lang='scss'>
  /*@import 'style/';*/
  .pay-content {
    margin-top: 45px;
    height: 400px;
    display: flex;
    display: -webkit-flex; /* OLD - iOS 6-, Safari 3.1-6  NEW - Chrome*/
    display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-align-items: center;
    align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
  }
</style>

