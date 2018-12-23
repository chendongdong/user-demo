<template>
  <div class="message">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">我的消息</x-header>
    </div>
    <div class="app-content" v-show="smsData.length">
      <sms-card :dataList="smsData"></sms-card>
    </div>
    <div class="sms-none" v-show="!smsData.length">
      <p>无消息记录~</p>
    </div>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  import SmsCard from './component/smsCard.vue'
  import { User } from '../../../api'

  export default {
    components: {
      XHeader,
      SmsCard
    },
    computed: {},
    data () {
      return {
        pageNumber: 1,
        pageSize: 100,
        smsData: []
      }
    },
    methods: {
      getSmsData () {
        User.getSmsRecord({
          page_number: this.pageNumber,
          page_size: this.pageSize
        }).then(res => {
          if (res.data.status === 200) {
            this.smsData = res.data.data.list
          }
        })
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.getSmsData()
      })
    }
  }
</script>
<style lang="css">
  .message .sms-none {
    margin-top: 58px;
    line-height: 36px;
    width: 100%;
    text-align: center;
  }
</style>

