<template>
  <div class="health-records">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        健康档案
        <router-link slot="right" to="/user/case-his/new-case/0" style="text-decoration: none">新建档案</router-link>
      </x-header>
    </div>
    <div class="app-content">
      <div class="header_view">
        <img class="image" :src="$store.state.imgServer + userInfo.user_pic"
             style="width: 60px; height: 60px">
        <div class="header_content" style="margin-left: 10px">
          <span class="name" style="font-size: 20px">{{userInfo.user_name}}</span>
          <span class="name">{{userInfo.born_date}}</span>
          <span class="name" style="margin-left: 5px" v-if="userInfo.gender==0">女</span>
          <span class="name" style="margin-left: 5px" v-if="userInfo.gender==1">男</span>
        </div>
      </div>
      <group>
        <cell title="基础健康信息" is-link link="/user/case-his/case-info"></cell>
      </group>
      <panel-card :data-list="caseList" :type="8"></panel-card>
    </div>
  </div>
</template>
<script>
  import {XHeader, XButton, Group, Cell} from 'vux'
  import PanelCard from '../../../../components/panel-card'
  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      PanelCard
    },
    computed: {
      caseList () {
        let temp = this.$store.getters.caseList
        return temp
      }
    },
    data () {
      return {
        type: 0,
        userInfo: {}
      }
    },
    methods: {},
    mounted: function () {
      this.$nextTick(function () {
        this.$store.dispatch('getCaseList', 0)
        this.userInfo = this.$auth.user()
      })
    }
  }
</script>
<style>
  @import "style/healthRecords.scss";
</style>
