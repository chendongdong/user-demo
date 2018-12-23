<template>
  <div class="day-ward">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">日间病房预约</x-header>
    </div>
    <div class="pad-content">
      <p class="item">
        科室：
        <span class="dept-name">产科</span>
      </p>
      <p class="item border">
        预约项目：
        <span class="bokng-type">日间病房</span>
      </p>
      <span>预约事项：</span>
      <checker
        style="margin-top: 10px"
        v-model="typeName"
        default-item-class="demo5-item"
        selected-item-class="demo5-item-selected">
        <checker-item v-for="i in types" :key="i" :value="i">{{i}}</checker-item>
      </checker>
      <group title="请选择人流方式：" v-show="typeName=='人流'">
        <checklist :options="commonList" v-model="radioValue" :max="1" @on-change="change"></checklist>
      </group>
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
  import {XHeader, Checker, CheckerItem, Group, Checklist, Tab, TabItem, XTable, XButton} from 'vux'
  import WeekTable from 'components/week-table'
  export default {
    components: {
      XHeader, Checker, CheckerItem, Group, Checklist, Tab, TabItem, XTable, XButton, WeekTable
    },
    data () {
      return {
        types: ['人流', '药流'],
        typeName: '人流',
        commonList: ['无痛（推荐）', '普通（微痛）'],
        radioValue: ['无痛（推荐）'],
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
