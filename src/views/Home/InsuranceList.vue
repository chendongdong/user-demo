<template>
  <div class="insurance-list">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">保险在线</x-header>
    </div>
    <div class="app-content"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="isLoadInsur"
         infinite-scroll-distance="100">
      <div>
        <insurance-card :data-list="insurList" style="padding-top: 2px"></insurance-card>
      </div>
    </div>
  </div>
</template>
<script>
  import { Swiper, XHeader } from 'vux'
  import { mapGetters } from 'vuex'
  import InsuranceCard from '../../components/Insurance-Card'

  export default {
    components: {
      XHeader,
      Swiper,
      InsuranceCard
    },
    computed: {
      ...mapGetters([
        'insurCategorys',
        'isLoadInsur'
      ])
    },
    data: function () {
      return {
        pageNum: 1,
        pageSize: 10,
        insurList: [],
        isFirst: true
      }
    },
    watch: {
      insurCategorys (val) {
        if (this.pageNum === 1) {
          this.insurList = []
        }
        this.insurList = this.insurList.concat(val.list)
      }
    },
    methods: {
      getData () {
        let data = {
          page_number: this.pageNum,
          page_size: this.pageSize
        }
        this.$store.dispatch('getInsurCate', data)
      },
      loadMore () {
        if (this.isFirst) {
          this.isFirst = false
          return
        }
        if (this.insurCategorys && !this.insurCategorys.last_page) {
          this.pageNum++
          this.getData()
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getData()
        let pageParams = {
          browser_type: 'h5',
          page_name: 'h5患者端-保险种类列表',
          req_url: this.$route.path,
          terminal_type: 'user'
        }
        this.$store.dispatch('pageStatis', pageParams)
      })
    }
  }
</script>

<style lang="scss">
  @import 'style/insuranceList.scss';
</style>



