<template>
  <div class="my-insu-list">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">我的保单</x-header>
      <tab>
        <tab-item v-for="(item, idx) in tabTitle" :selected="idx==tabIdx?true:false" @on-item-click="onItemClick(idx)" :key="idx">{{item}}</tab-item>
      </tab>
    </div>
    <div class="app-content"
         v-infinite-scroll="loadMore"
         :infinite-scroll-disabled="isLoadInsur"
         infinite-scroll-distance="100">
      <insurance-card :type="2" :data-list="insurOrderList"></insurance-card>
      <p style="text-align: center;margin-top: 20px;" v-if="!isLoadInsur&&insurOrderList.length==0">无数据</p>
    </div>
    <loading v-model="isLoadInsur" text="加载中..."></loading>

  </div>
</template>
<script>
  import {XHeader, Tab, TabItem, Loading} from 'vux'
  import InsuranceCard from 'components/Insurance-Card'
  export default {
    components: {
      XHeader, Tab, TabItem, InsuranceCard, Loading
    },
    computed: {
      insurOrders () {
        return this.$store.getters.insurOrders
      },
      isLoadInsur () {
        return this.$store.getters.isLoadInsur
      }
    },
    watch: {
      insurOrders (val) {
        if (this.pageNum === 1) {
          this.insurOrderList = []
        }
        if (val) {
          this.insurOrderList = this.insurOrderList.concat(val.list)
        }
      }
    },
    data () {
      return {
        tabTitle: ['全部', '待付款', '保障中', '已失效'],
        tabIdx: 0,
        pageNum: 1,
        pageSize: 10,
        insurOrderList: []
      }
    },
    methods: {
      loadMore () {
        // 一进来页面就会调用该方法，第一次进来不应该加载数据
        if (!this.insurOrders) {
          return
        }
        if (!this.insurOrders.last_page) {
          this.pageNum++
          this.getData()
        }
      },
      onItemClick (idx) {
        this.tabIdx = idx
        this.getData()
      },
      getData () {
        let state = 0
        let data
        if (Number(this.tabIdx) === 0) {
          data = {
            page_number: this.pageNum,
            page_size: this.pageSize
          }
        } else {
          if (Number(this.tabIdx) === 1) {
            state = 0 // 未支付
          } else if (Number(this.tabIdx) === 2) {
            state = 6 // 保障中
          } else if (Number(this.tabIdx) === 3) {
            state = 99 // 已失效
          }
          data = {
            state: state,
            page_number: this.pageNum,
            page_size: this.pageSize
          }
        }
        this.$store.dispatch('getInsurOrders', data)
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getData()
        let pageParams = {
          browser_type: 'h5',
          page_name: 'h5患者端保单列表',
          req_url: this.$route.path,
          terminal_type: 'user'
        }
        this.$store.dispatch('pageStatis', pageParams)
      })
    }
  }
</script>
<style lang="scss">
  @import "style/my_insur_list.scss";
</style>
