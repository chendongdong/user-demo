<template>
  <div class="yimi-service">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">医秘小助</x-header>
    </div>
    <div class="app-content" @click.native="closePic">
      <x-button mini type="primary" @click.native="jump2Chat" class="btn-his">历史记录</x-button>
      <span class="title">在线咨询：</span>
      <div class="online-service">
        <img src="~assets/image/service_tran.png" class="head-img">
        <div>
          <p>医秘小助在线</p>
          <p>客服电话：<a href="tel:075582266178" class="tel">075582266178</a></p>
          <p style="color: #888">深圳医秘信息科技有限公司<br>为您服务</p>
        </div>
      </div>
      <div class="question" v-if="articlesList.result.length>0">
        常见问题：
        <p v-for="(art, idx) in articlesList.result" :key="art.article_id" @click="jump2Article(art.article_id)">
          {{idx+1}}.{{art.article_name}}</p>
        <!--<p>2.购买保险的流程</p>-->
        <!--<p>3.如何查看自己的保单</p>-->
        <!--<p>4.保险失败怎么办</p>-->
      </div>
      <div class="bottom">
        <x-button type="primary" style="width: 90%;margin-bottom: 20px;font-size: 16px;" @click.native="jump2Chat">立即咨询</x-button>
      </div>
    </div>
    <a href="tel:075582266178" id="tel" style="display: none"></a>
  </div>
</template>
<script>
  import {XHeader, XButton, XInput, Group, XTextarea} from 'vux'
  import {mapGetters} from 'vuex'
  export default {
    components: {
      XHeader,
      XButton,
      XInput,
      Group,
      XTextarea
    },
    computed: {
      ...mapGetters([
        'articleType',
        'articlesList'
      ])
    },
    watch: {
      articleType (val) {
        if (val) {
          this.$store.dispatch('getArticles', {
            art_type: val.id,
            page_number: 1,
            page_size: 10
          })
        }
      }
    },
    data: function () {
      return {
        isShowAdd: false
      }
    },
    methods: {
      jump2Article (id) {
        this.$router.push({path: '/commonContent/helpCenterDetail/' + id})
      },
      jump2Chat () {
        this.$router.push({name: 'ChatDetail'})
      },
      opetPic () {
        this.isShowAdd = !this.isShowAdd
      },
      closePic () {
        this.isShowAdd = false
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.$store.dispatch('articleTypesByCode', {code: 'INSUR_COM_QUEST'})
      })
    }
  }
</script>

<style lang="scss">
  @import "style/service.scss";
</style>

