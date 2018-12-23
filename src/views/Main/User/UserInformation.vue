<template>
  <div class="user-information">
    <div class="app-header">
      <x-header :left-options="{showBack: false}">个人信息
        <a slot="right" @click="saveBtn">保存</a>
        <a slot="left" class="vux-header-back" @click="$router.push({name: 'User'})">返回</a>
      </x-header>
    </div>

    <div class="app-content">
      <group>
        <x-input style="margin-right: 15px" title="真实姓名" placeholder="请输入姓名" v-model="userName" novalidate :show-clear="false" placeholder-align="right" text-align="right"></x-input>
        <!--<cell title="真实姓名" :value="userData.user_name"></cell>-->
        <cell title="年龄" is-link :value="userData.born_date" link="/user/modifyInfo/1"></cell>
        <cell title="性别" is-link :value="userData.gender? '男': '女'" link="/user/modifyInfo/2"></cell>
        <cell title="账号手机" :value="userData.account"></cell>
        <cell title="身份证号" :value="userData.id_card"></cell>
      </group>
      <group v-show="gestInfo">
        <cell title="孕周" is-link :value="gestationalWeeks" link="/special/gest-week"></cell>
      </group>
      <group>
        <cell title="健康档案" is-link link="/user/case-his/healthRecords"></cell>
      </group>
      <group>
        <cell title="修改头像" is-link link="/user/modifyInfo/6"></cell>
      </group>
    </div>
    <toast v-model="showRes">修改成功</toast>
    <div>{{retuenMsgCpu}}</div>
  </div>
</template>
<script>
  import { XHeader, Group, Cell, XInput, Toast } from 'vux'

  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XInput,
      Toast
    },
    data () {
      return {
        userName: '',
        showRes: false
      }
    },
    methods: {
      saveBtn () {
        let payload = {
          user_name: this.userName
        }
        this.$store.dispatch('editUser', payload)
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.$store.dispatch('getUser')
        this.$store.dispatch('queryGestInfo')
      })
    },
    computed: {
      retuenMsgCpu: function () {
        if (this.$store.getters.returnMsg === '成功' || this.$store.getters.returnMsg === '修改成功') {
          this.showRes = true
          this.$auth.fetch()
        }
        this.$store.dispatch('clearUserMsg')
      },
      userData () {
        let userData = Object.assign({}, this.$store.getters.userData)
        if (userData.account) {
          userData.account = userData.account.substr(0, 3) + '****' + userData.account.substr(7, 4)
        }
        let idCard = userData.id_card
        if (idCard) {
          userData.id_card = idCard.substr(0, 3) + '***********' + idCard.substr(idCard.length - 4, idCard.length)
        }
        this.userName = userData.user_name
        return userData
      },
      gestInfo () {
        return this.$store.getters.gestInfo
      },
      gestationalWeeks () {
        let msg = '请设置'
        if (this.gestInfo && this.gestInfo.flag !== -1) {
          if (this.gestInfo.infos && this.gestInfo.infos.gestational_weeks) {
            msg = `第${this.gestInfo.infos.gestational_weeks}周`
          }
        }
        return msg
      }
    }
  }
</script>
<style>

</style>
