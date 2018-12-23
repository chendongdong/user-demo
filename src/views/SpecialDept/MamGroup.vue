<template>
  <div class="mam-group">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">宝妈圈</x-header>
    </div>
    <div class="app-content">
      <cell v-for="item in groupList" :key="item.id" :link="'/special/group-chat/' + item.id">
        <span slot="title">
          <span style="vertical-align:middle;">{{ item.groupName }}</span>
          <badge :text="item.unread" v-if="item.unread>0"></badge>
        </span>
        <img slot="icon" src="~assets/ic_group.png" class="group-head">
      </cell>
    </div>
  </div>
</template>
<script>
  import {XHeader, Toast, Cell, Badge} from 'vux'
  import {mapGetters} from 'vuex'
  export default {
    components: {
      XHeader, Toast, Cell, Badge
    },
    computed: {
      ...mapGetters([
        'groupList'
      ])
    },
    data () {
      return {
        timer: null
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.$store.dispatch('getGroupList')
//        let _this = this
//        this.timer = setInterval(function () {
//          _this.$store.dispatch('getGroupList')
//        }, 2000)
      })
    },
    beforeDestroy () {
//      clearInterval(this.timer)
//      this.timer = null
    }
  }
</script>
<style lang="scss">
  @import "style/mam_group.scss";
</style>
