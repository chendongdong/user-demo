<template>
  <div class="expert-consult">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">专家咨询</x-header>
    </div>
    <div class="app-content">
      <panel-card :data-list="dept_doctorDetails" :type="17"></panel-card>
    </div>
  </div>
</template>
<script>
  import {XHeader} from 'vux'
  import {mapGetters} from 'vuex'
  import PanelCard from 'components/panel-card'
  import {LOCATION_DATA} from '../../config/sessionStorage'
  export default {
    components: {
      XHeader, PanelCard
    },
    data () {
      return {
        deptId: '',
        doctorList: []
      }
    },
    computed: {
      ...mapGetters([
        'dept_doctorDetails',
        'unreadChatList'
      ])
    },
    watch: {
      unreadChatList (val) {
        this.$store.dispatch('getDepartment', this.deptId)
      },
      dept_doctorDetails (val) {
        this.doctorList = []
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.unreadChatList.length; j++) {
            let str = this.unreadChatList[j].split('|')
            // str[0]:id,str[1]:type,str[2]:未读消息条数
            if (Number(str[0]) === val[i].doctor.id) {
              val[i].doctor.unread = Number(str[2])
            }
          }
          this.doctorList.push(val[i].doctor)
        }
      }
    },
    methods: {
    },
    mounted () {
      this.$nextTick(function () {
        this.deptId = this.$route.query.id
        let userId = this.$auth.user().user_id
        let userName = this.$auth.user().user_name
        let qrCodeData = window.localStorage.getItem(LOCATION_DATA.QRCODE_DEPT)
        let data = {
          identity: userId + '|' + userName + '|1|2',
          dept_id: JSON.parse(qrCodeData).deptId
        }
        this.$store.dispatch('getUnreadChatList', data)
//        let _this = this
//        this.timer = setInterval(function () {
//          _this.$store.dispatch('getUnreadChatList', {identity: userId + '|' + userName + '|1|2'})
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
  @import "style/expert_consult.scss";
</style>
