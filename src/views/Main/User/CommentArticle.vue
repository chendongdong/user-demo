<template>
  <div class="article">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        {{title}}
      </x-header>
    </div>
    <div class="app-content"
         v-infinite-scroll="loadMore"
         infinite-scroll-distance="100">
      <!--<group>-->
        <!--<cell v-for="art in  articls" :title="art.article_name" :key="art.article_id" :link="'/user/article-detail/' + art.article_id"></cell>-->
      <!--</group>-->
      <a v-for="art in  articls" :key="art.article_id" :href="'/user/article-detail/' + art.article_id" class="consult">
        <div style="width: 100px;margin: 10px 15px">
          <img :src="$store.state.imgServer + art.pre_view" v-if="art.pre_view" style="width: 80px;height: 80px">
          <img src="~assets/ic_info_default.png" v-else style="width: 80px;height: 80px">
        </div>
        <div style="flex: 1;margin-right: 15px">
          <p style="color: #333;margin: 10px 0">{{art.article_name}}</p>
          <!--<p style="color:#888;margin: 10px 0">{{art.article_summary}}</p>-->
          <div class="time">{{art.create_time.split(' ')[0]}}
            <div class="comments">
              <i class="fa fa-thumbs-o-up" style="font-size: 18px;color: #999"></i>
              <span class="cnt">{{art.thumb_cnt}}</span>
              <img src="~assets/ic_comments.png" style="margin-left: 10px;width: 20px">
              <span class="cnt" v-if="art.comments_cnt>99">99+</span>
              <span class="cnt" v-else>{{art.comments_cnt}}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
    <div style="display: none">{{articlesList}}</div>
  </div>
</template>
<script>
  import { Group, Cell, XHeader } from 'vux'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      Group,
      Cell,
      XHeader
    },
    computed: {
      ...mapGetters([
        'articlesList'
      ])
    },
    watch: {
      articlesList (val) {
        if (this.pageNum === 1) {
          this.articls = []
        }
        if (val.result.length > 0) {
          this.articls = this.articls.concat(val.result)
        }
      }
    },
    data () {
      return {
        title: '',
        type: 0,
        pageNum: 1,
        pageSize: 10,
        isFirst: true,
        articls: []
      }
    },
    methods: {
      getArticleList () {
        this.$store.dispatch('getArticles', {
          art_type: this.type,
          page_number: this.pageNum,
          page_size: this.pageSize
        })
      },
      loadMore () {
        if (this.isFirst) {
          this.isFirst = false
          return
        }
        if (this.articlesList.last_page === false) {
          this.pageNum++
          this.getArticleList()
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.type = this.$route.params.type
        if (this.type === '18') {
          this.title = '健康资讯'
        } else if (this.type === '19') {
          this.title = '孕期知识'
        }
        this.getArticleList()
      })
    }
  }
</script>
<style lang="scss">
  @import "style/article.scss";
</style>
