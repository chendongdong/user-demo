<template>
  <div class="special-dept">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回', preventGoBack: true}" @on-click-back="back">
        科室主页
        <i slot="right" @click="isShowPop = true" class="fa fa-qrcode" style="font-size:24px"></i>
      </x-header>
    </div>
    <div class="app-content" :style="{'padding-bottom': isShowTitle?'10px':'57px'}">
      <div class="dept-info">
        <div class="dept-img">
          <img :src="$store.state.imgServer + dept_department.picture" class="dept-img">
        </div>
        <div class="dept-name">
          <span class="hos">{{dept_department.hospitalName}}</span>
          <span class="dept">{{dept_department.name}}</span>
          <div class="special" ref="summary" v-html="summary" :style="summaryStyle[0]"></div>
          <x-button class="pull-right more-button"
                    :class="[isShowMore[0] ? '' : tranButtonClass]"
                    type="default"
                    mini
                    @click.native="showMoreClick(0)"
                    style="color: #CACACF;"
                    v-show="isShowMoreBtn[0]">{{isShowMore[0] ? '收缩' : '展开'}}
          </x-button>
        </div>
      </div>
      <!--<home-remind class="remind"></home-remind>-->
      <swiper auto height="30px"
              direction="vertical"
              :interval=2000
              class="text-scroll"
              :show-dots="false"
              v-if="dept_department.obstetricsConfig&&dept_department.obstetricsConfig.notice">
        <swiper-item>
          <p id="notice">{{dept_department.obstetricsConfig.notice}}</p>
        </swiper-item>
        <div class="notice">
          <img src="~assets/ic_remind_red.png">
        </div>
      </swiper>
      <fun-menu type="dept"></fun-menu>
      <div @click="jump2Service" class="service">
        <img src="~assets/image/service_tran.png" class="service-img">
        <p class="service-text">医秘小助</p>
      </div>

      <!--孕周推送-->
      <div class="dept-info" style="margin-top: 10px">
        <div class="dept-img">
          <img :src="$store.state.imgServer + obstTips.pre_view" class="dept-img">
          <p v-if="gestWeekInfos.gestational_weeks">孕{{gestWeekInfos.gestational_weeks}}周+{{gestWeekInfos.weekday}}天</p>
          <p v-else>孕{{obstTips.weeks}}周</p>
        </div>
        <div class="dept-name">
          <div class="special" ref="obstTips" v-html="obstTips.content" :style="summaryStyle[1]"></div>
          <x-button class="pull-right more-button"
                    :class="[isShowMore[1] ? '' : tranButtonClass]"
                    type="default"
                    mini
                    @click.native="showMoreClick(1)"
                    style="color: #CACACF;"
                    v-show="isShowMoreBtn[1]">{{isShowMore[1] ? '收缩' : '展开'}}
          </x-button>
          <!--<div class="btn" v-show="$auth.check() && !gestWeekInfos.gestational_weeks">-->
          <!--<x-button type="primary" mini @click.native="isShowGestConfirm=true">设置孕周</x-button>-->
          <!--</div>-->
        </div>
      </div>

      <recom-insur type="dept"></recom-insur>
      <recom-doc type="dept"></recom-doc>
      <home-info :id="19"></home-info>
      <home-info :id="18"></home-info>
    </div>
    <x-dialog v-model="showQRCode">
      <div class="img-box">
        <p class="title">长按二维码关注公众号</p>
        <img src="~assets/image/weui_user.jpg" style="max-width:100%">
        <p class="state">医秘99</p>
      </div>
      <span class="vux-close" @click="close"></span>
    </x-dialog>
    <x-dialog v-model="isShowPop">
      <div class="img-box">
        <p class="title">扫一扫进入科室主页</p>
        <img :src="httpServer + dept_department.id" style="width: 100%;height:100%">
        <p class="state">{{dept_department.name}}二维码</p>
      </div>
      <span class="vux-close" @click="isShowPop=false"></span>
    </x-dialog>
  </div>
