<template>
  <div class="remind-manager">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">{{title}}</x-header>
    </div>
    <div class="app-content">
      <div class="content-card">
        <div class="header">
          <span>{{notifyTemplate && notifyTemplate.type_name}}</span>
          <span style="font-size: 13px;font-weight: 400;">{{notifyTemplate && notifyTemplate.start_time}}</span>
        </div>
        <div class="base-info">
          <div v-if="$route.query.type==2">
            <span>医生:  <span v-html="notifyTemplate && notifyTemplate.params.doctor_name"></span></span><br>
            <span>医院:  <span v-html="notifyTemplate && notifyTemplate.params.hos_name"></span></span><br>
            <span>备注:  <span v-html="notifyTemplate && notifyTemplate.params.remark"></span></span>
          </div>
          <div v-if="$route.query.type==3">
            <span>药品名称:  <span v-html="notifyTemplate && notifyTemplate.params.medicine_name"></span></span><br>
            <span>剂量单位:  <span v-html="notifyTemplate && notifyTemplate.params.count_name"></span></span><br>
            <span>服药原因:  <span v-html="notifyTemplate && notifyTemplate.params.cause"></span></span><br>
            <span>药品来源:  <span v-html="notifyTemplate && notifyTemplate.params.origin"></span></span><br>
            <span>备注:  <span v-html="notifyTemplate && notifyTemplate.params.remark"></span></span>
          </div>
          <div v-if="$route.query.type==4">
            <span>备注:  <span v-html="notifyTemplate && notifyTemplate.params.remark"></span></span>
          </div>
        </div>
      </div>

      <div class="btn" style="margin: 20px auto; width: 80%" v-show="$route.query.type!='1'">
        <x-button type="primary" @click.native="editRemind">编辑提醒</x-button>
        <x-button type="warn" @click.native="deleteClick" :show-loading='isShowDelBtnLoading' :disabled="isShowDelBtnLoading">删除提醒</x-button>
        <x-button type="default" @click.native="updateClick" :show-loading='isShowUpdateBtnLoading' :disabled="isShowUpdateBtnLoading">{{isValid ? '停用提醒' : '启用提醒' }}</x-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    XHeader,
    Loading,
    XButton
  } from 'vux'
  import { mapGetters } from 'vuex'
  import { Notify } from '../../../api'
  import { RESULT_CODE } from '../../../config/ResultCode'

  const typeList = () => ['医生提醒', '复诊提醒', '用药提醒', '其他提醒']
  const typePageNameList = () => ['EditReturnRemind', 'EditMedicineRemind', 'EditOtherRemind']

  export default {
    components: {
      XHeader,
      Loading,
      XButton
    },
    computed: {
      ...mapGetters({}),
      notifyTemplate () {
        let data = this.$store.getters.notifyTemplate
        if (data.length) {
          let newData = data.slice()
          newData.forEach(function (r) {
            r['type_name'] = typeList()[parseInt(r.type) - 1]
          }, this)
          this.isValid = newData[0].valid === '1'
          return newData[0]
        }
      }
    },
    data: function () {
      return {
        title: '我的提醒',
        isValid: false,
        isShowUpdateBtnLoading: false,
        isShowDelBtnLoading: false
      }
    },
    watch: {},
    methods: {
      /**
       * 获取提醒内容
       */
      getData (id) {
        this.$store.dispatch('findNotifyTemplate', {
          type: this.$route.query.type,
          id: id,
          valid: '1'
        })
      },
      /**
       * 编辑提醒
       */
      editRemind () {
        let type = this.$route.query.type
        let pageName = typePageNameList()[parseInt(type - 2)]
        let id = this.notifyTemplate.id
        if (id) {
          this.$router.push({name: pageName, query: {id: id}})
        }
      },
      /**
       * 停用/开启提醒
       */
      updateClick () {
        const _this = this
        const msg = this.isValid ? '停用' : '启用'
        this.$vux.confirm.show({
          title: '提示',
          content: `需要${msg}该提醒吗?`,
          onConfirm () {
            _this.updateNotify()
          }
        })
      },
      deleteClick () {
        const _this = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确定删除该提醒?',
          onConfirm () {
            _this.delNotify()
          }
        })
      },
      /**
       * 更新提醒
       */
      updateNotify () {
        const _this = this
        let valid = this.isValid ? 0 : 1
        this.isShowUpdateBtnLoading = true
        Notify.setNotifyTemplate({
          id: this.notifyTemplate.id,
          valid: valid,
          type: this.$route.query.type
        }).then(res => {
          this.isShowUpdateBtnLoading = false
          const msg = this.isValid ? '停用' : '启用'
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS && res.data.message === '请求成功') {
            this.$vux.toast.show(`提醒已${msg}!`)
            setTimeout(function () {
              _this.$router.go(-1)
            }, 1000)
          } else {
            this.isShowUpdateBtnLoading = false
            this.$vux.alert.show({
              title: '提示',
              content: `${msg}失败, 请稍后再试!`
            })
          }
        })
      },
      /**
       * 删除提醒
       */
      delNotify () {
        const _this = this
        let id = this.notifyTemplate.id
        this.isShowDelBtnLoading = true
        Notify.delNotifyTemplate(id).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS && res.data.data === 1) {
            this.$vux.toast.show(`删除成功!`)
            setTimeout(function () {
              _this.$router.go(-1)
            }, 1000)
          } else {
            this.isShowDelBtnLoading = false
            this.$vux.alert.show({
              title: '提示',
              content: '删除失败, 请稍后再试!'
            })
          }
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        let query = this.$route.query
        if (query.type) {
          this.title = typeList()[parseInt(query.type) - 1]
        }
        if (query.id) {
          this.getData(query.id)
        }
      })
    },
    destroyed () {
    }
  }
</script>

<style lang="scss">
  @import "../style/remindManager.scss";
</style>

