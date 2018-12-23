<template>
  <div class="home">
    <div class="recommend-title" v-if="articles.art_type">
      <p style="color: #68C84F;font-size: 16px;margin-top: 2px;margin-left: 15px" @click="jump2Articles(articles.art_type)">
        {{articles.cate_name}}
        <span class="more-doc">更多</span>
      </p>
      <a v-for="art in  articles.result" :key="art.article_id" :href="'/user/article-detail/' + art.article_id"
         class="consult">
        <div class="info-image">
          <img v-if="art.pre_view" :src="$store.state.imgServer + art.pre_view">
          <img v-else src="~assets/ic_info_default.png">
        </div>
        <div style="flex: 1;">
          <p style="color: #333">{{art.article_name}}</p>
          <p style="color:#888;margin: 10px 0">{{art.article_summary}}</p>
          <div class="time">{{art.create_time.split(' ')[0]}}
            <div class="comments">
              <i class="fa fa-thumbs-o-up" style="font-size: 18px;color: #999"></i>
              <span class="cnt">{{art.thumb_cnt}}</span>
              <img src="~assets/ic_comments.png" style="margin-left:10px;width: 20px">
              <span class="cnt" v-if="art.comments_cnt>99">99+</span>
              <span class="cnt" v-else>{{art.comments_cnt}}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>
<script>
  import { Articles } from '../../api'
  export default {
    props: {
      id: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        articles: {}
      }
    },
    methods: {
      jump2Articles (type) {
        this.$router.push({path: '/comments-article/' + type})
      }
    },
    mounted () {
      this.$nextTick(function () {
        let _this = this
        Articles.getArticles({
          art_type: _this.id,
          page_number: 1,
          page_size: 1
        }).then(function (res) {
          if (res.ok) {
            _this.articles = res.data.data
          }
        }).catch(err => {
          console.log('HomeInfo---err=', err)
        })
//        this.$store.dispatch('getArticles', {art_type: this.id, page_number: 1, page_size: 1})
      })
    }
  }
</script>
<style lang="scss">
  @import "../../views/Home/style/home.scss";
</style>
