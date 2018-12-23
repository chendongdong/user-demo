<template>
  <div class="my-booking">
    <div class="app-header">
      <x-header :left-options="{showBack: false}">就诊记录
        <a slot="left" class="vux-header-back" @click="$router.push({name: 'User'})">返回</a>
      </x-header>
      <tab :line-width=2 active-color='#68C84F' v-model="tabIndex">
        <tab-item class="vux-center" :selected="tabSelectItem === item" v-for="(item, index) in tabList" @on-item-click="tabItemClick(index)" :key="index">{{item}}</tab-item>
      </tab>
    </div>
    <div class="app-content" style="padding-top: 90px">
      <panel-card :data-list="bookingList" :type="6" v-if="tabIndex==0"></panel-card>
      <panel-card :data-list="transList" :type="7"  v-if="tabIndex==1"></panel-card>
    </div>
    <load-more v-if="tabIndex==0" :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-show="!isLoadOrder&&bookingList.length==0"></load-more>
    <load-more v-if="tabIndex==1" :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-show="!isLoadTran&&transList.length==0"></load-more>
  </div>
</template>
<script>
  import {XHeader, Tab, TabItem, LoadMore} from 'vux'
  import PanelCard from '../../../components/panel-card'
  import CloneData from '../../../utils/CloneData'
  const list = () => ['约床记录', '转诊记录']

  export default {
    components: {
      XHeader,
      PanelCard,
      Tab,
      TabItem,
      LoadMore
    },
    computed: {
      bookingData () {
        return this.$store.getters.bookingList
      },
      transList () {
        return this.$store.getters.transList
      },
      isLoadOrder () {
        return this.$store.getters.isLoadOrder
      },
      isLoadTran () {
        return this.$store.getters.isLoadTran
      }
    },
    watch: {
      bookingData (val) {
        this.bookingList = []
        if (val.length > 0) {
          CloneData.extend(this.bookingList, val)
          this.bookingList = this.bookingList.reverse()
        }
      }
    },
    data () {
      return {
        tabList: list(),
        tabSelectItem: '约床记录',
        tabIndex: 0,
        bookingList: []
      }
    },
    methods: {
      tabItemClick (idx) {
        this.tabSelectItem = this.tabList[idx]
        if (idx === 0) {
          this.$store.dispatch('getBookingList', {})
        } else {
          this.$store.dispatch('getTransList', {})
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.$store.dispatch('getBookingList', {})
      })
    }
  }
</script>
<style lang="scss">
  .my-booking{

  }
</style>

