<template>
  <div class="insur-success">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回', preventGoBack: true}" @on-click-back="back">成功</x-header>
    </div>
    <div class="app-content">
      <div class="success">
        <x-icon type="ios-checkmark" size="70"></x-icon>
        <p style="margin-top: 20px">恭喜您，购买保单成功！</p>
        <!--<span class="detail-title">交易详情</span>-->
      </div>
      <!--<div class="detail">-->
        <!--<div class="info-flex">-->
          <!--<span>交易产品：</span>-->
          <!--<span>母婴安心险</span>-->
        <!--</div>-->
        <!--<div class="info-flex">-->
          <!--<span>交易方式：</span>-->
          <!--<span>支付宝</span>-->
        <!--</div>-->
        <!--<div class="info-flex">-->
          <!--<span>交易金额：</span>-->
          <!--<span style="color: red">618元</span>-->
        <!--</div>-->
        <!--<div class="info-flex">-->
          <!--<span>交易流水：</span>-->
          <!--<span>565642221544</span>-->
        <!--</div>-->
        <!--<div class="info-flex">-->
          <!--<span>交易时间：</span>-->
          <!--<span>2017-12-20</span>-->
        <!--</div>-->
      <!--</div>-->
      <div style="padding: 40px 20px;">
        <x-button text="完成" @click.native="back" type="primary" style="height: 40px;font-size: 16px;"></x-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {XHeader, Icon, XButton} from 'vux'
  export default {
    components: {
      XHeader, Icon, XButton
    },
    methods: {
      back () {
        this.$router.push({name: 'Home'})
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.$store.dispatch('updateInsurData')
        let pageParams = {
          browser_type: 'h5',
          page_name: 'h5患者端购买保险成功回调界面',
          req_url: this.$route.path,
          terminal_type: 'user'
        }
        this.$store.dispatch('pageStatis', pageParams)
      })
    }
  }
</script>
<style lang="scss">
  @import "style/insur-success.scss";
</style>
