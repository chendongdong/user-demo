<template>
  <div id="recharge">
    <div class="app-header">
      <x-header>支付预约金<a slot="right" @click="$router.push({name: 'Recharge'})">充值余额</a></x-header>
    </div>
    <div class="content" style="margin-top: 45px;">
      <div style="height: 50px;padding: 10px;">
        <span>为避免床位资源浪费，当前科室需要支付押金
          <span style="font-size: 24px; color: orange">{{bookingDetail.pay_deposits}}</span> 元
        </span>
        <br>
        <p>入住成功后，押金将退回。</p>
      </div>

      <group title="预约人信息" style="margin-top: 20px">
        <p class="item">{{bookingDetail.name}} {{bookingDetail.gender}} {{bookingDetail.age}}</p>
        <p class="item">手机号码：{{bookingDetail.tel}}</p>
      </group>
      <group title="预约医院信息">
        <p class="item">医院：{{bookingDetail.hos_name}}</p>
        <p class="item">科室：{{bookingDetail.dept_name}}</p>
      </group>
      <p class="item">申请时间：{{bookingDetail.apply_date}}</p>


      <!--充值方式-->
      <group title="请选择支付方式" style="margin-top: 20px;margin-bottom: 30px;">
        <div class="weui-cells cell-pay-bd" @click="balanceClicked">
          <div class="cell-pay_hd">
            <img src="../../../assets/money-bag.png" alt="" class="pay-img" style="width: 35px; height: 35px;">
            <div class="pay-title-bd">
              <p class="pay-title" v-if="userData.available_balance >= bookingDetail.pay_deposits" style="color: #000">余额支付</p>
              <p class="pay-title" v-else style="color: #A9A9A9">余额支付</p>
              <p class="pay-sub-title">{{balanceSubTitle}}</p>
            </div>
          </div>
          <div class="pay-check-icon" v-show="payWay =='balance'">
            <icon type="success-no-circle"></icon>
          </div>
        </div>
        <div class="weui-cells cell-pay-bd" @click="payWay = 'weiXin'">
          <div class="cell-pay_hd">
            <img src="../../../assets/weixin_icon64_appwx_logo.png" alt="" class="pay-img">
            <p class="pay-title">微信支付</p>
          </div>
          <div class="pay-check-icon" v-show="payWay == 'weiXin'">
            <icon type="success-no-circle"></icon>
          </div>
        </div>
        <div class="weui-cells cell-pay-bd" @click="payWay = 'aliPay'" v-show="isShowAliPay">
          <div class="cell-pay_hd">
            <img src="../../../assets/alipay_icon64_logo.png" alt="" class="pay-img">
            <p class="pay-title">支付宝支付</p>
            <p></p>
          </div>
          <div class="pay-check-icon" v-show="payWay =='aliPay'">
            <icon type="success-no-circle"></icon>
          </div>
        </div>
      </group>

      <!--支付密码输入框-->
      <popup v-model="isShowCheckPassword" height="40%" class="pwd-popup" @on-hide="payPwd = ''">
        <div class="pwd-title-bd">
          <span class="pwd-title">请输入支付密码</span>
        </div>
        <div class="pwd-input-bd">
          <input type="password" class="input-pay-pwd" v-model="payPwd">
        </div>
        <x-button :text="isPaying?'提交中...':'确定'" @click.native="balancePay" type="primary" :disabled="isPaying" class="pwd-btn"></x-button>
      </popup>

      <div style="padding: 30px;">
        <x-button text="确认支付" @click.native="checkToPay" type="primary" :disabled="!isPayEnable" style="height: 40px;font-size: 16px;"></x-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { Group, Cell, XInput, XHeader, XButton, Toast, Icon, Popup } from 'vux'
  import { mapGetters } from 'vuex'
  import BridgeUtil from '../../../utils/bridgeUtil/index'

  export default {
    components: {Group, Cell, XInput, XHeader, XButton, Toast, Icon, Popup},
    computed: {
      ...mapGetters({
        userData: 'userData',
        bookingDetail: 'bookingDetail',
        accountPay: 'accountPay',
        aliPayRes: 'aliPayRes'
      })
    },

    data: function () {
      return {
        payPwd: '',
        orderId: '',
        amount: 0.01,
        payWay: 'weiXin',
        balanceSubTitle: '',
        isPayEnable: true,
        isBalanceEnable: false,
        isPaying: false,
        isShowCheckPassword: false,
        isShowAliPay: false
      }
    },
    watch: {
      userData (userData) {
        let balance = userData.available_balance
        if (balance === 0) {
          this.isBalanceEnable = false
          this.balanceSubTitle = `当前余额不足，余额为${balance}元`
        } else {
          this.isBalanceEnable = true
          this.balanceSubTitle = `当前余额: ${balance}元`
        }
      },
      // 支付宝支付
      aliPayRes (res) {
        if (res && res.url) {
          if (BridgeUtil.isiOSApp) {
            BridgeUtil.iOS.push(res.url)
          } else {
            window.location.href = res.url
          }
        }
      },
      // 余额支付
      accountPay (res) {
        this.isShowCheckPassword = false
        if (res) {
          const _this = this
          this.$vux.alert.show({
            title: '提示',
            content: res || '支付成功',
            onHide () {
              // 跳转到订单详情界面
              _this.$router.push({name: 'BookingDetail', params: {id: _this.$route.query.id}})
            }
          })
        }
      }
    },
    methods: {
      /**
       * 检查余额是否够支付
       */
      balanceClicked () {
        if (this.isBalanceEnable) {
          this.payWay = 'balance'
        } else {
          this.$vux.toast.show({
            width: '20em',
            type: 'text',
            position: 'middle',
            text: '当前余额不足, 请充值'
          })
        }
      },
      /**
       * 支付宝支付: 如果在非微信浏览器进行支付宝, 用户安装了支付宝APP, 则使用唤醒支付宝进行支付; 没有安装支付宝则使用网页支付
       * 微信支付:   如果在微信公众号中打开, 则使用微信公众号支付
       *            如果在其他浏览器打开, 则使用扫码支付
       */
      checkToPay () {
        // 如果是微信支付, 跳转到支付界面, 上传订单ID, 获取订单参数, 执行微信支付JS代码
        if (this.payWay === 'weiXin') {
          this.$router.push({
            name: 'Pay',
            query: {
              id: this.$route.query.id,
              orderId: this.orderId,
              payType: 'weChatPay',
              sourceRoute: this.$route.query.sourceRoute
            }
          })

          // 支付宝支付, 跳转到支付宝支付页面
        } else if (this.payWay === 'aliPay') {
          this.$store.dispatch('aliPay', {
            orderId: this.orderId,
            token: JSON.parse(window.localStorage.getItem('default-auth-token-user'))[1]
          })

          // 余额支付
        } else if (this.payWay === 'balance') {
          this.isShowCheckPassword = true
        }
      },
      /**
       * 支付
       */
      balancePay () {
        if (!this.payPwd || this.payPwd.length < 6) {
          this.isShowCheckPassword = false
          this.$vux.alert.show({
            title: '提示',
            content: '请输入正确的支付密码'
          })
          return
        }
        this.isPaying = true
        this.$store.dispatch('accountPay', {
          form: {
            balance: this.amount,
            order_id: this.orderId,
            pay_password: this.payPwd
          },
          _this: this
        })
      }
    },
    beforeMount () {
      this.$nextTick(function () {
        let query = this.$route.query
        this.$store.dispatch('getUser')
        this.$store.dispatch('getBookingDetail', query.id)
        if (query.orderId) {
          this.orderId = query.orderId
        }
        this.$store.dispatch('clearTradeData')
        // 如果是在微信浏览器中, 则默认微信支付, 不显示其他支付方式
        if (typeof WeixinJSBridge === 'undefined') {
          this.isShowAliPay = true
        } else {
          this.isShowAliPay = false
        }
      })
    }
  }
</script>

<style lang="scss">
  @import 'style/recharge.scss';
</style>

