<template>
  <div class="article-detail">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">小贴士</x-header>
    </div>

    <!--app-header：是公用的样式，设置标题栏固定在顶部，页面内容滚动时不会出现同时滚动，-->
    <!--app-content：与app-header配套使用，设置padding-top的距离-->
    <div class="app-content">
      <loading :show="isLoading" text="加载中..."></loading>
      <div class="article-header">
        <span class="title">{{articleInfo.article_name}}</span>
      </div>
      <div class="public-time">
        <p class="time" v-show="articleInfo.publish_time">发表时间：{{articleInfo.publish_time}}</p>
        <img src="~assets/image/followed.png" v-show="isFavourite" @click="followClick">
        <img src="~assets/image/follow-orange.png" v-show="!isFavourite" @click="followClick">
      </div>
      <div v-html="articleInfo.article_info" class="article-content" style="padding-left: 10px;padding-right: 10px"></div>
      <div class="comments"
           v-infinite-scroll="loadMore"
           infinite-scroll-distance="100">
        <p class="time">最新评论：<span class="more" v-if="articleInfo.comments_cnt>1"></span></p>
        <div class="com-flex" v-for="item in newComment">
          <div class="image-head">
            <img :src="$store.state.imgServer + item.user_picture" class="image-head">
          </div>
          <div class="com-text">
            <p>{{item.user_name}}</p>
            <p style="color: #666">{{item.content}}</p>
            <p style="font-size: 12px">{{item.created}}
              <span style="color: #68C84F;float: right" @click="favorComment(item.id)">
                <i class="fa fa-thumbs-o-up"></i>
                <span style="font-size: 14px;">{{item.thumb_cnt}}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
       <img src="~assets/ic_top.png" class="to-top" @click="toTop" id="top_div">
      <div class="msg-input">
        <textarea id="textarea" v-model="commentContent"></textarea>
        <x-button mini type="primary" style="margin-right: 10px;height: 28px" @click.native="sendComent">发表</x-button>
        <p class="favor">
          <span  @click="favorArticle">
            <i class="fa fa-thumbs-up" v-if="isFavor"></i>
            <i class="fa fa-thumbs-o-up" v-else></i>
            <span style="font-size: 14px">{{articleInfo.thumb_cnt}}</span>
          </span>
        </p>
      </div>
    </div>

    <toast v-model="showMsg" type="text">{{hintText}}</toast>
    <div style="display: none">{{commentMsg}}</div>
  </div>
