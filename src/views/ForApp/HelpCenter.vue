<template>
  <div class="hos-main">
    <x-header :left-options="{showBack: true, backText: '返回'}">
      帮助中心
    </x-header>
    <div style="background-color: white">
      <group>
        <cell v-for="art in  articlesList.result" :title="art.article_name" :key="art.article_id" :link="'/help-center-detail/' + art.article_id"></cell>
      </group>
    </div>
  </div>
</template>
<script>
  import { XHeader, Cell, Group } from 'vux'
  import { mapGetters } from 'vuex'
  export default{
    components: {XHeader, Cell, Group},
    computed: {
      ...mapGetters([
        'articlesList'
      ])
    },
    data () {
      return {}
    },
    methods: {},
    mounted: function () {
      this.$nextTick(function () {
        this.$store.dispatch('getArticles', {
          art_type: 5,
          page_number: 1,
          page_size: 20
        })
      })
    }
  }
</script>
<style lang="scss">
</style>
