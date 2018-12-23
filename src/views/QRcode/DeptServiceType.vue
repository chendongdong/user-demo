<template>
  <div class="dept-service-type">
    <div class="app-header">
      <x-header :left-options="{showBack: false, backText: '返回'}">{{deptInfo.dept_show_name}}</x-header>
    </div>
    <div class="content">
      <div class="swiper-box">
        <swiper :list="bannerList"
                auto
                style="width: 100%; margin:0 auto; background-color: #F7F7F7"
                :aspect-ratio="360/900"
                dots-class="custom-bottom"
                dots-position="center">
        </swiper>

        <div class="swiper-label">
          <span style="line-height: 36px;padding-left: 8px;">服务热线: <span style="color: red;">0755-82266178</span></span>
          <div class="pull-right" style="height: 30px;">
            <!--<i class="fa fa-heart" style="color: #80C560;line-height: 36px;"></i>-->
            <!--<router-link slot="right" class="pull-right complaints" :to="{path: '/home/yimi-service'}" style="text-decoration: none;line-height: 36px;padding:0 8px 0 4px;color: black;">客服</router-link>-->
          </div>
        </div>
      </div>

      <div style="display: flex;justify-content: space-around">
        <div @click="go2Booking">
          <div style="width: 100%">
            <img src="../../assets/ic_booking_service.png" alt="" style="margin: 10px;width: 90%;"/>
          </div>
        </div>

        <div @click="go2PrenatalCareApply">
          <div style="width: 100%">
            <img src="../../assets/ic_prenatal_care_service.png" alt="" style="margin: 10px;width: 90%;"/>
          </div>
        </div>
      </div>
      <!--<div class="item-card">-->
      <!--<div class="img-bg">-->
      <!--<img src="../../assets/ic_booking_service.png" alt=""/>-->
      <!--</div>-->
      <!--<div class="info">-->
      <!--<div class="info-header">-->
      <!--<span class="info-title">预约住院</span>-->
      <!--<router-link class="pull-right booking-btn" :to="{path: '/booking?id=' + deptId + '&t=department'}" style="text-decoration: none">我要预约</router-link>-->
      <!--</div>-->
      <!--<div class="info-text">-->
      <!--<span>说明: <span class="info-applicable">医秘约床, 质量保证</span></span><br>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->

      <!--<div class="item-card">-->
      <!--<div class="img-bg">-->
      <!--<img src="../../assets/ic_prenatal_care_service.png" alt=""/>-->
      <!--</div>-->
      <!--<div class="info">-->
      <!--<div class="info-header">-->
      <!--<span class="info-title">预约孕检</span>-->
      <!--<router-link class="pull-right booking-btn" :to="{path: '/user/prenatal-care-apply?id=' + deptId + '&t=department'}" style="text-decoration: none">我要预约</router-link>-->
      <!--</div>-->
      <!--<div class="info-text">-->
      <!--<span>说明: <span class="info-applicable">医秘产检, 品质一流</span></span><br>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script>
  import { Swiper, XHeader, XButton } from 'vux'
  import { mapGetters } from 'vuex'
  import InsuranceCard from '../../components/Insurance-Card'
  import { Department } from '../../api'
  import { RESULT_CODE } from '../../config/ResultCode'

  export default {
    components: {
      XHeader,
      Swiper,
      InsuranceCard,
      XButton
    },
    computed: {
      ...mapGetters({
        homeBanner: 'homeBanner'
      })
    },
    data: function () {
      return {
        deptInfo: {},
        deptId: '',
        bannerList: []
      }
    },
    watch: {
      homeBanner (val) {
        this.bannerList = []
        for (let i = 0; i < val.length; i++) {
          let url = ':javascript'
          let temp = {
            url: url,
            img: this.$store.state.imgServer + val[i].img_addr,
            title: ''
          }
          this.bannerList.push(temp)
        }
      }
    },
    methods: {
      getDeptInfo (id) {
        this.$vux.loading.show({
          text: '加载中...'
        })
        Department.getDeptInfo(id).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            this.deptInfo = res.data.data
            this.$vux.loading.hide()
          }
        })
      },
      go2Booking () {
        this.$router.push({name: 'Booking', query: {id: this.deptId, t: 'department'}})
      },
      go2PrenatalCareApply () {
        this.$router.push({name: 'PrenatalCareApply', query: {id: this.deptId, t: 'department'}})
      }
    },
    mounted () {
      this.$store.dispatch('getHomeBanner')
      this.deptId = this.$route.params.deptId
      if (this.deptId) {
        this.getDeptInfo(this.deptId)
      }
    }
  }
</script>

<style lang="scss">
  @import 'style/deptServiceType.scss';
</style>



