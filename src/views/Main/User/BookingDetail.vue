<template>
  <div class="detail">
    <div class="app-header">
      <x-header :left-options="{showBack: false}">预约详情
        <a slot="left" class="vux-header-back" @click="$router.push({name: 'VisitDocRecord'})">返回</a>
      </x-header>
    </div>
    <div class="app-content">
      <span class="state">{{bookingDetail.state}}</span>
      <!--押金情况-->
      <div style="padding: 0 10px; font-size: 14px;margin-top: 10px;margin-bottom: -10px;">
        <span v-if="bookingDetail.state === 7">{{validateTitle}}: <span style="color: orange">{{bookingDetail.return_deposits || 0}}</span>元</span>
        <span v-else>{{validateTitle}}: <span style="color: orange">{{bookingDetail.pay_deposits}}</span>元</span>
      </div>
      <group title="预约人信息" style="margin-top: 20px">
        <p class="item">{{bookingDetail.name}} {{bookingDetail.gender}} {{bookingDetail.age}}</p>
        <p class="item">手机号码：{{bookingDetail.tel}}</p>
        <p class="item">身份证：{{bookingDetail.id_number}}</p>
      </group>
      <group title="预约医院信息">
        <p class="item">医院：{{bookingDetail.hos_name}}</p>
        <p class="item">科室：{{bookingDetail.dept_name}}</p>
      </group>
      <group title="疾病信息">
        <div class="item">
          疾病情况：{{bookingDetail.illness}}
        </div>
        <!--<div class="item">-->
        <!--医生备注：{{bookingDetail.doctor_remark}}-->
        <!--</div>-->
        <div class="item">
          描述：{{bookingDetail.priorities}}
        </div>
        <div class="item">
          推荐医生：{{recommend}}
        </div>
      </group>
      <group title="预约要求">
        <p class="item">床位类型：{{bookingDetail.bed_type}}</p>
        <p class="item">期望入住日期：{{bookingDetail.expect_checkin_date}}</p>
        <p class="item">最迟入院日期：{{bookingDetail.late_checkin_date}}</p>
        <p class="item">留言：{{bookingDetail.message}}</p>
      </group>
      <p class="item">申请时间：{{bookingDetail.apply_date}}</p>
      <flexbox>
        <flexbox-item v-if="bookingDetail.state=='待确认'">
          <x-button type="default" @click.native="requeueBooking">改期排队</x-button>
        </flexbox-item>
        <flexbox-item v-if="bookingDetail.state=='待确认'">
          <x-button type="primary" @click.native="confirmBooking">确认</x-button>
        </flexbox-item>
        <flexbox-item v-if="bookingDetail.state=='排队中' || bookingDetail.state=='待确认' || bookingDetail.state=='待支付'">
          <x-button type="warn" @click.native="cancelBooking">取消</x-button>
        </flexbox-item>
        <flexbox-item v-if="bookingDetail.state=='待支付'">
          <x-button type="primary" @click.native="goPay">现在支付</x-button>
        </flexbox-item>
      </flexbox>
    </div>
    <toast v-model="showHint" type="text">{{getRet}}</toast>
  </div>
</template>
<script>
  import { XHeader, XInput, Group, Flexbox, FlexboxItem, XButton, Toast } from 'vux'
  export default {
    components: {
      XHeader,
      XInput,
      Group,
      Flexbox,
      FlexboxItem,
      XButton,
      Toast
    },
    computed: {
      bookingDetail () {
        let list = this.$store.getters.bookingDetail
        this.recommend = ''
        if (list.recommend) {
          this.recommend = list.recommend_hos_name + ' ' + list.recommend_dept_name + ' ' + list.recommend
        }
        // 押金情况
        if (list.apply_validate === 0 && list.pay_deposits > 0) { // 待支付
          // 排队中, 待确认, 带入住
          this.validateTitle = '待支付押金'
        } else if (list.apply_validate === 1) {
          if (list.state === '违约') { // 违约
            this.validateTitle = '违约扣留押金'
          } else if (list.state === '取消') { // 已取消
            this.validateTitle = '已退回押金'
          } else {
            this.validateTitle = '已支付押金'
          }
        }
        return list
      },
      getRet () {
        let data = this.$store.getters.bookingMsg
        if (data) {
          this.showHint = true
          this.$store.dispatch('clearBookingMsg')
        }
        return data
      }
    },
    data () {
      return {
        recommend: '',
        id: 0,
        showHint: false,
        validateTitle: ''
      }
    },
    methods: {
      requeueBooking () {
        this.$store.dispatch('userRequeueOrder', this.id)
      },
      confirmBooking () {
        this.$store.dispatch('userConfirmOrder', this.id)
      },
      cancelBooking () {
        const _this = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确认取消订单？',
          onConfirm () {
            _this.$store.dispatch('userCancelOrder', _this.id)
          }
        })
      },
      goPay () {
        this.$router.push({
          name: 'ConfirmOrder',
          query: {
            id: this.bookingDetail.id,
            orderId: this.bookingDetail.trade_order
          }
        })
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.id = this.$route.params.id
        this.$store.dispatch('getBookingDetail', this.id)
      })
    }
  }
</script>
<style lang="scss">
  @import "style/detail.scss";
</style>

