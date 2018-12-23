x45
<template>
  <div class="booking-result">
    <div class="app-header">
      <x-header :left-options="{showBack: false}">预约成功
        <a slot="left" class="vux-header-back" @click="back">返回</a>
        <a slot="right" class="fa fa-home vux-header-back" @click="$router.push({name: 'Home'})" style="font-size: 28px;margin-top: -5px;"></a>
      </x-header>
    </div>
    <div class="content">
      <div class="page-header">
        预约成功, 请您耐心等候!
      </div>
      <div class="page-group">
        <span style="font-size: 15px;">{{deptInfos.hospital_name}}
          <span style="margin-left: 10px;color: darkorange">{{deptInfos.dept_show_name}}</span>
        </span>
        <div class="info-content">
          <div class="row">
            <span class="info-content-title">住院人：</span>
            <span class="info-content-txt" style="color: #68C84F">{{orderDetail.name}}</span><br>
          </div>
          <div class="row">
            <span class="info-content-title">床位类型：</span>
            <span class="info-content-txt">{{orderDetail.bed_type}}</span><br>
          </div>
          <div class="row">
            <span class="info-content-title">期望入院日期：</span>
            <span class="info-content-txt">{{orderDetail.expect_checkin_date}}</span><br>
          </div>
          <div class="row">
            <span class="info-content-title">最迟入院日期：</span>
            <span class="info-content-txt">{{orderDetail.late_checkin_date}}</span><br>
          </div>
          <div class="row" style="height: 15px;margin: 15px 0 10px 0;">
            <router-link slot="right" :to="{path: '/dept-main/' + deptInfos.dept_id}" style="text-decoration: none; color: cornflowerblue">>>查看科室详情</router-link>
          </div>
        </div>
      </div>
      <div class="page-code">
        <div class="qr_code">
          <img width="40%" src="../../assets/yimi_booking_qr.jpg">
          <p>长按关注医秘99公众号</p>
        </div>
      </div>
      <div class="page-bottom">
        <div class="bottom-title-bg">
          <div>
            <img src="../../assets/image/hand.png" alt="" style="height: 25px;width: 25px;margin-bottom: -6px;">
            预约规则
          </div>
          <div class="bottom-line"></div>
        </div>
        <div class="bottom-content">
          <p>1. 预约申请提交成功后，您的预约状态为排队中，待医院科室有空床位时，科室会结合您的病情、申请时间、期望入院日期等为您安排床位，并通知您入住，请耐心等待。</p>
          <p>2、您填写的期望入院日期仅代表医院科室在安排床位时尽量安排到该日期附近，不能保证满足。</p>
          <p>3、科室为您安排床位后，您将收到科室发送的入住通知短信，请务必在规定时间内按短信要求进行操作。</p>
          <p>4、收到科室短信并确认入住后即床位预约成功，等候科室通知您入住的日期前往入住即可。</p>
        </div>
      </div>
    </div>
    <div>
      <x-dialog v-model="isShoImgDialog" class="img-dialog" @on-hide="isBack=true" hide-on-blur>
        <div class="img-box">
          <img width="100%" src="../../assets/yimi_booking_qr.jpg">
          <span class="img-box-title">长按关注医秘99公众号</span><br>
          <span class="img-box-title">随时查看您的医生提醒消息</span>
        </div>
        <div @click="isShoImgDialog=false" class="dialog-close">
          <x-icon type="ios-close-empty" size="46"></x-icon>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { XHeader, XButton, Group, Cell, XInput, XDialog } from 'vux'

  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      XInput,
      XDialog
    },
    data: function () {
      return {
        isShoImgDialog: false,
        isBack: false
      }
    },
    computed: {
      ...mapGetters([
        'bookingDetail',
        'deptInfos'
      ]),
      orderDetail () {
        if (this.bookingDetail && this.bookingDetail.dept_id) {
          this.$store.dispatch('getDeptInfo', this.bookingDetail.dept_id)
        }
        return this.bookingDetail
      }
    },
    watch: {},
    methods: {
      back () {
        if (!this.isBack) {
          this.isShoImgDialog = true
        } else {
          this.$router.push({name: 'VisitDocRecord'})
        }
      }
    },
    beforeMount () {
      let query = this.$route.query
      if (query.id) {
        this.$store.dispatch('getBookingDetail', query.id)
      }
    },
    destroyed () {
    }
  }
</script>
<style lang="scss">
  @import "style/bookingResult.scss";
</style>

