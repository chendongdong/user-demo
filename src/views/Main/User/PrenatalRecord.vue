<template>
  <div class="prenatal-record">
    <div style="position: fixed;width: 100%;top: 0;z-index: 999">
      <x-header :left-options="{showBack: true, backText: '返回'}">孕检记录
      </x-header>
    </div>

    <!--患者列表-->
    <div class="content">
      <panel-card :data-list="patientList" :type="16" @state-btn-click="stateBtnClick" @card-click="cardClick"></panel-card>
    </div>

  </div>
</template>
<script>
  import {
    XHeader,
    XButton
  } from 'vux'
  import { mapGetters } from 'vuex'
  import PanelCard from '../../../components/panel-card'
  import { Prenatal } from '../../../api'
  import { RESULT_CODE } from '../../../config/ResultCode'
  import { QUERY_NAME } from '../../../config/Constant'
  import moment from 'moment'
  // import _ from 'lodash'
  const PRENATAL_STATE = [
    {key: '-1', val: '取消', title: '再次预约'},
    {key: '0', val: '排队中', title: '取消预约'},
    {key: '2', val: '已检查', title: '再次预约'},
    {key: '3', val: '违约', title: '再次预约'}
  ]

  export default {
    components: {
      XHeader,
      XButton,
      PanelCard
    },
    computed: {
      ...mapGetters({
        // bookingList: 'bookingList'
      })
    },
    data: function () {
      return {
        patientList: [],
        dataDict: []
      }
    },
    watch: {},
    methods: {
      /**
       * 获取患者信息
       */
      getDataList () {
        this.$vux.loading.show({
          text: '加载中...'
        })
        Prenatal.getPrenatalList({
          q: '',
          create_end_time: moment().add(1, 'days').format('YYYY-MM-DD'),
          create_start_time: moment().subtract(1, 'years').format('YYYY-MM-DD'),
          order_state: ''
        }).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            let list = res.data.data
            if (list.length) {
              list.forEach(function (l) {
                // 配置状态名称, 在孕妇列表直接展示孕检状态
                if (l.apply_state >= -1) {
                  PRENATAL_STATE.forEach(function (p) {
                    if (p.key === l.apply_state) {
                      l.apply_state_name = p.val
                      l.btn_title = p.title
                    }
                  })
                }
              }, this)
            }
            this.patientList = list
            this.$vux.loading.hide()
          }
        })
      },
      /**
       * 状态按钮
       */
      stateBtnClick (id, index) {
        const _this = this
        let p = this.patientList[index]
        if (p.apply_state === '-1' || p.apply_state === '2' || p.apply_state === '3') { // 再次预约
          this.$router.push({name: 'PrenatalCareApply', query: {id: p.dept_id, t: QUERY_NAME.PRENATAL_RECORD}})
          this.$router.push({
            name: 'PrenatalCareApply',
            query: {
              id: p.id,
              dept_id: p.dept_id,
              t: QUERY_NAME.PRENATAL_RECORD}
          })
        } else if (p.apply_state === '0') { // 取消预约
          this.$vux.confirm.show({
            title: '提示',
            content: '需要取消预约吗?',
            onConfirm () {
              _this.updatePrenatalInfo(id, 'canceled') // 取消: canceled, 见后台数字字典
            }
          })
        }
      },
      cardClick (id) {
        this.$router.push({name: 'PrenatalDetail', params: {id: id}})
      },
      /**
       * 更新预约信息
       * @param id
       * @param state
       */
      updatePrenatalInfo (id, state) {
        Prenatal.updatePrenatalInfo({
          id: id,
          state: state
        }).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS && res.data.data === 1) {
            this.$vux.toast.show('取消成功!')
            this.getDataList()
          } else {
            this.$vux.alert.show({
              title: '提示',
              content: res.data.data || '状态更新失败'
            })
          }
        })
      }
    },
    beforeMount () {
      this.$nextTick(function () {
        this.getDataList()
      })
    }
  }
</script>

<style lang="scss">
  .prenatal-record .content {
    margin-top: 56px;
  }
</style>