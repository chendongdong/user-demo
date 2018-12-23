<template>
  <div class="group-info">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">群信息</x-header>
    </div>
    <div class="app-content" v-if="groupInfo">
      <div class="member">
        <div class="member-item" v-for="(item, idx) in groupInfo.user_list" v-if="isShowAll">
          <img :src="$store.state.imgServer + item.picture" class="head" v-if="item.picture">
          <img src="~assets/image/women.png" class="head" v-else>
          <p>{{item.name}}</p>
          <p class="week" v-if="groupInfo.user_list[idx].week!=-1">（{{groupInfo.user_list[idx].week}}周）</p>
        </div>
        <div class="member-item" v-for="(item, idx) in 6" v-if="!isShowAll&&groupInfo">
          <img :src="$store.state.imgServer + groupInfo.user_list[idx].picture" class="head"
               v-if="groupInfo.user_list[idx].picture">
          <img src="~assets/image/women.png" class="head" v-else>
          <p>{{groupInfo.user_list[idx].name}}</p>
          <p class="week" v-if="groupInfo.user_list[idx].week!=-1">（{{groupInfo.user_list[idx].week}}周）</p>
        </div>
      </div>
      <p class="all-group" v-if="!isShowAll" @click="isShowAll=true">查看全部群成员</p>
      <cell title="群名称" :inline-desc="groupInfo.group_name" class="info"></cell>
      <cell title="群公告" :inline-desc="groupInfo.announcement" class="info"></cell>
      <div style="padding: 40px 20px">
        <x-button text="退出群聊"  @click.native="removeGroup" type="warn" style="height: 40px;font-size: 16px;"></x-button>
      </div>
    </div>
    <loading v-model="isLoadGroup" text="加载中"></loading>
    <toast v-model="isShowToast">{{toastText}}</toast>
  </div>
</template>
<script>
  import {XHeader, Cell, XButton, Loading, Toast} from 'vux'
  import {mapGetters} from 'vuex'
  export default {
    components: {
      XHeader, Cell, XButton, Loading, Toast
    },
    computed: {
      ...mapGetters([
        'groupInfo',
        'groupOptMsg',
        'isLoadGroup'
      ])
    },
    watch: {
      groupInfo (val) {
        if (val.user_list.length > 8) {
          this.isShowAll = false
        } else {
          this.isShowAll = true
        }
      },
      groupOptMsg (val) {
        if (val) {
          this.isShowToast = true
          this.toastText = val
          this.$store.dispatch('clearGroupChatOptMsg')
          let _this = this
          setTimeout(function () {
            _this.$router.go(-2)
          }, 1000)
        }
      }
    },
    data () {
      return {
        isShowAll: false,
        isShowToast: false,
        toastText: '',
        groupId: null
      }
    },
    methods: {
      removeGroup () {
        let _this = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确定要退出群？',
          onConfirm () {
            let data = {
              group_id: _this.groupId,
              user_list: [
                {
                  user_id: _this.$auth.user().user_id,
                  user_type: 1
                }
              ]
            }
            _this.$store.dispatch('removeGroup', data)
          }
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.groupId = this.$route.params.groupId
        this.$store.dispatch('getGroupInfo', {group_id: this.groupId})
      })
    }
  }
</script>
<style lang="scss">
  @import "style/group_info.scss";
</style>
