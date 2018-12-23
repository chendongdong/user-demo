<template>
  <div class="insurance-introduce">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">保险详情</x-header>
      <tab :line-width=2 active-color='#68C84F' v-model="tabIndex">
        <tab-item class="vux-center" :selected="tabSelectItem === item" v-for="(item, index) in tabList"
                  @on-item-click="tabItemClick(index)" :key="index">{{item}}
        </tab-item>
      </tab>
    </div>
    <div class="app-content" v-if="insurCategorys&&insurInfos.id">
      <div v-if="tabIndex==0">
        <img :src="imgServer + insurInfos.intro_img" style="width: 100%;">
        <div class="insur-info">
          <p class="insur-name">{{insurInfos.name}}</p>
          <p class="price">￥{{insurInfos.price}}</p>
          <div class="logo">
            <span>承保年龄：{{insurInfos.suit_age}}</span>
            <span style="font-size: 14px">
            已售<span style="color: red">{{insurInfos.history_cnt}}</span>
          </span>
          </div>
          <p class="logo" style="font-size: 13px" v-if="insurInfos.insurance_expires">
            保障期限：{{insurInfos.insurance_expires}}</p>
        </div>
        <div class="insur-range" style="margin-top: 10px">
          <div class="logo range">
            <img src="~assets/image/ic_insur_tips.png" style="width: 20px;margin-top: 5px">
            <span>保障范围</span>
          </div>
          <group class="range-item">
            <cell v-for="(range, idx) in insurInfos.insur_range" :key="idx" :is-link="range.dsc!=''&&!range.is_show"
                  :title="range.title" :value="range.value" @click.native="cellClick(idx)">
              <span slot="inline-desc" v-show="range.is_show" v-html="range.dsc"></span>
            </cell>
          </group>
        </div>
        <div style="margin-top: 10px;background: white" v-html="insurInfos.detail_content"></div>
      </div>
      <div v-if="tabIndex==1">
        <div class="common-top">
          <img src="~assets/image/ic_insur_tips.png" style="width: 20px;margin-top: 5px">
          <span>投保案例</span>
        </div>
        <div v-html="insurInfos.insure_case"></div>
      </div>
      <div class="insur-range evaluat" v-if="tabIndex==2">
        <div class="logo range" style="font-weight: normal">
          <img src="~assets/image/ic_insur_tips.png" style="width: 20px;margin-top: 5px">
          <span>用户评价
            <span v-if="commentList">（{{commentList.total_row}}条）</span>
          </span>
        </div>
        <div
            v-if="newComment.length>0"
            class="appaise"
            v-infinite-scroll="loadMore"
            infinite-scroll-distance="100">
          <div class="flex" v-for="(comment, index) in newComment" :key="index">
            <div style="text-align: center;width: 80px;">
              <img :src="imgServer + comment.user_picture" class="appraise_img"><br>
              <p class="appraise_name">{{comment.user_name}}</p>
            </div>
            <div style="width: 100%;margin-left: 8px;">
              <rater v-model="comment.extend_params.rater" active-color="red" :font-size="13" disabled></rater>
              <span style="color: red;">{{comment.extend_params.rater_text}}</span>
              <span class="time">{{comment.created}}</span>
              <p class="text">{{comment.content}}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tabIndex==3" class="claims">
        <div class="logo range">
          <img src="~assets/image/ic_insur_tips.png" style="width: 20px;margin-top: 5px">
          <span>理赔流程</span>
        </div>
        <div v-html="insurInfos.settle_process"></div>
      </div>
    </div>
    <div v-if="tabIndex==2" class="bottom appraise">
      <group style="flex: 1">
        <p slot="title">
          发表评价：
          <rater v-model="raterLevel" active-color="red" :font-size="13"></rater>
          {{raterText[raterLevel]}}
        </p>
        <x-textarea v-model="commentContent" :max="1000" :show-counter="false"></x-textarea>
      </group>
      <x-button mini type="primary" text="提交" class="btn-submit" @click.native="sendComent"></x-button>
    </div>
    <div @click="jump2Service" class="service">
      <img src="~assets/image/service_tran.png" class="service-img">
      <p class="service-text">医秘小助</p>
    </div>
    <div class="bottom">
      <div class="price">￥{{insurInfos.price}}</div>
      <x-button mini type="primary" text="立即投保" class="btn" @click.native="jump2buy"></x-button>
    </div>
    <loading v-model="isLoadInsur" text="加载中"></loading>
  </div>
