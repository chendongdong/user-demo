<template>
  <div class="article">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        {{articleInfo.article_name}}
      </x-header>
    </div>
    <div class="app-content">
      <div v-html="articleInfo.article_info" class="content"></div>
    </div>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  export default {
    components: {
      XHeader
    },
    computed: {
      articleInfo () {
        return this.$store.getters.articleInfo
      }
    },
    data () {
      return {}
    },
    methods: {},
    mounted: function () {
      this.$store.dispatch('clearArticlesData')
      const params = this.$route.params
      if (params.id) {
        this.$store.dispatch('getArticleInfo', params.id)
      }
    }
  }
</script>
<style lang="scss">
  @import "style/article.scss";
</style>
