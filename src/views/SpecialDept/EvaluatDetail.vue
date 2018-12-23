<template>
  <div class="safety-evaluat">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">{{id ? '修改' : '新建'}}高危评分</x-header>
    </div>
    <div class="app-content">
      <div class="content-card">
        <divider style="margin-top: 50px;" v-if="!subjectData.length && !isShowLoading">暂无测评项目</divider>
        <group v-else v-for="(item, index) in subjectData" :key="index">
          <cell
              class="module-cell"
              :title="item.key"
              is-link
              :border-intent="false"
              :arrow-direction="isShowDetail(index) ? 'up' : 'down'"
              @click.native="switchTitle(index)">
          </cell>
          <switch-tree :menuData="item.list"
                       v-if="isShowDetail(index)"
                       v-model="switchSelectedList[index]">
          </switch-tree>
        </group>
      </div>

      <div class="bottom" v-if="subjectData.length">
        <div class="submit">
          <flexbox>
            <flexbox-item>
              <x-button type="primary" @click.native="updateSubjectRecord" :disabled="isUpdateButtonDisabled">{{id ? '修改' : '提交'}}</x-button>
            </flexbox-item>
            <flexbox-item v-if="id">
              <x-button type="warn" @click.native="delEval" :disabled="isDelButtonDisabled">删除</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <loading :show="isShowLoading" text="加载中..."></loading>
    </div>
  </div>
</template>
<script>
  import { XHeader, XButton, Flexbox, FlexboxItem, Cell, Group, Divider, XSwitch, Loading } from 'vux'
  import { Obstetrics } from '../../api'
  import { RESULT_CODE } from '../../config/ResultCode'
  import SwitchTree from 'components/switch-tree'
  import ConvertUtil from '../../utils/convertUtil'

  export default {
    components: {
      XHeader, XButton, Flexbox, FlexboxItem, Cell, Group, Divider, XSwitch, SwitchTree, Loading
    },
    computed: {
      // ...mapGetters({}),
    },
    data () {
      return {
        deptId: '',
        id: null,
        isUpdateButtonDisabled: false,
        isDelButtonDisabled: false,
        isShowLoading: false,
        groupStateArray: [], // 分组显示的状态集合
        switchSelectedList: [], // switch选择中状态的集合
        subjectData: {}, // 处理后的测评数据(进行递归分好组的测评数据)
        selectedRiskIds: [], // 选中的项目的id集合
        originSubjectData: {}, // 从服务器下载的未经过处理的源测评数据
        standardsData: {} // 评分标准
      }
    },
    watch: {},
    methods: {
      /**
       * 是否显示分组下题目
       */
      isShowDetail (index) {
        return this.groupStateArray[index]
      },
      /**
       * 打开/关闭分组
       */
      switchTitle (index) {
        this.groupStateArray[index] = !this.groupStateArray[index]
        // 状态改变后需要强制重新渲染, 才能刷新列表, 正常显示或者隐藏switch选项
        this.$forceUpdate()
      },
      /**
       * 查询科室下的评分题目
       */
      QuerySubjectById () {
        this.isShowLoading = true
        Obstetrics.querySubject(this.deptId).then(res => {
          this.isShowLoading = false
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            this.initData(res.data.data.risks)
          }
        })
      },
      /**
       * 查询风险评估测评列表
       */
      querySubjectRecord () {
        this.isShowLoading = true
        Obstetrics.querySubjectRecord({
          dept_id: this.deptId,
          header_id: this.id
        }).then(res => {
          this.isShowLoading = false
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            if (res.data.data.length) {
              this.initData(res.data.data[0].recors_list)
            }
          }
        })
      },
      /**
       * 初始化数据
       */
      initData (risks) {
        this.originSubjectData = risks
        this.switchSelectedList = []
        this.groupStateArray = []
        // 进行分组,
        let arr = ConvertUtil.subjectRecordsSortRisk(this.originSubjectData)
        if (arr.length) {
          this.subjectData = []
          arr.forEach((subject, index) => {
            this.subjectData.push({
              key: subject.key,
              list: []
            })
            this.subjectData[index].list = ConvertUtil.subjectRecordsConvert(subject.list)
          })
        }
        if (this.subjectData.length) {
          this.subjectData.forEach(risk => {
            this.groupStateArray.push(true)
            this.switchSelectedList.push(this.getSwitchSelected(risk.list))
          })
        }
      },
      getSwitchSelected (riskList) {
        if (riskList.length) {
          return riskList.map(risk => {
            if (risk.selected === 1) {
              if (risk.children && risk.children.length) {
                return this.getSwitchSelected(risk.children)
              } else {
                return true
              }
            }
          })
        }
      },
      /**
       * 删除评分
       */
      delEval () {
        const _this = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确定删除评分?',
          onConfirm () {
            _this.delSubjectRecord()
          }
        })
      },
      /**
       * 删除评测
       */
      delSubjectRecord () {
        const _this = this
        this.isDelButtonDisabled = true
        this.$vux.loading.show('删除中...')
        let param = this.configRecords()
        Obstetrics.delSubjectRecord(param).then(res => {
          this.isDelButtonDisabled = false
          this.$vux.loading.hide()
          // data为1, 修改成功
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS && res.data.data >= 1) {
            this.$vux.alert.show({
              title: '提示',
              content: '删除成功!',
              onHide () {
                _this.$router.back()
              }
            })
          } else {
            this.showAlert('删除失败, 请售后再试!')
          }
        })
      },
      /**
       * 增加或者修改评分
       */
      updateSubjectRecord () {
        const _this = this
        this.isUpdateButtonDisabled = true
        this.$vux.loading.show(this.id ? '修改中...' : '提交中...')
        let param = this.configRecords()
        Obstetrics.saveSubjectRecord(param).then(res => {
          this.isUpdateButtonDisabled = false
          this.$vux.loading.hide()
          // data为1, 修改成功
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS && res.data.data === 1) {
            this.$vux.alert.show({
              title: '提示',
              content: this.id ? '修改成功!' : '新增成功!',
              onHide () {
                _this.$router.back()
              }
            })
          } else {
            this.showAlert('修改失败, 请稍后再试!')
          }
        })
      },
      setSelectedRisk (list, value) {
        if (list.length) {
          list.forEach((l, i) => {
            if (value && value[i]) {
              this.selectedRiskIds.push(l.id)
              if (l.children.length) {
                this.setSelectedRisk(l.children, value[i])
              }
            }
          })
        }
      },
      /**
       * 配置提交服务器的数据
       */
      configRecords () {
        this.selectedRiskIds = []
        if (this.subjectData.length) {
          this.subjectData.forEach((risk, index) => {
            this.setSelectedRisk(risk.list, this.switchSelectedList[index])
          })
        }
        let records = this.originSubjectData.map(risk => {
          risk.selected = this.selectedRiskIds.indexOf(risk.id) > -1 ? 1 : 0
          return risk
        })
        return {
          dept_id: this.deptId,
          header_id: this.id,
          records: records
        }
      },
      showAlert (msg) {
        this.$vux.alert.show({
          title: '提示',
          content: msg
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.id = this.$route.query.id || ''
        this.deptId = this.$route.query.deptId
        if (this.id) {
          // 查看详情，修改
          this.querySubjectRecord()
        } else {
          // 填写自评
          this.QuerySubjectById()
        }
      })
    }
  }
</script>
<style lang="scss">
  @import "style/safety_evaluat.scss";
</style>