</template>
<script>
  import { XHeader, Tab, TabItem, Cell, Group, XButton, Rater, Loading, XTextarea } from 'vux'
  import { mapGetters } from 'vuex'
  import CloneData from '../../utils/CloneData'
  //  import HTMLDecode from '../../uitls/HtmlCodeUtil'
  import BridgeUtil from '../../utils/bridgeUtil/index'

  export default {
    components: {
      XHeader, Tab, TabItem, Cell, Group, XButton, Rater, Loading, XTextarea
    },
    computed: {
      ...mapGetters([
        'insurCategorys',
        'isLoadInsur',
        'commentList',
        'commentMsg'
      ])
    },
    watch: {
      insurCategorys (val) {
        this.insurInfos = {}
        if (val && val.list.length > 0) {
          CloneData.extend(this.insurInfos, val.list[0])
        }
      },
      commentList (val) {
        if (this.pageNum === 1) {
          this.newComment = []
        }
        if (val && val.list.length > 0) {
          this.newComment = this.newComment.concat(val.list)
        }
      },
      commentMsg (data) {
        if (data === '') return
        if (data === 1) {
          this.pageNum = 1
          this.getComList()
        } else if (data === -1) {
        } else {
          this.$vux.alert.show({
            title: '提示',
            content: '评价失败'
          })
        }
        this.$store.dispatch('clearCommentMsg')
      }
    },
    data () {
      return {
        raterText: ['极差', '非常差', '差', '一般', '好', '非常好'],
        raterLevel: 5,
        newComment: [],
        isFirst: true,
        pageNum: 1,
        pageSize: 5,
        commentContent: '',
        insurInfos: {},
        imgServer: null,
        id: null,
        data3: 3,
        isShow: false,
        tabList: ['产品介绍', '投保案例', '用户评价', '理赔流程'],
        tabSelectItem: '产品介绍',
        tabIndex: 0
      }
    },
    methods: {
      cellClick (idx) {
        this.insurInfos.insur_range[idx].is_show = !this.insurInfos.insur_range[idx].is_show
        this.$forceUpdate()
      },
      jump2Info () {
        this.$vux.alert.show({
          title: '提示',
          content: '暂未开通，敬请期待'
        })
      },
      jump2Service () {
        this.$router.push({name: 'YimiService'})
      },
      tabItemClick (idx) {
        this.tabSelectItem = this.tabList[idx]
      },
      jump2buy: function () {
        // 如果是扫码进入的会保存患者的手机号码，如果没保存说明是从主界面进入的，则先让患者登录
        let phone = window.sessionStorage.getItem('insur-phone')
        if (!phone) {
          if (!this.checkLogin()) return
        }
        let url = ''
        if (this.insurInfos.code === 'myaxzhbx') { // id=2: 母婴安心险 新建保
          url = this.insurInfos.url + this.$auth.user().account
        } else { // 人保
          url = this.insurInfos.url
        }
        // 跳转到保险公司的保单提交界面
        if (url) {
          // iOS APP打开, 使用ios本地控制器打开网页
          if (BridgeUtil.isiOSApp) {
            BridgeUtil.iOS.push(url)
          } else {
            window.location.href = url
          }
        } else {
          // 跳转到医秘的保单申请界面，已对接的保险
          this.$router.push({path: '/insurance/apply/' + this.insurInfos.id})
        }
      },
      // 获取评论列表
      getComList () {
        let temp = {
          ref_id: this.id,
          type: 'insurance',
          page_size: this.pageSize,
          page_number: this.pageNum
        }
        this.$store.dispatch('getComments', temp)
      },
      // 加载更多评论
      loadMore () {
        if (this.isFirst) {
          this.isFirst = false
          return
        }
        if (this.commentList.last_page === false) {
          this.pageNum++
          this.getComList()
        }
      },
      // 发表评论
      sendComent () {
        if (!this.checkLogin()) return
        if (this.commentContent) {
          let temp = {
            content: this.commentContent,
            ref_id: this.id,
            type: 'insurance',
            extend_params: {
              rater: this.raterLevel,
              rater_text: this.raterText[this.raterLevel]
            }
          }
          this.$store.dispatch('commentsDo', temp)
          this.commentContent = ''
          this.raterLevel = 5
        } else {
          this.$vux.alert.show({
            title: '提示',
            content: '不能发送空白消息'
          })
        }
      },
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
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.imgServer = this.$store.state.imgServer
        this.id = this.$route.params.id
        this.$store.dispatch('getInsurCate', {id: this.id})
        this.getComList()
      })
    }
  }
</script>
<style lang="scss">
  @import "style/insurance_introduce.scss";
</style>
