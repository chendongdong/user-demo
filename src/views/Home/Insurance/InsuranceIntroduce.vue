<template>
  <div class="insurance-introduce">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">保险介绍</x-header>
    </div>
    <div class="content">
      <div class="swiper-box">
        <swiper :list="swiperList"
                auto
                style="width:100%; margin:0 auto; background-color: #F7F7F7"
                height="180px"
                dots-class="custom-bottom"
                dots-position="center">
        </swiper>
        <div class="swiper-label">
          <span style="line-height: 36px;padding-left: 8px;color: darkgray;font-size: 13px;">该保险由中国人保承保并负责理赔 </span>
          <!--<img src="" alt="">-->
          <!--<div class="pull-right" style="height: 30px;">-->
          <!--<i class="fa fa-heart" style="color: #80C560;line-height: 36px;"></i>-->
          <!--<router-link slot="right" class="pull-right complaints" :to="{path: '/home/yimi-service'}" style="text-decoration: none;line-height: 36px;padding:0 8px 0 4px;color: black;">客服</router-link>-->
          <!--</div>-->
        </div>
      </div>

      <!--介绍-->
      <div class="i-intro-card">
        <div class="i-intro-card-header">
          <label class="i-intro-card-header-name">慧孕保母婴健康医疗保险尊享款</label>
        </div>
        <div>
          <span style="color: orange;line-height: 30px;font-size: 18px;font-weight: 600">¥681.00</span>
          <span class="pull-right" style="color: darkgray">已售: <span>3881</span></span><br>
          <span style="color: darkgray">承保年龄: <span>18-45周岁</span></span>
          <span class="pull-right" style="color: darkgray">承保期间: <span>1年</span></span><br>
          <span>
            <i class="fa fa-check-square-o" aria-hidden="true" style="color: #80C55F"></i>
            <span>新生儿孕妈双重保障</span>
          </span>
          <span style="margin-left: 8px;">
            <i class="fa fa-check-square-o" aria-hidden="true" style="color: #80C55F"></i>
            <span>保费低廉，保障全面</span>
          </span>
        </div>
      </div>

      <!--投保须知-->
      <div class="i-intro-card">
        <div class="i-intro-card-header">
          <img src="~assets/recom_ins.png" style="height: 25px;width: 25px;">
          <p style="color: #68C84F;font-size: 16px;margin-top: 2px;line-height: 20px;">投保须知</p>
        </div>
        <div style="border-bottom:  1px solid darkgray;height: 100px;
