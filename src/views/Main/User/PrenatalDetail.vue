<template>
  <div class="prenatal-detail">
    <div style="position: fixed;width: 100%;top: 0;z-index: 999">
      <x-header :left-options="{showBack: true, backText: '返回'}">孕检记录详情
      </x-header>
    </div>

    <!--患者列表-->
    <div class="content">
      <div class="info-card">
        <span class="card-title">预约人信息</span>
        <div class="info-card-content">
          <span style="color: orange">{{info.patient_name}}</span>
          <span>{{info.patient_pregnant_period}}周</span>
          <span class="pull-right" style="color: red">{{info.apply_state_name}}</span>
          <br>
          <span>{{info.patient_phone}}</span>
        </div>
      </div>

      <div class="info-card">
        <span class="card-title">孕检信息</span>
        <div class="info-card-content">
          <span>医院: <span>{{info.hos_name}}</span></span><br>
          <span>科室: <span>{{info.dept_name}}</span></span><br>
          <span>产检时间: <span>{{info.patient_apply_in_time}}</span></span>
        </div>
      </div>

      <div class="info-card">
        <span class="card-title">备注</span>
        <div class="info-card-content">
          <p style="min-height: 120px;">{{info.patient_notes}}</p>
        </div>
      </div>

      <div style="margin: 20px 8px;padding: 10px;font-size: 13px;">
        <span>申请时间</span>: <span>{{info.created}}</span></span><br>
      </div>
      <div style="padding: 10px">
        <x-button size="large"
                  type="primary"
                  class="booking-btn"
                  @click.native="stateBtnClick(1)"
                  style="font-size: 16px;"
                  v-show="!isShowCancelBtn">再次预约
        </x-button>
        <x-button size="large" type="warn" class="booking-btn" @click.native="stateBtnClick(2)" style="font-size: 16px;" v-show="isShowCancelBtn">取消预约</x-button>
      </div>
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
  // import _ from 'lodash'
  const PRENATAL_STATE = [
    {key: '-1', val: '取消'},
    {key: '0', val: '排队中'},
    {key: '2', val: '已检查'},
    {key: '3', val: '违约'}
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
        info: {},
        isShowCancelBtn: false,
        patientList: [],
        dataDict: []
      }
    },
    watch: {},
    methods: {
      /**
       * 获取患者信息
       */
      getData (id) {
        this.$vux.loading.show({
          text: '加载中...'
        })
        Prenatal.getPrenatalInfo(id).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            let info = res.data.data
            if (info.apply_state >= -1) {
              PRENATAL_STATE.forEach(function (p) {
                if (p.key === info.apply_state) {
                  info.apply_state_name = p.val
                }
              })
            }
            this.isShowCancelBtn = info.apply_state === '0'
            this.info = info
            this.$vux.loading.hide()
          }
        })
      },
      /**
       * 状态按钮
       */
      stateBtnClick (type) {
        const _this = this
        if (type === 1) { // 再次预约
          this.$router.push({
            name: 'PrenatalCareApply',
            query: {
              id: this.info.id,
              dept_id: this.info.dept_id,
              t: QUERY_NAME.PRENATAL_RECORD
            }
          })
        } else if (type === 2) { // 取消预约
          this.$vux.confirm.show({
            title: '提示',
            content: '需要取消预约吗?',
            onConfirm () {
              _this.updatePrenatalInfo(_this.info.id, 'canceled') // 取消: canceled, 见后台数字字典
            }
          })
        }
      },
      /**
       * 更新预约信息
       * @param id
       * @param state
       */
      updatePrenatalInfo (id, state) {
        Prenatal.updatePrenatalInfo({
          id: id,
          state: state // 取消: canceled, 见后台数字字典
        }).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS && res.data.data === 1) {
            this.$vux.toast.show('取消成功!')
            this.getData(this.info.id)
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
        let params = this.$route.params
        if (params.id) {
          this.getData(params.id)
        }
      })
    }
  }
</script>

<style lang="scss">
  /*@import 'style/inpatient.scss';*/
  .prenatal-detail .content {
    margin-top: 46px;
  }

  .prenatal-detail span {
    line-height: 200%;
  }

  .prenatal-detail .card-title {
    line-height: 36px;
    padding: 0 10px;
  }

  .prenatal-detail .info-card {
    margin: 10px;
  }

  .prenatal-detail .info-card:first-child {
    margin-top: 10px;
  }

  .prenatal-detail .info-card .info-card-content {
    background-color: #FFFFFF;
    padding: 10px;
    border-radius: 5px;
    font-size: 13px;
  }
</style>