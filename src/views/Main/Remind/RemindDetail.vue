<template>
  <div class="remind-detail">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">消息详情</x-header>
    </div>
    <div class="content">
      <div class="content-header">
        <span class="content-header-title">{{msgNotifyInfo.title}}</span>
        <divider class="content-header-divider">{{msgNotifyInfo.created}}</divider>
      </div>
      <div class="content-info" v-html="msgNotifyInfo.content"></div>

      <div class="footer">
        <flexbox class="footer-box">
          <flexbox-item>
            <x-button type="primary" @click.native="confirm" v-if="msgNotifyInfo.confirm_flag=='1'">确认</x-button>
            <x-button type="primary" v-if="msgNotifyInfo.confirm_flag=='3'" disabled>已确认</x-button>
          </flexbox-item>
        </flexbox>
      </div>

      <div class="content-insurance">
        <recom-insur v-if="msgNotifyInfo.doctor_id"></recom-insur>
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader, Flexbox, FlexboxItem, XButton, Divider } from 'vux'
  import { mapGetters } from 'vuex'
  import { Notify } from '../../../api'
  import { RESULT_CODE } from '../../../config/ResultCode'
  import RecomInsur from 'components/home-menu/RecomInsur'

  export default {
    components: {
      XHeader,
      Flexbox,
      FlexboxItem,
      XButton,
      Divider,
      RecomInsur
    },
    computed: {
      ...mapGetters({
//        msgNotifyInfo: 'msgNotifyInfo'
      })
    },
    data: function () {
      return {
        notifyId: 0,
        msgNotifyInfo: []
      }
    },
    watch: {},
    methods: {
      /**
       * 获取消息详情
       * @param id
       */
      getMsgNotifyDetail (id) {
        Notify.getOneMsgNotify(id).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            this.msgNotifyInfo = res.data.data
          }
        })
      },
      /**
       * 设置已读
       * @param id
       */
      setMsgNotifyRead (id) {
        Notify.setMsgNotifyRead({
          id: id,
          read_flag: '1'
        })
      },
      /**
       * 确认消息
       */
      confirm () {
        const id = this.msgNotifyInfo.id
        Notify.setMsgNotifyRead({
          id: id,
          confirm_flag: '3'
        }).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            if (res.data.data.row && res.data.data.row.toString() === '1') {
              this.$vux.toast.show({
                text: '操作成功!',
                type: 'success'
              })
              this.getMsgNotifyDetail(id)
            }
          }
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        let params = this.$route.params
        if (params && params.id) {
          this.notifyId = params.id
          this.getMsgNotifyDetail(params.id)
          this.setMsgNotifyRead(params.id)
        }
      })
    }
  }
</script>

<style lang="scss">
  @import "./style/reminderDetail.scss";
</style>

