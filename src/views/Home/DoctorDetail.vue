<template>
  <div class="doctor-main">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        医生主页
        <!--<i slot="right" @click="isShowPop = true" class="fa fa-qrcode" style="font-size:24px"></i>-->
      </x-header>
    </div>

    <div class="pad-content" style="margin-bottom: 49px">
      <div class="main">
        <div class="img-father">
          <img class="image" :src="imgServer + doc.picture">
        </div>
        <div class="base-info" style="width: 80%">
          <p><span class="name">{{ doc.name }}</span> {{ doc.position_name }}</p>
          <p>{{ doc.hos_name }}</p>
          <p>{{ doc.dept_name }}</p>
        </div>
        <div class="follow-button pull-right">
          <div v-show="isFavourite" @click="followClick">
            <img src="../../assets/image/followed.png" alt="" class="follow-image">
            <span class="follow-title">已收藏</span>
          </div>
          <div v-show="!isFavourite" @click="followClick">
            <img src="../../assets/image/follow-orange.png" alt="" class="follow-image">
            <span class="follow-title">收藏</span>
          </div>
        </div>
      </div>
      <div class="doc-introduce">
        <div class="doc-introduce-image">
          <img src="../../assets/image/address.png" alt="">
        </div>
        <div>
          <div class="doc-introduce-title">
            <h4>医院地址</h4>
          </div>
          <div class="doc-introduce-content">
            <p v-html="doc_hos.address"></p>
          </div>
        </div>
      </div>
      <div class="doc-introduce">
        <div class="doc-introduce-image">
          <img src="../../assets/image/good.png" alt="">
        </div>
        <div>
          <div class="doc-introduce-title">
            <h4>特长、擅长</h4>
          </div>
          <!--<div class="doc-introduce-content">-->
          <div class="doc-introduce-content" v-html="speciality"></div>
          <!--</div>-->
        </div>
      </div>
    </div>
    <div class="footer">
      <flexbox class="footer-box">
        <flexbox-item>
          <x-button type="primary" class="booking-btn" @click.native="jump2Booking">预约床位</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="warn" class="booking-btn" @click.native="jump2Service">在线咨询</x-button>
        </flexbox-item>
      </flexbox>
      <!--<x-button size="large" type="primary" class="booking-btn" @click.native="jump2Booking">预约床位</x-button>-->
      <!--<x-button size="large" type="warn" class="booking-btn" @click.native="jump2Service">在线咨询</x-button>-->
    </div>
    <x-dialog v-model="isShowPop" :hide-on-blur="true">
      <span class="vux-close" @click="isShowPop=false"></span>
      <img :src="imgServer + detail.qrCode" style="width: 100%;height:100%">
    </x-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { QUERY_NAME } from '../../config/Constant'
  import { XHeader, Tab, TabItem, XButton, XDialog, Flexbox, FlexboxItem } from 'vux'
  import { Favourite } from '../../api'
  import { RESULT_CODE } from '../../config/ResultCode'
  import HtmlCodeUtil from '../../utils/HtmlCodeUtil'

  export default {
    components: {XHeader, Tab, TabItem, XButton, XDialog, Flexbox, FlexboxItem},
    computed: {
      ...mapGetters({
        doc: 'doc_doctor',
        detail: 'doc_doc_detail',
        doc_dept: 'doc_doc_dept',
        doc_hos: 'doc_doc_hos',
        dept_docs: 'doc_same_level_docs',
        img_srv: 'img_server',
        pub_srv: 'pub_server'
      })
    },
    watch: {
      detail (val) {
        if (val.speciality) {
          this.speciality = HtmlCodeUtil.HTMLDecode(val.speciality)
        }
      }
    },
    data () {
      return {
        speciality: '',
        selected: '0',
        imgServer: '',
        isShowPop: false,
        isFavourite: false,
        favouriteID: 0,
        docId: 0,
        userInfo: {}
      }
    },
    methods: {
      jump2Booking () {
        this.$router.push({name: 'Booking', query: {id: this.doc.id, t: QUERY_NAME.DOCTOR}})
      },
      jump2Service () {
        if (this.doc_dept.homePageType === 2) {
          this.$router.push({path: '/special/consult-detail/' + this.doc.id + '/' + this.doc.name})
        } else {
          this.$vux.alert.show({
            title: '提示',
            content: '此功能暂未开通，敬请期待！'
          })
        }
      },
      followClick () {
        const _this = this
        if (this.userInfo.user_id) {
          if (this.isFavourite) {
            this.delFavourite()
          } else {
            this.addFavourite()
          }
        } else {
          this.$vux.alert.show({
            title: '提示',
            content: '您尚未登录, 请先登录再进行操作',
            onHide () {
              _this.$router.push({name: 'Login'})
            }
          })
        }
      },
      /**
       * 添加收藏
       */
      addFavourite () {
        Favourite.addFavouriteDoctor({
          favourite_id: this.doc.id
        }).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            if (res.data.data === '1') {
              this.checkIsFavourite()
              this.$vux.toast.show('收藏成功!')
            }
          }
        })
      },
      /**
       * 取消收藏
       */
      delFavourite () {
        Favourite.delFavouriteDoctor({
          id: this.favouriteID
        }).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            if (res.data.data === '操作成功') {
              this.isFavourite = false
            }
          }
        })
      },
      /**
       * 检查是否收藏
       */
      checkIsFavourite () {
        if (this.userInfo.user_id) {
          Favourite.checkIsFavourite({
            favourite_id: this.docId,
            favourite_type: 0
          }).then(res => {
            if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
              let data = res.data.data
              if (data && data.result_code === 1) {
                this.isFavourite = true
                this.favouriteID = data.id
              } else {
                this.isFavourite = false
                this.favouriteID = 0
              }
            }
          })
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.userInfo = this.$auth.user()
        this.docId = this.$route.params.docId
        this.$store.dispatch('getDoctor', this.docId)
        this.checkIsFavourite()
        this.imgServer = this.$store.state.imgServer
      })
    }
  }
</script>
<style lang="scss">
  @import "style/doctor-detail.scss";
</style>
