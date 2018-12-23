<template>
  <div id="recharge">
    <div class="app-header">
      <x-header>快速充值</x-header>
    </div>
    <div class="content">
      <!--余额-->
      <div class="recharge-card">
        <div style="height: 33px"></div>
        <div class="balance-bd">
          <span class="balance-text">{{userData.available_balance}}</span><br>
          <span class="balance-title">账户余额</span><br>
          <span class="limit-text">当日交易限额 ¥ 10000</span>
        </div>

        <!--充值金额-->
        <div class="recharge-amount-bd" @click="inputOnFocus">
          <span style="line-height: 60px">充值金额</span><br>
          <div class="recharge-input-bd">
            <span class="recharge-icon">¥</span>
            <input type='number' v-model='amount' @keypress="amountChange" ref="amountInput" class="recharge-input" placeholder="请输入充值金额"/>
          </div>
        </div>


        <!--充值方式-->
        <group title="支付方式" v-show="isShowPayWays" style="margin: 20px">
          <div class="weui-cells cell-pay-bd" @click="payWay = 'weiXin'">
            <div class="cell-pay_hd">
              <img src="~assets/weixin_icon64_appwx_logo.png" alt="" class="pay-img">
              <p class="pay-title">微信支付</p>
            </div>
            <div class="pay-check-icon" v-show="payWay == 'weiXin'">
              <icon type="success-no-circle"></icon>
            </div>
          </div>
          <div class="weui-cells cell-pay-bd" @click="payWay = 'aliPay'">
            <div class="cell-pay_hd">
              <img src="~assets/alipay_icon64_logo.png" alt="" class="pay-img">
              <p class="pay-title">支付宝支付</p>
              <p></p>
            </div>
            <div class="pay-check-icon" v-show="payWay =='aliPay'">
              <icon type="success-no-circle"></icon>
            </div>
          </div>
        </group>

        <div style="padding: 40px 20px;">
          <x-button text="充 值" @click.native="pay" type="primary" :disabled="!isPayEnable" style="height: 40px;font-size: 16px;"></x-button>
        </div>
      </div>

      <iframe :src="aliPayUrl" style="display: none"></iframe>
    </div>
  </div>
</template>
<script>
  import { Group, XHeader, XButton, Alert, Icon, XInput } from 'vux'
  import { mapGetters } from 'vuex'
  import BridgeUtil from '../../../utils/bridgeUtil/index'

  export default {
    components: {Group, XHeader, XButton, Alert, Icon, XInput},
    computed: {
      ...mapGetters({
        userData: 'userData',
        recharge: 'accountRecharge',
        aliPay: 'aliPayRes'
      })
    },
    data: function () {
      return {
        amount: '',
        payWay: 'weiXin',
        isPayEnable: true,
        aliPayUrl: '',
        isShowPayWays: false
      }
    },
    watch: {
      amount (val) {
        if (parseFloat(val) >= 0.01) {
          this.isPayEnable = true
        } else {
          this.isPayEnable = false
        }
      },
      /**
       * 充值后的回调, 返回订单ID
       *
       * 支付宝支付: 如果在非微信浏览器进行支付宝, 用户安装了支付宝APP, 则使用唤醒支付宝进行支付; 没有安装支付宝则使用网页支付
       *            如果在微信浏览器打开, 需把链接复制粘贴到其他浏览器打开, 进行支付
       * 微信支付:   如果在微信公众号中打开, 则使用微信公众号支付
       *            如果在其他浏览器打开, 则使用扫码支付
       */
      recharge (orderId) {
        if (orderId) {
          // 如果是微信支付, 跳转到支付界面, 上传订单ID, 获取订单参数, 执行微信支付JS代码
          if (this.payWay === 'weiXin') {
            this.$router.push({
              name: 'Pay',
              query: {
                orderId: orderId,
                payType: 'weChatPay'
              }
            })
          } else if (this.payWay === 'aliPay') {
            // 支付宝支付
            this.$store.dispatch('aliPay', {
              orderId: orderId,
              token: JSON.parse(window.localStorage.getItem('default-auth-token-user'))[1]
            })
          }
        }
      },
      /**
       * 支付宝支付的回调
       */
      aliPay (res) {
        if (res && res.url) {
          // 判断当前是不是在微信浏览器中, 不是则直接打开
          if (typeof WeixinJSBridge === 'undefined') {
            // 支付宝支付
            if (BridgeUtil.isiOSApp) {
              BridgeUtil.iOS.push(res.url)
            } else {
              window.location.href = res.url
            }
            // 如果在微信中, 则提示用户在其他浏览器中打开此页面
            // (注: 暂时没有做在微信中使用支付宝支付的功能, 目前在微信中默认使用微信支付, 不使用支付宝支付)
          } else {
            this.aliPayUrl = res.url
          }
        }
      }
    },
    methods: {
      inputOnFocus () {
        this.$refs.amountInput.focus()
      },
      /**
       * 限定充值金额小数位数不能多于两位
       */
      amountChange (event) {
        if (!(/\d+[.]\d{2}/g).test(this.amount) && ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 46)) {
          event.returnValue = true
        } else {
          event.returnValue = false
        }
      },
      /**
       * 支付
       */
      pay () {
        if (this.amount === '') {
          this.$vux.alert.show({title: '提示', content: '请输入金额'})
        } else if (this.amount !== '0' && this.amount !== 0 && isNaN(this.amount)) {
          this.$vux.alert.show({title: '提示', content: '金额必须为数字'})
        } else if (this.amount < 0.01) {
          this.$vux.alert.show({title: '提示', content: '充值金额过小, 请重新填写'})
        } else if (this.amount > 10000) {
          this.$vux.alert.show({title: '提示', content: '金额不能超过10000元'})
        } else {
          this.isShowAliPayMasking = true
          this.$store.dispatch('accountRecharge', {
            form: {
              balance: parseFloat(this.amount).toFixed(2)
            },
            _this: this
          })
        }
      }
    },
    beforeMount () {
      this.$nextTick(function () {
        this.$store.dispatch('getUser')
        // 如果是在微信浏览器中, 则默认微信支付, 不显示其他支付方式
        if (typeof WeixinJSBridge === 'undefined') {
          this.isShowPayWays = true
        } else {
          this.isShowPayWays = false
        }
      })
    },
    mounted () {
      this.$nextTick(function () {
        this.$refs.amountInput.focus()
      })
    }
  }
</script>

<style lang="scss">
  @import 'style/recharge.scss';
</style>

