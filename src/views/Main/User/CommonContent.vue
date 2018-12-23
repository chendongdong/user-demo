<template>
  <div class="article">
    <div class="app-header">
    <x-header :left-options="{showBack: true, backText: '返回'}">
      {{title}}
    </x-header>
    </div>
    <div class="app-content">
      <group v-show="type == '1'">
        <cell v-for="art in  articlesList.result" :title="art.article_name" :key="art.article_id" :link="'/commonContent/helpCenterDetail/' + art.article_id"></cell>
      </group>
      <div v-show="type == '2'">
        <div v-html="articleInfo.article_info" class="about-us"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Group, Cell, XHeader } from 'vux'
  import { mapGetters } from 'vuex'
  import { Articles } from '../../../api'
  export default {
    components: {
      Group,
      Cell,
      XHeader
    },
    computed: {
      ...mapGetters([
        'articleInfo',
        'articlesList'
      ])
    },
    data () {
      return {
        title: '关于我们',
        type: 0
      }
    },
    methods: {},
    mounted: function () {
      this.$nextTick(function () {
        this.type = this.$route.params.type
        if (this.type === '1') {
          this.title = '帮助中心'
          this.$store.dispatch('getArticles', {
            art_type: 5,
            page_number: 1,
            page_size: 20
          })
        } else if (this.type === '2') {
          this.title = '关于我们'
          const _this = this
          Articles.getArticles({
            art_type: 14,
            page_number: 1,
            page_size: 1
          }).then(function (res) {
            if (res.data.status === 200) {
              _this.$store.dispatch('getArticleInfo', res.data.data.result[0].article_id)
            }
          }).catch()
        }
      })
    }
  }
</script>
<style lang="scss">
  @import "style/article.scss";
</style>
