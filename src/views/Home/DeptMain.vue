<template>
  <div class="hos-main">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回', preventGoBack: true}" @on-click-back="back">
        {{title}}
        <i slot="right" @click="isShowPop = true" class="fa fa-qrcode" style="font-size:24px"></i>
      </x-header>
    </div>
    <div class="pad-content" style="padding: 44px 0px 50px 0px" v-if="!isSpecial">
      <div class="main">
        <div class="image-father">
          <img class="image" :src="imgServer + dept.picture">
        </div>
        <div class="base-info">
          <p class="name">{{ dept.name }}</p>
          <p>{{ dept.hospitalName }}</p>
        </div>
      </div>
      <tab>
        <tab-item v-for="(item, idx) in tabTitle" :selected="idx==tabIdx?true:false" @on-item-click="onItemClick(idx)" :key="idx">{{item}}</tab-item>
      </tab>
      <panel-card v-if="tabIdx==0" :data-list="docs" :type="5"></panel-card>
      <group v-if="tabIdx==1&&deptGruidData">
        <cell v-for="item in  deptGruidData.list" :title="item.title" :key="item.id"
              :link="'/home/dept/guide-detail/' + item.id + '/' + deptId + '/' + item.children_size"></cell>
      </group>
      <div v-if="tabIdx==2" class="bref">
        <p class="title" v-show="diseases">擅长：</p>
        <p v-html="diseases">{{ diseases }}</p>
        <p class="title" v-show="dept.diseaseDemand">疾病要求：</p>
        <p>{{ dept.diseaseDemand }}</p>
        <p class="title" v-show="dept.address">地址：</p>
        <p>{{ dept.address }}</p>
        <p class="title" v-show="dept.summary">简介：</p>
        <p v-html="summary"></p>
      </div>
      <div class="footer" v-if="dept.openApply==1">
        <flexbox class="footer-box">
          <flexbox-item v-if="dept.serviceType == 100 || dept.serviceType == 1">
            <x-button size="large" type="primary" class="booking-btn" @click.native="jump2Booking" style="font-size: 16px">预约住院</x-button>
          </flexbox-item>
          <flexbox-item v-if="dept.serviceType == 100 || dept.serviceType == 2">
            <x-button size="large" type="primary" class="booking-btn" @click.native="jump2PrenatalCareApply" style="font-size: 16px">预约产检</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <x-dialog v-model="isShowPop">
      <div class="img-box">
        <p class="title">扫一扫进入科室主页</p>
        <img :src="httpServer + dept.id" style="width: 100%;height:100%">
        <p class="state">{{dept.name}}二维码</p>
      </div>
      <span class="vux-close" @click="isShowPop=false"></span>
    </x-dialog>
    <x-dialog v-model="showQRCode">
      <div class="img-box">
        <p class="title">长按二维码关注公众号</p>
        <img src="~assets/image/weui_user.jpg" style="max-width:100%">
        <p class="state">医秘99</p>
      </div>
      <span class="vux-close" @click="close"></span>
    </x-dialog>
  </div>
