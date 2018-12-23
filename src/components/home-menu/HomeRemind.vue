<template>
  <div class="home">
    <swiper auto height="30px"
            direction="vertical"
            :interval=2000
            class="text-scroll"
            :show-dots="false"
            v-show="msgNotify.list&&msgNotify.list.length>0">
      <swiper-item v-for="(item, index) in msgNotify.list" :key="index" @click.native="jump2Remind(item.id)">
        <p>{{item.content}}</p>
      </swiper-item>
      <img src="~assets/ic_remind_red.png" style="width: 18px;margin-top: 5px;margin-left: 10px">
    </swiper>
    <div style="display: none">{{msgNotify}}</div>
  </div>
</template>

<script>
  import {Swiper, SwiperItem} from 'vux'
  import { mapGetters } from 'vuex'
  import Moment from 'moment'
  export default {
    components: {
      Swiper, SwiperItem
    },
    computed: {
      ...mapGetters([
        'msgNotify'
      ])
    },
    watch: {
      msgNotify (val) {
        if (val.list) {
          this.notifyList = []
          for (let i = 0; i < val.length; i++) {
            let createdDay = Moment(val[i].created)
            let today = Moment()
            if (today.isSame(createdDay, 'd')) {
              this.notifyList.push(val[i])
            }
          }
        }
      }
    },
    data () {
      return {
        notifyList: []
      }
    },
    methods: {
      jump2Remind (id) {
        this.$router.push({path: '/main/remind-detail/' + id})
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.$store.dispatch('clearNotify')
        if (this.$auth.check()) {
          let isRemPwd = window.localStorage.getItem('IS_REM_PWD')
          let isFirst = window.sessionStorage.getItem('IS_FIRST')
          // 如果是不需要记住密码，而且是第一次进入主界面，就先调用退出登录接口，删除token
          if (isRemPwd && !JSON.parse(isRemPwd) && !isFirst) {
            window.sessionStorage.setItem('IS_FIRST', 'logined')
            this.$auth.logout()
            window.localStorage.removeItem('default-auth-token-user')
          } else {
            this.$store.dispatch('getMsgNotify', {'page_number': 1, 'page_size': 999, 'read_flag': 0})
          }
        }
      })
    }
  }
</script>
<style lang="scss">
  @import "../../views/Home/style/home.scss";
</style>
