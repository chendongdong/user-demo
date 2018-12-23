<template>
  <div class="home" v-if="insurCategorys">
    <div class="recommend-insur" v-for="item in insurCategorys.list">
      <div class="recommend-insur-img">
        <img src="../../assets/ic_insur_recommend.png" alt="" v-show="showImg">
      </div>
      <div class="recommend-title">
        <!--<img src="~assets/recom_ins.png" class="icon">-->
        <span class="recommend-title-name">{{item.name}}</span>
        <x-button mini plain type="primary" @click.native="buyInsurance(item)" style="float: right;margin-right: 10px">
          我要投保
        </x-button>
        <p class="insur-info"><span style="color: #555">承保年龄：</span>{{item.suit_age}}</p>
        <p class="insur-info" v-if="item.insurance_expires"><span style="color: #555">保障期限：</span>{{item.insurance_expires}}
        <p class="insur-info"><span style="color: #555">适用人群：</span>{{item.suit_crowd}}</p>
        <!--<span class="more-doc" style="color: #999; float: right; margin-top: -18px;">查看</span>-->
        </p>
      </div>
    </div>
    <div v-transfer-dom>
      <alert v-model="isShowHint" title="提示">{{hintText}}</alert>
    </div>
  </div>
</template>

<script>
  import { XButton, Alert, TransferDomDirective as TransferDom } from 'vux'
  import { mapGetters } from 'vuex'
  import Moment from 'moment'
  import BridgeUtil from '../../utils/bridgeUtil/index'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XButton, Alert
    },
    computed: {
      ...mapGetters([
        'insurCategorys'
      ])
    },
    props: {
      type: {
        type: String,
        default: 'user'  // user：从主界面进入，dept：科室主页进入，qrcode：扫码进入
      },
      pageSize: {
        type: Number,
        default: 1
      },
      showImg: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      msgNotify (val) {
        if (val.list) {
          this.notifyList = []
          for (let i = 0; i < val.length; i++) {
            let createdDay = Moment(val[i].created)
            let today = Moment()
            if (today.isSame(createdDay, 'd')) {
              this.notifyList.push(val[i])
            }
          }
        }
      }
    },
    data () {
      return {
        notifyList: [],
        isShowHint: false,
        hintText: ''
      }
    },
    methods: {
      // 检测是否登录
      checkLogin () {
        if (!this.$auth.check()) {
          let _this = this
          this.$vux.alert.show({
            title: '提示',
            content: '您尚未登录, 请先登录再进行操作',
            onHide () {
              _this.$router.push({name: 'Login'})
            }
          })
          return false
        }
        return true
      },
      buyInsurance (item) {
          // 如果有保险详情则进入保险介绍界面
        if (item.has_detail) {
          this.$router.push({path: '/insurance/introduce/' + item.id})
        } else {
            // 扫码进入的QRcodeInsur界面处理
          if (this.type === 'qrcode') {
            // 扫一扫二维码推荐
            this.$emit('buy-click', item)
          } else {
            if (!this.checkLogin()) return
            let url = ''
            if (item.code === 'myaxzhbx') { // id=2: 母婴安心险 新建保
              url = item.url + this.$auth.user().account
            } else {
              url = item.url
            }
            if (BridgeUtil.isiOSApp) {
              BridgeUtil.iOS.push(url)
            } else {
              window.location.href = url
            }
          }
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
          // 从Home主界面进入时，在这里请求数据；从定制化科室主页进入时直接在科室主页请求的数据
        if (this.type === 'user') {
          // 用户自己买
          let data
          if (this.$auth.check()) {
            data = {
              dept_id: this.$auth.user().dept_id,
              page_number: 1,
              page_size: this.pageSize
            }
          } else {
            data = {
              page_number: 1,
              page_size: this.pageSize
            }
          }
          this.$store.dispatch('getInsurCate', data)
        }
      })
    }
  }
</script>
<style lang="scss">
  @import "../../views/Home/style/home.scss";
</style>
