<template>
  <div class="home">
    <search-form :location="location" :left-options="{showBack: true}" @do-search="changeShow" style="position: fixed; top: 0px;"></search-form>
    <!--<a class="left" style="float: left" @click="back"></a>-->
    <div class="pad-content" style="padding-bottom: 10px">
      <panel-card :data-list="recomdDept.list" :type="1" v-show="showRecommend" title="推荐科室："></panel-card>
      <div v-show="!showRecommend">
        <panel-card :data-list="doSearch.hospital" :type="4" :is-show-more="isMoreHos" title="相关医院："></panel-card>
        <panel-card :data-list="doSearch.department" :type="3" :is-show-more="isMoreDept" title="相关科室："></panel-card>
        <panel-card :data-list="doSearch.doctor" :type="2" :is-show-more="isMoreDoc" title="相关医生："></panel-card>
        <div v-show="doSearch.doctor.length===0 && doSearch.department.length===0 && doSearch.hospital.length===0">
          <p class="empty"><i class="fa fa-frown-o" style="font-size:20px;margin-right:4px"></i>没有搜索到相关内容</p>
          <x-button type="primary" size="large" @click.native="recomDept" class="check-btn" style="font-size: 16px">查看推荐科室</x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import PanelCard from '../../components/panel-card'
  import SearchForm from '../../components/search/SearchForm.vue'
  import { XButton } from 'vux'
  import {SESSION_DATA} from '../../config/sessionStorage'
  export default {
    components: {
      PanelCard,
      SearchForm,
      XButton
    },
    data () {
      return {
        isMoreDoc: true,
        isMoreDept: true,
        isMoreHos: true,
        type1: 1,
        showRecommend: false,
        searchValue: '',
        location: {value: 0, name: '全国'}
      }
    },
    methods: {
      changeShow () {
        this.showRecommend = false
      },
      recomDept () {
        this.showRecommend = true
        let datas = {
          pageSize: 5,
          pageNumber: 1
        }
        this.$store.dispatch('getRecommendDepartment', datas)
      },
      booking () {
        this.$router.push({path: '/booking'})
      },
      back () {
        window.history.back()
        window.sessionStorage.removeItem(SESSION_DATA.SWITCH_CITY)
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        let temp = window.sessionStorage.getItem(SESSION_DATA.SWITCH_CITY)
        if (temp) {
          this.location = JSON.parse(temp)
        }
        // tabbar选中的下标
        this.$store.dispatch('setTabIdx', 0)
        this.searchValue = window.sessionStorage.getItem(SESSION_DATA.SEARCH_VALUE) || ''
      })
    },
    computed: {
      recomdDept () {
        return this.$store.getters.getRecommendDepartmentData
      },
      doSearch () {
        let retData = this.$store.getters.results
        if (retData.doctor.length < 3) {
          this.isMoreDoc = false
        } else {
          this.isMoreDoc = true
        }
        if (retData.department.length < 3) {
          this.isMoreDept = false
        } else {
          this.isMoreDept = true
        }
        if (retData.hospital.length < 3) {
          this.isMoreHos = false
        } else {
          this.isMoreHos = true
        }
        return retData
      }
    }
  }
</script>
<style lang="scss">
 @import "style/home.scss";
</style>
