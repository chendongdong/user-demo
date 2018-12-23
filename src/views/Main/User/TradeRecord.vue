<template>
  <div id="balance-history">
    <div class="app-header">
      <x-header>收支记录</x-header>
    </div>
    <div class="content" style="margin-top: 45px;padding: 5px;">
      <!--<scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" height="-60" ref="scroller" @on-pullup-loading="loadData">-->
        <!--<div>-->
          <panel-card :data-list="tradeRecordInfo.list" :type="9"></panel-card>
        <!--</div>-->
      <!--</scroller>-->
    </div>
  </div>
</template>
<script>
  import { Group, Cell, XInput, XHeader, LoadMore, Scroller } from 'vux'
  import PanelCard from '../../../components/panel-card'
  import { mapGetters } from 'vuex'

  export default {
    components: {Group, Cell, XInput, XHeader, PanelCard, LoadMore, Scroller},
    computed: {
      ...mapGetters({
        tradeRecordInfo: 'tradeRecordInfo'
      })
    },
    data: function () {
      return {
//        tip: '正在加载',
//        showLoadMore: false,
        pageNum: 1,
        pageSize: 100
//        pullupConfig: {
//          content: '上拉加载更多',
//          downContent: '松开进行加载',
//          upContent: '上拉加载更多',
//          loadingContent: '加载中...'
//        }
      }
    },
    watch: {
//      tradeRecordInfo (info) {
//        this.$nextTick(function () {
//          this.$refs.scroller.donePullup()
//          this.$refs.scroller.reset()
//          if (info.total_page === this.pageNum) {
//            this.$refs.scroller.disablePullup()
//          }
//        })
//      }
    },
    methods: {
//      loadData () {
//        if (this.pageNum < this.tradeRecordInfo.total_page) {
//          this.pageNum++
//        }
//        this.$store.dispatch('getTradeRecord', {
//          page_number: this.pageNum,
//          page_size: this.pageSize
//        })
//      }
    },
    beforeMount () {
      this.$nextTick(function () {
        this.$store.dispatch('clearTradeData')
        this.$store.dispatch('getTradeRecord', {
          page_number: this.pageNum,
          page_size: this.pageSize
        })
      })
    }
  }
</script>

<style lang="scss">
  /*@import 'styles/'*/
</style>

