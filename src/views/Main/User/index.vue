<template>
  <div class="user-profile">
    <div style="padding-bottom: 67px;">
      <div class="user-info">
        <div class="user-info-header">
          <!--<img src="~assets/ic_mine_bcg.jpg" style="width: 100%;height: 100%">-->
          <div class="user-info-img">
            <img :src="$store.state.imgServer + userInfo.user_pic">
          </div>
          <div style="width: 100%;padding: 0 10px 0 20px;color: white">
            <div style="line-height: 30px;padding-top: 40px;">
              <span class="name">{{userInfo.user_name}}</span>
              <!--<i class="fa fa-mars " aria-hidden="true" style="color: blue" v-if="userInfo.gender==1"></i>-->
              <!--<i class="fa fa-venus" aria-hidden="true" style="color: deeppink;" v-else></i>-->
              <!--<span style="padding-left: 10px;">{{userInfo.account}}</span><br>-->
            </div>
            <span style="color: #dfdfdf">所在科室: <span style="color: white;padding-left: 10px;">{{userInfo.dept_name}}</span></span><br>
            <span style="color: #dfdfdf">状态: <span style="color: white;padding-left: 10px;">{{state}}</span></span>
          </div>
        </div>
        <div class="user-info-footer">
          <div style="width: 40px;">
            <img src="../../../assets/image/remark(5).png" alt="标签" class="user-info-footer-image">
          </div>
          <div>
            <span>我的主治医生:<span class="user-info-text">{{userInfo.doctor_name}}</span> <span class="user-info-text">{{userInfo.doctor_title}}</span></span><br>
            <!--<span>我的主管护士:<span class="user-info-text">张护师</span> <span class="user-info-text user-info-tel">18888888888</span></span>-->
            <!--<img src="../../../assets/image/call.png" alt="打电话" @click="callNurse" class="user-info-call">-->
          </div>
        </div>
      </div>
      <group>
        <cell title="个人信息" is-link link="/user/information">
          <i slot="icon" class="fa fa-address-card user-cell-icon" style="color: #5491ec; font-size: 20px"></i>
        </cell>
        <cell title="我的科室" is-link :link="'/dept-main/' + userInfo.dept_id + '?type=isMy'" v-if="userInfo.dept_id">
          <i slot="icon" class="fa  fa-stethoscope user-cell-icon" style="color: #5491ec; font-size: 20px"></i>
        </cell>
        <cell title="我的保单" is-link link="/user/my-insur-list">
          <i slot="icon" class="fa fa-heart-o user-cell-icon" style="color: #68C84F; font-size: 20px"></i>
        </cell>
        <cell title="就诊记录" is-link link="/user/visit-doc-record">
          <i slot="icon" class="fa fa-user-md user-cell-icon" style="color: deeppink; font-size: 20px"></i>
        </cell>
        <cell title="孕检记录" is-link link="/user/prenatal-record">
          <i slot="icon" class="fa fa-user-md user-cell-icon" style="color: cornflowerblue; font-size: 20px"></i>
        </cell>
        <cell title="我的钱包" is-link @click.native="goToWallet">
          <i slot="icon" class="fa fa-database user-cell-icon" style="color: orange; font-size: 20px"></i>
        </cell>
        <cell title="健康档案" is-link link="/user/case-his/healthRecords">
          <i slot="icon" class="fa fa-envelope user-cell-icon" style="color: #5491ec; font-size: 20px"></i>
        </cell>
        <cell title="我的收藏" is-link link="/user/follow">
          <i slot="icon" class="fa fa-heart user-cell-icon" style="color: deeppink; font-size: 20px"></i>
        </cell>
      </group>
      <group>
        <cell title="设置" is-link link="/user/setting">
          <i slot="icon" class="fa fa-cog user-cell-icon" style="color: #5491ec; font-size: 20px"></i>
        </cell>
        <cell title="帮助中心" is-link link="/commonContent/1">
          <i slot="icon" class="fa fa-question-circle user-cell-icon" style="color: orange; font-size: 20px"></i>
        </cell>
        <cell title="关于我们" is-link link="/commonContent/2">
          <i slot="icon" class="fa fa-file-text user-cell-icon" style="color: deeppink; font-size: 20px"></i>
        </cell>
      </group>
    </div>

    <!--设置安全密码输入框-->
    <popup v-model="showSetPayPwd" height="50%" class="pwd-popup" @on-hide="reset">
      <div class="pwd-title-bd">
        <span class="pwd-title">{{isCheck ? '请再次输入支付密码':'请设置支付密码'}}</span>
      </div>
      <div class="pwd-input-bd">
        <input type="password" class="input-pay-pwd" v-show="!isCheck" v-model="payPwd" placeholder="请输入" autofocus>
        <input type="password" class="input-pay-pwd" v-show="isCheck" v-model="payPwdCheck" placeholder="请输入" autofocus>
      </div>
      <x-button text="确定" @click.native="pwdSubmit" type="primary" class="pwd-btn"></x-button>
    </popup>
  </div>
</template>
<script>
  import { Group, Cell, XInput, Popup, XButton } from 'vux'
  import { mapGetters } from 'vuex'

  const stateStr = () => ['排队中', '待确认', '待入住', '已入住', '拟出院', '已出院', '违约', '已取消']

  export default {
    components: {Group, Cell, XInput, Popup, XButton},
    computed: {
      ...mapGetters({}),
      state () {
        if (this.userInfo.state !== null) {
          return stateStr()[this.userInfo.state]
        }
      }
    },
    data () {
      return {
        showSetPayPwd: false,
        userInfo: {},
        payPwd: '',
        payPwdCheck: '',
        isCheck: false
      }
    },
    methods: {
      callNurse () {
      },
      /**
       * 检查是否设置了支付密码
       */
      goToWallet () {
        this.$auth.fetch({
          success (res) {
            // 没有设置支付密码
            if (!res.data.data.is_set_pay_password) {
              this.showSetPayPwd = true
              // 已经设置安全密码，则直接进入钱包
            } else {
              this.$router.push({name: 'Wallet'})
            }
          },
          error () {
          }
        })
      },
      pwdSubmit () {
        if (this.payPwd.length < 6) {
          this.$vux.alert.show({
            title: '提示',
            content: '密码长度不能小于6位'
          })
        } else {
          if (!this.isCheck) {
            this.isCheck = true
          } else {
            if (this.payPwd !== this.payPwdCheck) {
              const _this = this
              this.$vux.alert.show({
                title: '提示',
                content: '两次输入的密码不一致, 请重新输入',
                onHide () {
                  _this.reset()
                }
              })
            } else {
              this.showSetPayPwd = false
              // 设置安全密码
              this.$store.dispatch('setPayPassword', {
                form: {password: this.payPwd},
                _this: this
              })
            }
          }
        }
      },
      reset () {
        this.isCheck = false
        this.payPwd = ''
        this.payPwdCheck = ''
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        // tabbar选中的下标
        this.$store.dispatch('setTabIdx', 2)
        this.userInfo = this.$auth.user()
        this.$auth.fetch({
          success (res) {
            this.userInfo = res.data.data
          }
        })
      })
    }
  }
</script>
<style lang="scss">
  @import 'style/user.scss';
</style>

