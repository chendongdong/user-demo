<template>
  <div class="user-agreement">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">{{userAgreement.article_name}}</x-header>
    </div>
    <div style="padding: 0px 10px;margin-top: 44px;">
      <div v-html="userAgreement.article_info" class="agreement-content"></div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { XHeader } from 'vux'
  export default {
    components: {
      XHeader
    },
    computed: {
      ...mapGetters({
        userAgreement: 'userAgreement'
      })
    },
    data: function () {
      return {}
    },
    watch: {},
    methods: {},
    beforeMount () {
      this.$store.dispatch('getArticleInfo', 25) // 用户协议的ID是25
    }
  }
</script>
<style lang="css">
  .title-h1 {
    font-weight: 600;
    font-size: 18px;
  }
</style>
