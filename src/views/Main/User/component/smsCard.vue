<template>
  <div>
    <div v-for="(list, index) in dataList" class="sms-card">
      <div class="sms-logo">
        <img src="../../../../assets/sms.png" alt="sms" class="sms-img">
      </div>
      <div class="sms-content">
        <div class="sms-header">
          <span class="sms-title">{{list.template_name}}</span>
          <span class="sms-time">{{list.created}}</span>
        </div>
        <div class="sms-body">
          <span class="sms-info">{{list.content}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    computed: {},
    props: {
      dataList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data: function () {
      return {}
    },
    watch: {},
    methods: {},
    beforeMount () {

    }
  }
</script>

<style lang="scss">
  @import 'style/smsCard.scss';
</style>



