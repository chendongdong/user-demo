<template>
  <div class="my-remind">
    <div class="app-header">
      <x-header :left-options="{showBack: false, backText: '返回'}">提醒内容
        <router-link slot="right" to="" style="text-decoration: none; border: 1px solid #FFFFFF; border-radius: 4px;padding: 3px 5px;margin-top: -3px;" @click.native="checkLogin">新建提醒</router-link>
      </x-header>
      <tab :line-width=2 active-color='#68C84F' style="position: fixed;width: 100%;">
        <tab-item class="vux-center"
                  v-for="(item, index) in tabList"
                  :selected="tabSelectItem === item"
                  @on-item-click="tabClick"
                  :key="index">{{item}}
        </tab-item>
      </tab>
    </div>
    <div class="app-content">
      <div v-show="tabIndex == 0 && msgNotify && !msgNotify.list.length" style="margin-top: 20px; text-align: center;color: gray;">
        <span>没有提醒~</span>
      </div>
      <div v-show="tabIndex !== 0 && notifyTemplate && !notifyTemplate.length" style="margin-top: 20px; text-align: center;color: gray;">
        <span>没有提醒~</span>
      </div>
      <panel-card :data-list="msgNotify.list" :type="15" v-show="tabIndex==0" @card-click="cardClick"></panel-card>
      <panel-card :data-list="notifyTemplate" :type="12" v-show="tabIndex==1" @card-click="cardClick"></panel-card>
      <panel-card :data-list="notifyTemplate" :type="13" v-show="tabIndex==2" @card-click="cardClick"></panel-card>
      <panel-card :data-list="notifyTemplate" :type="14" v-show="tabIndex==3" @card-click="cardClick"></panel-card>
    </div>
    <loading :show="isLoading && isLogin" text="加载中..."></loading>
    <actionsheet v-model="isShowActionSheet" :menus="actionSheetMenus" @on-click-menu="actionSheetClick" show-cancel></actionsheet>
  </div>
</template>
<script>
  import { XHeader, Loading, Tab, TabItem, Actionsheet } from 'vux'
  import { mapGetters } from 'vuex'
  import PanelCard from '../../../components/panel-card'

  const list = () => ['医生提醒', '复诊提醒', '用药提醒', '其他提醒']

  export default {
    components: {
      XHeader,
      Loading,
      Tab,
      TabItem,
      Actionsheet,
      PanelCard
    },
    computed: {
      ...mapGetters({
        isLoading: 'is_show_notify_loading',
        msgNotify: 'msgNotify'
      }),
      notifyTemplate () {
        let data = this.$store.getters.notifyTemplate
        let newData = data.slice()
        newData.forEach(function (r) {
          r['type_name'] = list()[parseInt(r.type) - 1]
        }, this)
        return newData
      }
    },
    data: function () {
      return {
        tabSelectItem: '医生提醒',
        tabList: list(),
        tabIndex: 0,
        isLogin: false,
        isShowActionSheet: false,
        actionSheetMenus: {
          menu1: '复诊提醒',
          menu2: '用药提醒',
          menu3: '其他提醒'
        }
      }
    },
    watch: {},
    methods: {
      tabClick (index) {
        this.tabIndex = index
        this.tabSelectItem = list()[index]
        window.sessionStorage.setItem('MY_REMIND_TAB_INDEX', JSON.stringify(index + 1))
        // 登录后才加载数据
        if (this.isLogin) {
          this.getData(index)
          this.$store.dispatch('updateNotifyLoading')
        }
      },
      /**
       * 选择对应的actionSheet
       */
      actionSheetClick (key) {
        if (key === 'menu1') {
          this.$router.push({name: 'EditReturnRemind'})
        } else if (key === 'menu2') {
          this.$router.push({name: 'EditMedicineRemind'})
        } else if (key === 'menu3') {
          this.$router.push({name: 'EditOtherRemind'})
        }
      },
      /**
       * 检查是否登录
       */
      checkLogin () {
        const _this = this
        if (this.isLogin) { // 已登录
          this.isShowActionSheet = true
        } else {
          this.$vux.alert.show({
            title: '提示',
            content: '您尚未登录, 请先登录再进行操作',
            onHide () {
              _this.$router.push({name: 'Login'})
            }
          })
        }
      },
      /**
       * 获取消息数据
       */
      getData (index = 0) {
        if (index === 0) {
          this.$store.dispatch('getMsgNotify', {
            'page_number': 1,
            'page_size': 100,
            'type': '1',
            'read_flag': ''
          })
        } else {
          this.$store.dispatch('findNotifyTemplate', {
            type: index + 1,
            valid: '1'
          })
        }
      },
      /**
       * 跳转到消息管理界面
       */
      cardClick (id) {
        if (this.tabIndex === 0) {
          this.$router.push({name: 'RemindDetail', params: {id: id}})
        } else {
          let type = (this.tabIndex + 1).toString()
          this.$router.push({name: 'RemindManager', query: {id: id, type: type}})
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        // tabBar选中的下标
        this.$store.dispatch('setTabIdx', 1)
        let tabIndex = 0
        // 获取之前的选择消息类型的tab位置, 如果有, 则选中对应的tab
        let index = JSON.parse(window.sessionStorage.getItem('MY_REMIND_TAB_INDEX'))

        // 选中上次选择的tab, (如: 当tab选中复诊提醒时, 点击新增了用药提醒, 新增完成后, 返回来, 仍然选中复诊提醒)
        if (index) {
          tabIndex = parseInt(index) - 1
          this.tabIndex = tabIndex
          this.tabSelectItem = list()[tabIndex]
        }

        // 已登录加载数据
        if (this.$auth.check()) {
          this.getData(tabIndex)
          this.isLogin = true
        } // 其他情况, 不加载数据
      })
    },
    destroyed () {
      // 返回首页, 则清除tabIndex信息
      if (this.$route.name === 'Home') {
        window.sessionStorage.removeItem('MY_REMIND_TAB_INDEX')
      }
      this.$store.dispatch('updateNotifyLoading')
    }
  }
</script>

<style lang="scss">
  .my-remind .app-content {
    margin-top: 46px;
  }

</style>

