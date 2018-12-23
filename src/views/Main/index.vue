<template>
  <div class="main">
    <tabbar>
      <tabbar-item v-for="(item, index) in tabsData" :selected="selectIdx==index?true:false"
                   :key="index" @on-item-click="itemClick">
        <i slot="icon" :class="'fa ' + item.icon "></i>
        <span slot="label" class="tab_text">{{item.text}}</span>
      </tabbar-item>
    </tabbar>
    <div class="wrapper container">
      <div class="g-profile-main">
        <transition
          mode="out-in"
          enter-active-class="fadeIn"
          leave-active-class="fadeOut"
          appear>
          <router-view class="animated"></router-view>
        </transition>
      </div>
    </div>

  </div>
</template>
<script>
  import {Tabbar, TabbarItem, XDialog} from 'vux'
  import {LOCATION_DATA} from '../../config/sessionStorage'
  export default{
    components: {
      Tabbar,
      TabbarItem,
      XDialog
    },
    data () {
      return {
        show: false,
        qrCodeData: null,
        isSpecialDept: false,
        selectIdx: 0,
        tabsData: [],
        homeTab: {
          icon: 'fa-home',
          text: '首页',
          path: '/main/home'
        },
        deptTab: {
          icon: 'fa-home',
          text: '首页',
          path: '/main/special-dept/'
        },
        commTab: [
          {
            icon: 'fa-clock-o',
            text: '提醒',
            path: '/main/remind'
          },
          {
            icon: 'fa-user',
            text: '我的',
            path: '/main/user'
          }
        ]
      }
    },
    watch: {
      idx (val) {
        this.selectIdx = Number(val)
      }
    },
    computed: {
      idx () {
        return this.$store.getters.tabIdx
      }
    },
    methods: {
      itemClick (val) {
        if (this.isSpecialDept && val === 0) {
          this.$router.push({path: this.tabsData[val].path + this.qrCodeData.deptId})
        } else {
          this.$router.push({path: this.tabsData[val].path})
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.qrCodeData = JSON.parse(window.localStorage.getItem(LOCATION_DATA.QRCODE_DEPT))
        this.selectIdx = this.idx
        // 如果是定制化科室进入
        if (this.$route.path.indexOf('special') > 0) {
          this.isSpecialDept = true
          // 连接跳转到定制化科室的不显示下面的菜单，扫码的才显示
          if (this.qrCodeData.enter === 'qrcode') {
            if (this.$auth.check() && this.qrCodeData.deptName) {
              this.deptTab.text = this.qrCodeData.deptName + '首页'
            }
            this.commTab.splice(0, 0, this.deptTab)
            this.tabsData = this.commTab
          } else {
            this.tabsData = []
          }
        } else {
          // 主界面
          this.isSpecialDept = false
          this.commTab.splice(0, 0, this.homeTab)
          this.tabsData = this.commTab
        }
      })
    }
  }
</script>
<style lang="scss">
  @import "main.scss";
</style>
