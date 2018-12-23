<template>
  <div class="day-ward">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">新生儿游泳</x-header>
    </div>
    <div class="pad-content">
      <p class="item">
        科室：
        <span class="dept-name">产科</span>
      </p>
      <p class="item border">
        预约项目：
        <span class="bokng-type">新生儿游泳</span>
      </p>
      <span class="time-title">预约时间段：</span>
      <!--<tab :line-width=2 active-color='#68C84F' v-model="tabIndex">-->
      <!--<tab-item class="vux-center" :selected="tabSelectItem === item" v-for="(item, index) in tabList"-->
      <!--@on-item-click="tabItemClick(index)" :key="index">{{item}}-->
      <!--</tab-item>-->
      <!--</tab>-->
      <week-table></week-table>
    </div>
  </div>
</template>
<script>
  import {XHeader} from 'vux'
  import WeekTable from 'components/week-table'
  export default {
    components: {
      XHeader, WeekTable
    },
    data () {
      return {
        tabList: ['最近第一周', '最近第二周'],
        tabSelectItem: '最近第一周',
        tabIndex: 0,
        times: [],
        currentFirstDate: ''
      }
    },
    methods: {
      change () {

      },
      tabItemClick (idx) {
        this.tabSelectItem = this.tabList[idx]
      }
    },
    mounted () {
      this.$nextTick(function () {

      })
    }
  }
</script>
<style lang="scss">
  @import "style/day_ward.scss";
</style>
