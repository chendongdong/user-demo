<template>
  <div class="hos-main">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">关于我们</x-header>
    </div>
    <div style="background: white; padding: 10px;margin-top:44px;">
      <div v-html="articleInfo.article_info" style="background: white;  white-space: pre-wrap; margin: 5px"></div>
    </div>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  import { Articles } from '../../api'
  import { mapGetters } from 'vuex'
  export default {
    components: {XHeader},
    computed: {
      ...mapGetters([
        'articleInfo'
      ])
    },
    mounted: function () {
      const _this = this
      this.$nextTick(function () {
        Articles.getArticles({
          art_type: 14,
          page_number: 1,
          page_size: 1
        }).then(function (res) {
          if (res.data.status === 200) {
            _this.$store.dispatch('getArticleInfo', res.data.data.result[0].article_id)
          }
        }).catch()
      })
    }
  }
</script>
<style lang="scss">
</style>