</template>
<script>
  import PanelCard from '../../components/panel-card'
  import { mapGetters } from 'vuex'
  import { QUERY_NAME } from '../../config/Constant'
  import { SESSION_DATA, LOCATION_DATA } from '../../config/sessionStorage'
  import HtmlCodeUtil from '../../utils/HtmlCodeUtil'
  import { XHeader, Tab, TabItem, XButton, XDialog, Group, Cell, Flexbox, FlexboxItem } from 'vux'

  export default {
    components: {
      PanelCard, XHeader, Tab, TabItem, XButton, XDialog, Group, Cell, Flexbox, FlexboxItem
    },
    computed: {
      ...mapGetters({
        dept: 'dept_department',
        diseases: 'dept_diseases',
        docs: 'dept_doctorDetails',
        deptGruidData: 'deptGruidData',
        checkYM99: 'checkYM99'
      })
    },
    watch: {
      dept (val) {
        if (val.summary) {
          this.summary = HtmlCodeUtil.HTMLDecode(val.summary)
        }
        let pageParams = {
          browser_type: 'h5',
          page_name: 'h5患者端-科室主页（链接进入）',
          req_url: this.$route.path,
          terminal_type: 'user',
          dept_id: val.id
        }
        // 扫科室二维码进入的，保存注册统计信息
        if (this.$route.path.indexOf('qrcode') > 0) {
          pageParams.page_name = 'h5患者端-科室主页（扫码进入）'
          let registerStatic = {
            type: 2,
            deptId: val.id
          }
          window.sessionStorage.setItem(SESSION_DATA.REGISTER_STATIC, JSON.stringify(registerStatic))
        }
        this.$store.dispatch('pageStatis', pageParams)
        if (val.homePageType === 2) {
          this.isSpecial = true
          let data = {
            deptId: val.id,
            deptName: val.name,
            enter: 'link'
          }
          if (this.$route.path.indexOf('qrcode') > 0) {
            // 说明是从扫码跳入
            data.enter = 'qrcode'
          }
          // 保存扫码进入的信息，下次进入公众号自动跳转到定制化科室主页
          window.localStorage.setItem(LOCATION_DATA.QRCODE_DEPT, JSON.stringify(data))
          // 产科
          this.$router.replace({path: '/main/special-dept/' + val.id})
        } else {
          this.isSpecial = false
          window.localStorage.removeItem(LOCATION_DATA.QRCODE_DEPT)
        }
      }
    },
    data () {
      return {
        showQRCode: false,
        isSpecial: true,
        tabTitle: ['医生', '就医指导', '简介'],
        summary: '',
        tabIdx: 0,
        isShowPop: false,
        selected: '0',
        imgServer: '',
        deptId: 0,
        title: '科室主页',
        httpServer: ''
      }
    },
    methods: {
      close () {
        this.showQRCode = false
//         WeixinJSBridge.invoke('closeWindow', {}, function (res) {
//         })
      },
      back () {
        if (this.$route.path.indexOf('qrcode') > 0) {
          // 扫码进入的，判断是否需要关注公众号
          if (this.$auth.check() && this.checkYM99.follow_flag) {
            // 不需要提示关注二维码
            this.close()
          } else {
            this.showQRCode = true
          }
        } else {
          // 从连接跳转过来的，返回到上一个页面
          window.history.back()
        }
      },
      onItemClick (idx) {
        this.tabIdx = idx
      },
      jump2Booking () {
        this.$router.push({name: 'Booking', query: {id: this.deptId, t: QUERY_NAME.DEPARTMENT}})
      },
      jump2PrenatalCareApply () {
        this.$router.push({name: 'PrenatalCareApply', query: {id: this.deptId, t: QUERY_NAME.DEPARTMENT}})
      }
    },
    beforeMount: function () {
      this.$nextTick(function () {
        // 从患者中心'我的科室'跳转进来, 标题改为我的科室
        let query = this.$route.query
        if (query.type && query.type === 'isMy') {
          this.title = '我的科室'
        }
        this.deptId = this.$route.params.deptId
        this.$store.dispatch('getDepartment', this.deptId)
        let temp = {
          istt_id: this.deptId,
          module: 1,
          type: 2,
          parent_id: 0
        }
        this.$store.dispatch('getDeptGuide', temp)
        this.imgServer = this.$store.state.imgServer
        let idx = window.sessionStorage.getItem('tabIdx')
        if (idx) {
          this.tabIdx = idx
        }
        if (this.$auth.check()) {
          // 检测是否关注公众号
          this.$store.dispatch('checkAttentYM99')
        }
        this.httpServer = this.$http.options.root +
          '/common/base_data/generate_qr_code?url=http://ymu.yimi99.com/qrcode-dept-main/'
      })
    },
    destroyed () {
      window.sessionStorage.setItem('tabIdx', this.tabIdx)
    }
  }
</script>
<style lang="scss">
  @import "style/hospital-main.scss";

</style>