</template>
<script>
  import { XHeader, Loading, XInput, Toast, XButton } from 'vux'
  import { Favourite } from '../../../api'
  import { RESULT_CODE } from '../../../config/ResultCode'
  import TAUtils from '../../../utils/textareaUtil'

  export default {
    components: {
      XHeader, Loading, XInput, Toast, XButton
    },
    computed: {
      articleInfo () {
        this.isLoading = false
        return this.$store.getters.articleInfo
      },
      commentMsg () {
        return this.$store.getters.commentMsg
      },
      favorComMsg () {
        return this.$store.getters.favorComMsg
      },
      commentList () {
        return this.$store.getters.commentList
      },
      articleMsg () {
        return this.$store.getters.articleMsg
      }
    },
    watch: {
      commentMsg (data) {
        if (data === '') return
        if (data === 1) {
          this.pageNum = 1
          this.getComList()
        } else if (data === -1) {
        } else {
          this.showMsg = true
          this.hintText = '操作失败'
        }
        this.$store.dispatch('clearCommentMsg')
      },
      favorComMsg (data) {
        if (data === '') return
        if (data === 1) {
          this.pageNum = 1
          this.getComList()
        } else if (data === -1) {
          this.showMsg = true
          this.hintText = '已赞'
        } else {
          this.showMsg = true
          this.hintText = '操作失败'
        }
        this.$store.dispatch('clearCommentMsg')
      },
      articleMsg (data) {
        if (data === '') return
        if (data === 1) {
          this.getData()
        } else if (data === -1) {
          this.showMsg = true
          this.hintText = '已赞'
        } else {
          this.showMsg = true
          this.hintText = '操作失败'
        }
        this.$store.dispatch('clearArticleMsg')
      },
      commentList (val) {
        if (this.pageNum === 1) {
          this.newComment = []
        }
        if (val && val.list.length > 0) {
          this.newComment = this.newComment.concat(val.list)
        }
      }
    },
    data () {
      return {
        state_10: [
          {
            label: '疾病情况',
            prop: 'illness'
          },
          {
            label: '申请日期',
            prop: 'apply_date'
          },
          {
            label: '期望入院日期',
            prop: 'expect_checkin_date'
          }
        ],
        state1: [
          {
            label: '分配入住日期',
            prop: 'assign_checkin_date'
          },
          {
            label: '预分配床位',
            prop: 'bed_number'
          },
          {
            label: '短信过期时间',
            prop: 'sms_invalid_times'
          }
        ],
        state2: [
          {
            label: '分配入住日期',
            prop: 'assign_checkin_date'
          },
          {
            label: '预分配床位',
            prop: 'bed_number'
          }
        ],
        isFirst: true,
        pageNum: 1,
        pageSize: 10,
        hintText: '',
        isFavor: false,
        newComment: [],
        showMsg: false,
        isFavourite: false,
        favouriteId: '',
        artId: '',
        isLoading: true,
        isFollowEnable: false,
        commentContent: ''
      }
    },
    methods: {
      toTop () {
        let h = document.documentElement.scrollTop || document.body.scrollTop
        let t = 0
        let count = 50
        let inter = setInterval(function () {
          if (count > 20) {
            count -= 2
          } else if (count > 0) {
            count--
          } else {
            clearInterval(inter)
          }
          t = count * h / 50
          window.scrollTo(0, t)
        }, 0.1)
      },
      followClick () {
        if (!this.checkLogin()) return
        if (this.isFollowEnable) {
          if (this.isFavourite) {
            this.delFavourite()
          } else {
            this.addFavourite()
          }
        }
      },
      /**
       * 添加收藏
       */
      addFavourite () {
        Favourite.addFavouriteArticle({
          favourite_id: this.artId
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
          id: this.favouriteId
        }).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            if (res.data.data === '操作成功') {
              this.isFavourite = false
              this.$vux.toast.show('取消收藏成功!')
            }
          }
        })
      },
      /**
       * 检查是否收藏
       */
      checkIsFavourite () {
        this.isFollowEnable = false
        if (this.$auth.check()) {
          Favourite.checkIsFavourite({
            favourite_id: this.artId,
            favourite_type: 1
          }).then(res => {
            if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
              let data = res.data.data
              this.isFollowEnable = true
              if (data && data.result_code === 1) {
                this.isFavourite = true
                this.favouriteId = data.id
              } else {
                this.isFavourite = false
                this.favouriteId = 0
              }
            }
          })
        }
      },
      getData () {
        this.isLoading = true
        if (this.artId) {
          this.checkIsFavourite()
          this.$store.dispatch('getArticleInfo', this.artId)
        } else {
          this.$store.dispatch('getArticleInfo', 1)
        }
      },
      // 发表评论
      sendComent () {
        if (!this.checkLogin()) return
        if (this.commentContent) {
          let temp = {
            content: this.commentContent,
            ref_id: this.artId,
            type: 'article'
          }
          this.$store.dispatch('commentsDo', temp)
          this.commentContent = ''
        } else {
          this.showMsg = true
          this.hintText = '不能发送空白消息'
        }
      },
      // 评论点赞
      favorComment (id) {
        if (!this.checkLogin()) return
        let temp = {
          id: id,
          ref_id: this.artId,
          type: 'article'
        }
        this.$store.dispatch('commentsFavor', temp)
      },
      // 文章点赞
      favorArticle () {
        if (!this.checkLogin()) return
        if (this.isFavor) {
          this.hintText = '已赞'
          this.showMsg = true
        } else {
          this.$store.dispatch('articleFavor', this.artId)
        }
      },
      // 获取评论列表
      getComList () {
        let temp = {
          ref_id: this.artId,
          type: 'article',
          page_size: this.pageSize,
          page_number: this.pageNum
        }
        this.$store.dispatch('getComments', temp)
      },
      // 加载更多评论
      loadMore () {
        if (this.isFirst) {
          this.isFirst = false
          return
        }
        if (this.commentList.last_page === false) {
          this.pageNum++
          this.getComList()
        }
      },
      // 检测是否登录
      checkLogin () {
        if (!this.$auth.check()) {
          let _this = this
          this.$vux.alert.show({
            title: '提示',
            content: '您尚未登录, 请先登录再进行操作',
            onHide () {
              _this.$router.push({name: 'Login'})
            }
          })
          return false
        }
        return true
      }
    },
    mounted: function () {
      this.$store.dispatch('clearArticlesData')
      this.artId = this.$route.params.id
      this.getData()
      this.getComList()
      let textEle = document.getElementById('textarea')
      TAUtils.autoTextarea(textEle, 0, 100) // 调用
      window.onscroll = function () {
        let t = document.documentElement.scrollTop || document.body.scrollTop
        let topDiv = document.getElementById('top_div')
        if (topDiv.style) {
          if (t >= 300) {
            topDiv.style.display = 'inline'
          } else {
            topDiv.style.display = 'none'
          }
        }
      }
    }
  }
</script>
<style lang="scss">
@import "style/article_detail.scss";

</style>