color: darkgray">
          设置投保内容
        </div>
        <span>
            更多请查看
            <a href="http://www.yimi99.com" style="color: cornflowerblue">《保险条款及告知》</a>
            <a href="http://www.yimi99.com" style="color: cornflowerblue">《电子保单样本》</a>
        </span>
      </div>

      <!--产品介绍-->
      <div class="i-intro-card">
        <div class="i-intro-card-header">
          <img src="~assets/recom_ins.png"  class="i-intro-card-header_img">
          <p class="i-intro-card-header_title">产品介绍</p>
        </div>
        <div class="i-intro-card-info_1">
          <p class="i-intro-card-info_btn" style="background-color: #5BCAFA">新生儿孕妈双重保障</p>
          <p class="i-intro-card-info_btn" style="background-color: #66C99C">保费低廉，保障全面</p>
          <p class="i-intro-card-info_btn" style="background-color: #C49CF9">20万妊娠身故保障</p>
        </div>
      </div>

      <!--投保案例-->
      <div class="i-intro-card">
        <div class="i-intro-card-header">
          <p class="i-intro-card-header_title">投保案例</p>
        </div>
        <div>
          <p>徐女士,今年32岁,有一个女儿,因国家对生育政策逐步放开,自己也和丈夫商量计划再生一个孩子,同时选择在医秘99购买了一份</p>
          <p>被投保人: <span>徐女士</span></p>
          <p>保费:
            <span style="color: orange;line-height: 30px;font-size: 18px;font-weight: 600">¥681.00</span>
          </p>
          <p>所获得的保险收益</p>
          <p>1、妊娠身故：<span style="color: #70CD59">20万 </span></p>
          <p>2、新生儿重症住院及手术医疗：<span style="color: #70CD59">20万 </span></p>
          <p>1、妊娠身故：<span style="color: #70CD59">20万 </span></p>
          <p>1、妊娠身故：<span style="color: #70CD59">20万 </span></p>
        </div>
      </div>

      <!--常见问题-->
      <div class="i-intro-card">
        <div class="i-intro-card-header">
          <img src="~assets/recom_ins.png" class="i-intro-card-header_img">
          <p class="i-intro-card-header_title">常见问题</p>
        </div>
        <div>
          <p style="color: #CCAAFA;">如何验证保单?</p>
          <p>投保完成后,电子保单会直接发送至您邮箱,为保证您的合法权益,您可在投保成功后的次日拨打永安产险客服电话95502或通过访问官网对您所投保保单的相关信息进行查询。</p>
        </div>
        <div style="text-align: center">
          <a href="http://www.yimi99.com" style="color: darkgray">查看更多</a>
        </div>
      </div>

      <!--用户评价-->
      <div class="i-intro-card">
        <div class="i-intro-card-header">
          <img src="~assets/recom_ins.png" class="i-intro-card-header_img">
          <p class="i-intro-card-header_title">用户评价</p>
          <span>(200条)</span>
        </div>
        <div>
          <div style="display: flex;justify-content: start" v-for="(i, index) in 3" :key="index">
            <div style="text-align: center;width: 80px;">
              <img src="~assets/head.jpg" class="i-intro-card-appraise_img"><br>
              <p class="i-intro-card-appraise_name">183*******</p>
            </div>
            <div style="width: 100%;margin-left: 8px;">
              <rater v-model="data3" active-color="red" :font-size="13"></rater>
              <span style="color: red;">非常好</span>
              <br>
              <p style="color: darkgray;font-size: 13px;">这个产品非常好，保费低，保障高，推荐！</p>
            </div>
          </div>
        </div>
        <div style="text-align: center">
          <a href="http://www.yimi99.com" style="color: darkgray">查看更多</a>
        </div>
      </div>

      <!--理赔流程-->
      <div class="i-intro-card">
        <div class="i-intro-card-header" style="display: flex;justify-content: space-between;">
          <div style="display: inline-flex">
            <img src="~assets/recom_ins.png" class="i-intro-card-header_img">
            <p class="i-intro-card-header_title">理赔服务</p>
          </div>
          <div>
            <!--<x-button type="default" class="pull-right" style="width: 80px;height: 36px;font-size: 14px;">查看理赔资料</x-button>-->
            <p class="i-intro-card-header_btn">查看理赔资料</p>
          </div>
        </div>
        <div>
          <p>1. 理赔步骤</p>
          <p>...........</p>
          <br>
          <p>2. 理赔案例</p>
          <p>陈女士于2017年12月17日在医秘99平台购买了一份母婴安心险，事后在保险期间内，若被保险人与分娩过程中、分娩当次住院期间或分娩后5日内身故</p>
          <p>获得理赔金额：<span style="font-size: 18px;font-weight: 600;color: orange">20万</span></p>
        </div>
        <div>
        </div>
      </div>

      <!--关注医秘-->
      <div class="i-intro-card_footer">
        <a href="http://www.yimi99.com" style="color: #68C84F">关注医秘99，获取更多保险资讯>></a>
      </div>

      <!--购买按钮-->
      <div class="i-intro-footer">
        <div class="i-intro-footer-img_bg">
          <img src="~assets/image/online-service-blue.png"><br>
          <p>咨询</p>
        </div>
        <div class="i-intro-footer-btn_bg">
          <x-button type="primary" class="i-intro-footer-btn">立即购买</x-button>
        </div>
      </div>

      <div>
        <!--<insurance-card :data-list="insuranceList"></insurance-card>-->
      </div>
    </div>
  </div>
</template>
<script>
  import { Swiper, XHeader, Rater, XButton } from 'vux'
  import { mapGetters } from 'vuex'
  import InsuranceCard from '../../../components/Insurance-Card'
  import TempData from '../../../config/TempData'

  export default {
    components: {
      XHeader,
      Swiper,
      InsuranceCard,
      Rater,
      XButton
    },
    computed: {
      ...mapGetters({
//        weChatPayRes: 'weChatPayRes'
      })
    },
    data: function () {
      return {
        swiperList: TempData.insurance.swiper,
        insuranceList: TempData.insurance.insuranceList,
        data3: 3
      }
    },
    watch: {},
    methods: {},
    beforeMount () {
    }
  }
</script>

<style lang="scss">
  @import '/style/insuranceIntroduce.scss';
</style>