</template>
<script>
  import {XHeader, XButton, Swiper, SwiperItem, XDialog} from 'vux'
  import {mapGetters} from 'vuex'
  import HomeRemind from 'components/home-menu/HomeRemind'
  import FunMenu from 'components/home-menu/FunMenu'
  import RecomInsur from 'components/home-menu/RecomInsur'
  import HomeInfo from 'components/home-menu/HomeInfo'
  import RecomDoc from 'components/home-menu/RecomDoc'
  import HtmlCodeUtil from '../../utils/HtmlCodeUtil'
  import {LOCATION_DATA} from '../../config/sessionStorage'

  export default {
    components: {
      XHeader, XButton, HomeRemind, FunMenu, RecomInsur, HomeInfo, RecomDoc, Swiper, SwiperItem, XDialog
    },
    data () {
      return {
        showQRCode: false,
        isShowTitle: null,
        isShowMore: [false, false],
        isShowMoreBtn: [false, false],
        maxContentHeight: 60,
        deptId: '',
        summary: '',
        summaryStyle: [],
        specialStyle: '',
        httpServer: '',
        isShowPop: false,
        tag: 1,
        isFirst: true,
        width: 0,
        marqueeTimer: null,
        noticeWidth: 0,
        speed: 50
      }
    },
    computed: {
      ...mapGetters([
        'dept_department',
        'dept_doctorDetails',
        'gestInfo',
        'unreadChatList',
        'checkYM99'
      ]),
      tranButtonClass () {
        return 'tran-button'
      },
      obstTips () {
        let tips = this.$store.getters.obstTips
        if (tips.list && tips.list.length > 0) {
          return tips.list[0]
        }
        return {}
      },
      gestWeekInfos () {
        return this.gestInfo.infos || {}
      }
    },
    watch: {
      /**
       * 孕周信息
       */
      obstTips () {
        this.$nextTick(function () {
          // 设置孕周推送的介绍的样式
          this.setSummaryStyle(1)
        })
      },
      dept_department (val) {
        if (val.summary) {
          this.summary = HtmlCodeUtil.HTMLDecode(val.summary)
          // 设置科室简介样式
          this.setSummaryStyle(0)
        }
        if (this.isFirst) {
          let that = this
          setTimeout(function () {
            that.moveNotice()
          }, 1000)
        } else {
          this.isFirst = false
        }
      },
      /**
       * 检查孕周
       */
      gestInfo (val) {
        const _this = this
        // -1: 未设置孕周
        if (val && val.flag === -1) {
          this.queryObstTips()
          this.$vux.alert.show({
            title: '提示',
            content: '请先补充孕周信息',
            onHide () {
              _this.$router.push({name: 'GestationalWeeks'})
            }
          })
        } else {
          if (val && val.infos && val.infos.gestational_weeks) {
            this.queryObstTips(val.infos.gestational_weeks)
          }
        }
      }
    },
    methods: {
      jump2Service () {
        this.$router.push({name: 'YimiService'})
      },
      close () {
        this.showQRCode = false
//        WeixinJSBridge.invoke('closeWindow', {}, function (res) {
//        })
      },
      back () {
        if (this.isShowTitle) {
          // 从连接跳转过来的，返回到上一个页面
          window.history.back()
        } else {
          // 扫码进入的，判断是否需要关注公众号
          if (this.$auth.check() && this.checkYM99.follow_flag) {
            // 不需要提示关注二维码
            this.close()
          } else {
            this.showQRCode = true
          }
        }
      },
      /**
       * 设置简介样式
       * index: 0 科室, 1 孕周
       */
      setSummaryStyle (index) {
        // 更新 DOM 后才能正确获取 DOM 的高度
        this.$nextTick(function () {
          let dom = null
          if (index === 0) {
            dom = this.$refs.summary
          } else if (index === 1) {
            dom = this.$refs.obstTips
          }
          if (dom) {
            if (dom.clientHeight > this.maxContentHeight) {
              this.summaryStyle[index] = {
                height: `${this.maxContentHeight}px`
              }
              this.isShowMoreBtn[index] = true
            }
            this.$forceUpdate()
          }
        })
      },
      /**
       * 科室简介和孕周推送简介的显示更多按钮点击
       */
      showMoreClick (index) {
        // 更新显示更多按钮的样式, 以更新箭头状态
        this.isShowMore[index] = !this.isShowMore[index]
        // 如果是收缩科室介绍, 则界面滚动到最顶部
        if (index === 0 && !this.isShowMore[index]) {
          window.scrollTo(0, 0)
        }
        this.summaryStyle[index] = {
          height: this.isShowMore[index] ? 'auto' : `${this.maxContentHeight}px`
        }
        this.$forceUpdate()
      },
      /**
       * 孕妇健康提醒/查询
       * @param weeks 孕妇孕周
       */
      queryObstTips (weeks) {
        let param = {
          'dept_id': this.deptId,
          'page_size': 1
        }
        if (weeks) {
          param.weeks = weeks
        }
        this.$store.dispatch('queryObstTips', param)
      },
      scrollToLeft () {
        let noticeP = document.getElementById('notice')
        let rx = 40 - this.noticeWidth // 最左目标，屏幕的最左边
        // 向左滚动
        if (this.width > rx) {
          this.width --
          // 判断到达最左目标后，再从屏幕最右边开始向左滚动
          if (this.width === rx) {
            this.width = window.screen.width
          }
        }
//        console.log('width=', this.width)
        noticeP.style.marginLeft = this.width + 'px' // 设置对象的x轴位置
      },
      moveNotice () {
        let noticeP = document.getElementById('notice')
        // 获取内容的宽度
        this.noticeWidth = noticeP.clientWidth
//        console.log('noticeWidth=', this.noticeWidth)
        this.width = 40
        // 如果内容的宽度大于屏幕的宽度就滚动，否则不滚动
        if (this.noticeWidth + 40 > window.screen.width) {
          this.scrollToLeft()
          let speed = 50
          this.marqueeTimer = setInterval(this.scrollToLeft, speed)
          if (document.addEventListener) {
            // 电脑，鼠标进入
            noticeP.addEventListener('mouseover', () => this.stopTimer(), false)
            // 鼠标移除
            noticeP.addEventListener('mouseout', () => this.runTimer(), false)
            // 移动端，手指触摸屏幕
            noticeP.addEventListener('touchstart', this.touch, false)
            // 手指离开屏幕
            noticeP.addEventListener('touchend', this.touch, false)
          } else if (document.attachEvent) {
            noticeP.attachEvent('onmouseover', () => this.stopTimer(), false)
            noticeP.attachEvent('onmouseout', () => this.runTimer(), false)
          } else {
            noticeP.onmouseover = this.stopTimer
            noticeP.onmouseout = this.runTimer
          }
        }
      },
      touch (e) {
        let event = e || window.event
        switch (event.type) {
          case 'touchstart':
            this.stopTimer()
            break
          case 'touchend':
            this.runTimer()
            break
        }
      },
      stopTimer () {
        clearInterval(this.marqueeTimer)
      },
      runTimer () {
        this.marqueeTimer = setInterval(this.scrollToLeft, this.speed)
      }
    },
    mounted () {
      this.$nextTick(function () {
        //  连接进入的才显示标题，扫码进入的不显示标题，显示菜单
        let qrCodeData = JSON.parse(window.localStorage.getItem(LOCATION_DATA.QRCODE_DEPT))
        if (qrCodeData.enter === 'link') {
          this.isShowTitle = true
        } else {
          this.isShowTitle = false
        }
        this.deptId = this.$route.params.id
        if (this.$auth.check()) {
          // 检测是否关注公众号
          this.$store.dispatch('checkAttentYM99')
          // 检查孕周
          this.$store.dispatch('queryGestInfo')
          // 获取专家咨询未读消息
          let userId = this.$auth.user().user_id
          let userName = this.$auth.user().user_name
          let data = {
            identity: userId + '|' + userName + '|1|2',
            dept_id: this.deptId
          }
          this.$store.dispatch('getUnreadChatList', data)
        } else {
          this.queryObstTips()
        }
        this.$store.dispatch('setTabIdx', 0)
        this.$store.dispatch('getDepartment', this.deptId)
        this.$store.dispatch('getMsgNotify', {'page_number': 1, 'page_size': 999, 'read_flag': 0})
        let insurParam = {
          dept_id: qrCodeData.deptId,
          page_number: 1,
          page_size: 1
        }
        this.$store.dispatch('getInsurCate', insurParam)
        let pageParams = {
          browser_type: 'h5',
          page_name: 'h5患者端-定制化科室主页',
          req_url: this.$route.path,
          terminal_type: 'user'
        }
        this.$store.dispatch('pageStatis', pageParams)
        this.httpServer = this.$http.options.root +
          '/common/base_data/generate_qr_code?url=http://ymu.yimi99.com/qrcode-dept-main/'
      })
    },
    beforeDestroy () {
      if (this.marqueeTimer) {
        clearInterval(this.marqueeTimer)
        this.marqueeTimer = null
      }
    }
  }
  //  let _this = this
  //  window.addEventListener('popstate', function (e) {
  //    console.log('返回键---')
  //    _this.showQRCode = true
  //  }, true)
</script>
<style lang="scss">
  @import "style/special_dept.scss";
</style>
