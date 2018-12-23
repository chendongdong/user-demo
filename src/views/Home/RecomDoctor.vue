<template>
  <div class="search-more">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">{{isHosDocs ? '全部医生' : '推荐医生'}}</x-header>
    </div>
    <div class="pad-content"
         v-infinite-scroll="loadMore"
         :infinite-scroll-disabled="isHosDocs || isLoadingHome"
         infinite-scroll-distance="100">
      <panel-card :data-list="isHosDocs ? hosDoctors : doctorList" :type="10"></panel-card>
      <loading v-model="isLoadingHome" text="加载中..."></loading>
    </div>
    <load-more v-show="showHint" v-if="!isHosDocs" :show-loading="false" background-color="#fbf9fe" tip="没有更多数据了"></load-more>
    <div style="display: none">{{recomDocs}}</div>
  </div>
</template>
<script>
  import PanelCard from '../../components/panel-card'
  import { XHeader, Loading, LoadMore } from 'vux'
  import CloneData from '../../utils/CloneData'
  export default {
    components: {
      PanelCard,
      XHeader,
      Loading,
      LoadMore
    },
    computed: {
      recomDocs () {
        return this.$store.getters.recomDocs
      },
      isLoadingHome () {
        return this.$store.getters.isLoadingHome
      },
      hosDoctors () {
        let docs = this.$store.getters.hos_doctor_list.slice()
        let newDocs = []
        docs.forEach(function (d) {
          newDocs.push({
            picture: d.doctor.picture,
            id: d.doctor.id,
            name: d.doctor.name,
            dept_name: d.doctor.dept_name,
            hos_name: d.doctor.hos_name
          })
        })
        return newDocs
      }
    },
    watch: {
      recomDocs (val) {
        if (val && val.list.length > 0) {
          if (this.pageNum === 1) {
            this.doctorList = []
          }
          let temp = []
          CloneData.extend(temp, val.list)
          this.doctorList = this.doctorList.concat(temp)
        }
      }
    },
    data () {
      return {
        pageNum: 1,
        pageSize: 10,
        showHint: false,
        isHosDocs: false,
        doctorList: [],
        isFirst: true
      }
    },
    methods: {
      loadMore () {
          // 一进来页面就会调用该方法，第一次进来不应该加载数据
        if (this.isFirst || this.isHosDocs) {
          this.isFirst = false
          return
        }
        if (this.recomDocs.last_page) {
          this.showHint = true
        } else {
          this.pageNum++
          this.$store.dispatch('getRecomDoc', {page_number: this.pageNum, page_size: this.pageSize})
        }
      },
      loadData () {
        let query = this.$route.query
        if (query && query.type && query.type === 'hos') { // 医院医生
          let hosId = this.$route.query.id
          this.isHosDocs = true
          this.$store.dispatch('getHospital', hosId)
        } else { // 首页推荐医生
          this.$store.dispatch('getRecomDoc', {page_number: this.pageNum, page_size: this.pageSize})
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.loadData()
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
