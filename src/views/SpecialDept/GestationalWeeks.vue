<template>
  <div class="safety-evaluat">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        孕周期
        <span slot="right" class="save" @click="save">保存</span>
      </x-header>
    </div>
    <div class="app-content">
      <group title="">
        <popup-picker title="孕周"
                      :data="weeks"
                      v-model="weeksValue"
                      placeholder="请设置">
        </popup-picker>
      </group>
    </div>
  </div>
</template>
<script>
  import { XHeader, PopupPicker, XButton, Group } from 'vux'
  import { Obstetrics } from '../../api'
  import { RESULT_CODE } from '../../config/ResultCode'

  export default {
    components: {
      XHeader, XButton, Group, PopupPicker
    },
    computed: {
      weeks () {
        let maxWeek = this.$store.getters.dataDict
        let weeks = []
        let length = maxWeek.length ? maxWeek[0].val : 1
        for (let i = 1; i <= length; i++) {
          weeks.push(`第${i}周`)
        }
        return [weeks]
      }
    },
    data () {
      return {
        weeksValue: []
      }
    },
    watch: {},
    methods: {
      queryGestInfo () {
        Obstetrics.queryGestInfo().then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            let gest = res.data.data
            if (gest && gest.infos && gest.infos.gestational_weeks) {
              this.weeksValue = [`第${gest.infos.gestational_weeks}周`]
            }
          }
        })
      },
      /**
       * 更新孕周
       */
      save () {
        const _this = this
        let weekString = this.weeksValue[0]
        let week = weekString.substring(1, weekString.length - 1)
        this.$vux.loading.show({
          text: '修改中...'
        })
        Obstetrics.updateGestInfo({
          gestational_weeks: week
        }).then(res => {
          this.$vux.loading.hide()
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS && res.data.data === 1) {
            this.$vux.toast.show({
              text: '修改成功!',
              type: 'success',
              onHide () {
                _this.$router.back()
              }
            })
          } else {
            this.$vux.alert.show({
              title: '提示',
              content: '修改失败, 请稍后再试!'
            })
          }
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.queryGestInfo()
        this.$store.dispatch('findDataDict', 'obst_max_weeks')
      })
    }
  }
</script>
<style lang="scss">
  @import "style/safety_evaluat.scss";
</style>
