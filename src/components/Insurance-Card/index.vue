<template>
  <div class="insurance-card">
    <div class="insurance-main" v-for="item in dataList" :key="item.id" v-if="type==1">
      <div class="card-header">
        <span class="name">{{item.name}}</span>
        <x-button mini type="primary" @click.native="buyInsurance(item)" class="buy">我要投保</x-button>
      </div>
      <div class="card-content">
        <div class="img">
          <img :src="$store.state.imgServer + item.image">
        </div>
        <div class="info">
          <h3 class="info-title">{{item.title}}</h3>
          <p>使用人群: <span class="info-applicable">{{item.suit_crowd}}</span></p>
          <p>承保年龄: <span class="info-age">{{item.suit_age}}</span></p>
          <p v-if="item.insurance_expires">保障期限: <span class="info-age">{{item.insurance_expires}}</span></p>
          <!--<span class="more-doc" style="color: #999">查看</span>-->
          <p>出单历史: <span class="info-his">{{item.history_cnt}}</span></p>
        </div>
      </div>
    </div>
    <div v-if="type==2" v-for="item in dataList" class="my-insurance" @click="jump2InsuDetail(item.id)">
      <p class="type">{{item.category_name}}<span class="state">{{item.state_val}}</span></p>
      <p class="title">被保人：<span class="name">{{item.isrced_name}}</span></p>
      <!--<img src="~assets/ic_insur_logo.png" style="float: right;width: 80px">-->
      <!--<p class="title">保障金额：<span class="name">{{item.isrc_amount}}</span></p>-->
      <p class="title">投保金额：<span class="money">{{item.isrc_amount}}元</span></p>
      <!--<div class="fun-btn">-->
        <!--<x-button mini type="primary" class="btn" @click.native="" v-if="item.state==99">继续购买</x-button>-->
        <!--<x-button mini type="primary" class="btn" @click.native="" v-if="item.state==0">立即支付</x-button>-->
        <!--<x-button mini type="default" class="btn" @click.native="jump2InsuDetail(item.id)">查看保单</x-button>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script>
  import {XButton} from 'vux'
  import BridgeUtil from '../../utils/bridgeUtil/index'

  export default {
    components: {
      XButton
    },
    data: function () {
      return {}
    },
    props: {
      dataList: {
        type: Array,
        default () {
          return []
        }
      },
      type: {
        type: Number,
        default: 1
      }
    },
    watch: {},
    methods: {
      jump2Intro (item) {
        if (item.has_detail) {
          this.$router.push({path: '/insurance/introduce/' + item.id})
        } else {
          this.$vux.alert.show({
            title: '提示',
            content: '该保险暂未开通详情'
          })
        }
      },
      jump2InsuDetail (id) {
        this.$router.push({name: 'InsuranceDetail', params: {id: id}})
      },
      buyInsurance (item) {
        if (item.has_detail) {
          this.$router.push({path: '/insurance/introduce/' + item.id})
        } else {
          if (!this.$auth.check()) {
            let _this = this
            this.$vux.alert.show({
              title: '提示',
              content: '您尚未登录, 请先登录再进行操作',
              onHide () {
                _this.$router.push({name: 'Login'})
              }
            })
            return
          }
          let url = ''
          if (item.code === 'myaxzhbx') { // id=2: 母婴安心险 新建保
            url = item.url + this.$auth.user().account
          } else { // 手术意外险，人保
            url = item.url
          }
          // iOS APP打开, 使用ios本地控制器打开网页
          if (BridgeUtil.isiOSApp) {
            BridgeUtil.iOS.push(url)
          } else {
            window.location.href = url
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  @import 'insurance-card.scss';
</style>



