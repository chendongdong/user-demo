<template>
  <div class="hepl-detail">
    <x-header :left-options="{showBack: true, backText: '返回'}">
      {{articleInfo.article_name}}
    </x-header>
    <div v-html="articleInfo.article_info" style="background: white;  white-space: pre-wrap; margin: 5px"></div>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  import { mapGetters } from 'vuex'
  export default{
    components: {
      XHeader
    },
    computed: {
      ...mapGetters([
        'articleInfo'
      ])
    },
    data () {
      return {}
    },
    methods: {},
    mounted: function () {
      this.$nextTick(function () {
        this.$store.dispatch('clearArticlesData')
        const params = this.$route.params
        if (params.id) {
          this.$store.dispatch('getArticleInfo', params.id)
        }
      })
    }
  }
</script>
<style lang="scss">
  .hepl-detail {
  .pad-content {
    background: white;
    font-size: 16px;
    padding: 10px 10px 0px 10px;
    line-height: 160%;
  }

  }
</style>
