<template>
  <div id="wallet">
    <div class="app-header">
      <x-header :left-options="{showBack: false}">我的钱包
        <a slot="left" class="vux-header-back" @click="$router.push({name: 'User'})">返回</a>
        <a slot="right" @click="$router.push({name: 'TradeRecord'})">收支记录</a>
      </x-header>
    </div>

    <div class="content" style="margin-top: 45px;">
      <div style="height: 35px;"></div>
      <div style="margin: 20px 10px;background-color: #ffffff;text-align: center">
        <div style="height: 40px;"></div>
        <div style="padding-bottom: 40px;">
          <span style="font-size: 44px; font-weight: 600;color: orange;">{{userData.available_balance}}</span>
          <br>
          <br>
          <span style="font-size: 18px;">账户余额</span>
        </div>
      </div>
    </div>
    <div style="padding: 30px;">
      <x-button text="快速充值" @click.native="Recharge" type="primary" style="height: 40px;font-size: 16px;"></x-button>
    </div>
  </div>
</template>
<script>
  import { Group, Cell, XInput, XHeader, XButton } from 'vux'
  import { mapGetters } from 'vuex'
  export default {
    components: {Group, Cell, XInput, XHeader, XButton},
    computed: {
      ...mapGetters({
        userData: 'userData'
      })
    },
    data: function () {
      return {}
    },
    watch: {},
    methods: {
      Recharge () {
        this.$router.push({name: 'Recharge'})
      }
    },
    beforeMount () {
      this.$nextTick(function () {
        this.$store.dispatch('getUser')
      })
    }
  }
</script>

<style lang="scss">
  /*@import 'styles/'*/
</style>

