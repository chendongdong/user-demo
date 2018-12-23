<template>
  <div class="search-more">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        {{searchTitle}}
      </x-header>
    </div>
    <div
      class="pad-content"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="100">
      <panel-card :data-list="doMoreCopy.hospital" :type="4" v-show="type===3||type===4" :is-more="true"></panel-card>
      <panel-card :data-list="doMoreCopy.department" :type="3" v-show="type===2" :is-more="true"></panel-card>
      <panel-card :data-list="doMoreCopy.doctor" :type="2" v-show="type===1" :is-more="true"></panel-card>
      <loading v-model="loading" text="加载中..."></loading>
    </div>
    <load-more v-show="showHint" :show-loading="false" background-color="#fbf9fe" tip="没有更多数据了"></load-more>
    <div style="display: none">{{doMoreSearch}}</div>
    </div>
</template>
<script>
  import PanelCard from '../../components/panel-card'
  import {SESSION_DATA} from '../../config/sessionStorage'
  import {XHeader, Loading, LoadMore} from 'vux'
  export default{
    components: {
      PanelCard,
      XHeader,
      Loading,
      LoadMore
    },
    computed: {
      doMoreSearch () {
        return this.$store.getters.results
      }
    },
    watch: {
      doMoreSearch (val) {
        if (this.pageStart === 0) {
          this.doMoreCopy = {
            doctor: [],
            department: [],
            hospital: []
          }
        }
        if (this.type === 1) {
          this.doMoreCopy.doctor = this.doMoreCopy.doctor.concat(val.doctor)
        } else if (this.type === 2) {
          this.doMoreCopy.department = this.doMoreCopy.department.concat(val.department)
        } else {
          this.doMoreCopy.hospital = this.doMoreCopy.hospital.concat(val.hospital)
        }
        this.loading = false
      }
    },
    data () {
      return {
        showHint: false,
        searchTitle: '查看更多',
        type: 0,
        searchType: '',
        loading: false,
        list: ['1'],
        doMoreCopy: {
          doctor: [],
          department: [],
          hospital: []
        },
        searchText: '',
        pageStart: 0,
        isMore: true,
        location: null,
        pageSize: 10,
        isFirst: true
      }
    },
    methods: {
      searchData () {
        this.loading = true
        let payload = null
        if (this.location && this.location.value > 0) {
          payload = {
            q: this.searchText,
            start: this.pageStart,
            size: this.pageSize,
            type: this.searchType,
            city_id: this.location.value
          }
        } else {
          payload = {
            q: this.searchText,
            start: this.pageStart,
            size: this.pageSize,
            type: this.searchType
          }
        }
        this.$store.dispatch('doSearch', payload)
      },
      loadMore () {
        if (this.isFirst) {
          this.isFirst = false
          return
        }
        if (this.type === 1) {
          if (this.doMoreSearch.total_doctor && this.doMoreSearch.total_doctor > this.pageStart) {
            this.pageStart = this.pageStart + this.pageSize
            this.searchData()
          } else {
            this.showHint = true
          }
        }
        if (this.type === 2) {
          if (this.doMoreSearch.total_dept && this.doMoreSearch.total_dept > this.pageStart) {
            this.pageStart = this.pageStart + this.pageSize
            this.searchData()
          } else {
            this.showHint = true
          }
        }
        if (this.type === 3 || this.type === 4) {
          if (this.doMoreSearch.total_hospital && this.doMoreSearch.total_hospital > this.pageStart) {
            this.pageStart = this.pageStart + this.pageSize
            this.searchData()
          } else {
            this.showHint = true
          }
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.type = Number(this.$route.params.type)
        if (this.type === 1) {
          this.searchTitle = '相关医生'
          this.searchType = 'doctor'
        } else if (this.type === 2) {
          this.searchTitle = '相关科室'
          this.searchType = 'department'
        } else if (this.type === 3 || this.type === 4) {
          this.searchTitle = '相关医院'
          this.searchType = 'hospital'
        }
        if (this.type === 4) {
          this.location = JSON.parse(window.sessionStorage.getItem(SESSION_DATA.SET_CITY))
        } else {
          this.location = JSON.parse(window.sessionStorage.getItem(SESSION_DATA.SWITCH_CITY))
        }
        this.pageStart = 0
        this.searchText = window.sessionStorage.getItem(SESSION_DATA.SEARCH_VALUE) || ''
        this.searchData()
      })
    }
  }
</script>
<style lang="scss">
.search-more {
  .page-infinite-loading {
    text-align: center;
    height: 50px;
    line-height: 50px;
    div {
      display: inline-block;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
}
</style>
