<template>
  <div class="insurance-detail">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">保单详情</x-header>
    </div>
    <div class="app-content" v-if="insurInfo">
      <div class="insur-info">
        <p class="type">{{insurInfo.category_name}}</p>
        <p class="title">保单号：
          <span class="name">{{insurInfo.out_order_no}}</span>
          <span class="state">{{insurInfo.state_val}}</span>
        </p>
        <!--<img src="~assets/ic_insur_logo.png" style="float: right;width: 80px">-->
        <p class="title">生效日期：<span class="name">{{insurInfo.start_valid_time}}</span></p>
        <p class="title">投保金额：<span class="money">{{insurInfo.isrc_amount}}元</span></p>
        <!--<div class="fun-btn">-->
          <!--<x-button mini plain type="primary" class="btn" @click.native="">立即支付</x-button>-->
          <!--<x-button mini plain type="default" class="btn" @click.native="jump2InsuDetail(0)">取消订单</x-button>-->
        <!--</div>-->
      </div>
      <div class="person-info">
        <p>赔保信息：</p>
        <div class="amount">
          <p class="amount-flex" v-for="info in insurInfo.guarantee_info.infos">
            <span>{{info.projectName}}：</span>
            <span>{{info.insuredText}}</span>
          </p>
        </div>
      </div>
      <div class="person-info">
        <p>被保险人信息：</p>
        <p class="name-info">
          <span class="name-title">姓名：</span>
          <span>{{insurInfo.isrced_name}}</span>
        </p>
        <p class="name-info">
          <span class="name-title">证件类型：</span>
          <span v-if="insurInfo.isrced_certificate_type==1">身份证</span>
          <span v-if="insurInfo.isrced_certificate_type==2">护照</span>
        </p>
        <p class="name-info">
          <span class="name-title">证件号：</span>
          <span>{{insurInfo.isrced_certificate_code}}</span>
        </p>
      </div>
      <div class="person-info">
        <p>投保人信息：</p>
        <p class="name-info">
          <span class="name-title">姓名：</span>
          <span>{{insurInfo.isrc_create_name}}</span>
        </p>
        <p class="name-info">
          <span class="name-title">证件类型：</span>
          <span v-if="insurInfo.isrced_certificate_type==1">身份证</span>
          <span v-if="insurInfo.isrced_certificate_type==2">护照</span>
        </p>
        <p class="name-info">
          <span class="name-title">证件号：</span>
          <span>{{insurInfo.isrc_create_certificate_code}}</span>
        </p>
        <p class="name-info">
          <span class="name-title">手机号：</span>
          <span>{{insurInfo.isrc_create_mobile}}</span>
        </p>
      </div>
      <div class="consult-info">
        <p>咨询服务方式：</p>
        <p class="consult-item">
          <span class="lable">1</span>
          点击右侧“咨询”浮标直接咨询
        </p>
        <p class="consult-item">
          <span class="lable">2</span>
          拨打客服热线0755-8226-5966（每天：9:00-18:00）
        </p>
        <p class="consult-item">
          <span class="lable">3</span>
          打开医秘微信公众号直接留言
        </p>
      </div>
      <div class="service" @click="jump2Service">
        <img src="~assets/image/service_tran.png" class="service-img">
        <p class="service-text">医秘小助</p>
      </div>
    </div>
    <div style="display: none">{{insurOrders}}</div>
  </div>
</template>
<script>
  import {XHeader, XButton} from 'vux'
  export default {
    components: {
      XHeader, XButton
    },
    computed: {
      insurOrders () {
        return this.$store.getters.insurOrders
      }
    },
    watch: {
      insurOrders (val) {
        if (val && val.list.length > 0) {
          this.insurInfo = val.list[0]
        }
      }
    },
    data () {
      return {
        id: 0,
        insurInfo: null
      }
    },
    methods: {
      jump2Service () {
        this.$router.push({name: 'YimiService'})
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.id = this.$route.params.id
        let data = {
          id: this.id,
          page_number: 1,
          page_size: 1
        }
        this.$store.dispatch('getInsurOrders', data)
        let pageParams = {
          browser_type: 'h5',
          page_name: 'h5患者端保单详情',
          req_url: this.$route.path,
          terminal_type: 'user'
        }
        this.$store.dispatch('pageStatis', pageParams)
      })
    }
  }
</script>
<style lang="scss">
  @import "style/insurance_detail.scss";
</style>
