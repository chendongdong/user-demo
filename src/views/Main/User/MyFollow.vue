<template>
  <div class="my-reminder">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">我的收藏</x-header>
      <tab :line-width=2 active-color='#68C84F' style="position: fixed;width: 100%;">
        <tab-item class="vux-center"
                  :selected="tabSelectItem === item"
                  v-for="(item, index) in tabList"
                  @click.native="tabClick(index)"
                  :key="index">{{item}}
        </tab-item>
      </tab>
    </div>
    <div class="app-content">
      <loading :show="isLoading" text="加载中..."></loading>
      <doctor-list-card
          class="content-card"
          :data-list="docs"
          v-show="tabIndex==0"
          @card-click="cardClick"
          @follow-click="followClick"
          @book-click="bookClick"></doctor-list-card>
      <group>
        <cell class="follow-cell"
              v-for="item in arts"
              :key="item.id"
              :title="'• ' + item.articleName"
              @click.native="onArtClick(item.id)"
              v-show="tabIndex==1"></cell>
      </group>

    </div>
  </div>
</template>
<script>
  import { Swiper, XHeader, Tab, TabItem, SwiperItem, Cell, Group, Loading } from 'vux'
  import { mapGetters } from 'vuex'
  import DoctorListCard from './component/DoctorListCard'
  import { Favourite } from '../../../api'
  import { RESULT_CODE } from '../../../config/ResultCode'

  const list = () => ['我收藏的医生', '我收藏的文章']

  export default {
    components: {
      XHeader,
      Swiper,
      DoctorListCard,
      Tab,
      TabItem,
      SwiperItem,
      Cell,
      Group,
      Loading
    },
    computed: {
      ...mapGetters({
        isLoading: 'is_show_favourite_loading',
        arts: 'favouriteList',
        docs: 'favouriteList'
      })
    },
    data: function () {
      return {
        tabSelectItem: '我收藏的医生',
        tabList: list(),
        tabIndex: 0
      }
    },
    watch: {},
    methods: {
      tabClick (index) {
        this.tabIndex = index
        this.tabSelectItem = list[index]
        this.loadData()
        this.$store.dispatch('cleanFavouriteData')
        this.$store.dispatch('updateFavouriteLoading')
      },
      onArtClick (id) {
        this.$router.push({name: 'ArticleDetail', params: {id: id}})
      },
      cardClick (id) {
        this.$router.push({name: 'DocDetail', params: {docId: id}})
      },
      followClick (id) {
        const _this = this
        let favoId = null
        this.docs.forEach(function (d) {
          if (d.id === id) {
            favoId = d.follow_id
          }
        })
        if (favoId) {
          this.$vux.confirm.show({
            title: '提示',
            content: '需要取消收藏该医生吗?',
            onConfirm () {
              Favourite.delFavouriteDoctor({
                id: favoId
              }).then(res => {
                if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
                  if (res.data.data === '操作成功') {
                    _this.loadData()
                    _this.$vux.alert.show({
                      title: '提示',
                      content: '取消收藏成功!'
                    })
                  }
                }
              })
            }
          })
        }
      },
      bookClick (id) {
        this.$router.push({name: 'Booking', query: {t: 'doctor', id: id}})
      },
      loadData () {
        let id = this.tabIndex === 0 ? '0' : '1' // 0: 医生 1: 文章
        this.$store.dispatch('getFavouriteList', {'favourite_type': id})
      }
    },
    beforeMount () {
      this.$nextTick(function () {
        this.loadData()
      })
    },
    destroyed () {
      this.$store.dispatch('updateFavouriteLoading')
    }
  }
</script>

<style lang="scss">
  /*@import 'style/insuranceList.scss';*/
  .my-reminder .app-content {
    padding-top: 90px;
  }

  .my-reminder .app-content .content-card {
    margin: 8px 0;
  }

  .my-reminder .app-content .vux-no-group-title {
    margin-top: 8px;
  }

  .my-reminder .app-content .follow-cell {
    font-size: 14px;
  }
</style>




