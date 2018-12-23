<template>
  <div class="safety-evaluat">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">高危自评</x-header>
    </div>
    <div class="app-content">
      <div class="color-flex_bg" ref="colorFlex" v-show="subjectStandards">
        <div class="color-flex">
          <div class="color-flex-item" v-for="standard in subjectStandards" :key="standard.id">
            <div class="colors" :style="{'background': standard.depict}"></div>
            {{standard.name}}
          </div>
        </div>
      </div>
      <div class="content-card" :style="contentCardStyle">
        <p class="record-title" v-show="!isShowLoading">{{subjectRecord.length ? '高危自评记录' : '暂无自评记录'}}</p>
        <div class="record-list" v-for="(record, index) in subjectRecord" :key="index" @click="jump2Detail(record.header_id)">
          <div class="cell-x-icon-bg">
            <x-icon type="ios-arrow-forward" class="cell-x-icon"></x-icon>
          </div>
          <div>
            <div class="color-flex">
              <div class="color-flex-item">
                <span class="safe-level">风险等级：</span>
                <div class="colors" :style="{'background': record.levelColor}"></div>
                <span>{{record.level}}</span>
              </div>
              <span class="safe-level">评分：{{record.total_score}}分</span>
              <span style="font-size: 12px">（孕周：{{record.gestational_weeks}}+，第{{record.serial}}次测评）</span>
            </div>
            <p>评分日期：<span>{{record.time}}</span></p>
            <p>高危因素：</p>
            <div style="margin-left: 10px;" v-for="(record, index) in getRecordsList(record.risk_factor)" :key="record.id">
              <p>{{index+1}}. {{record.show}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="submit">
          <flexbox>
            <flexbox-item>
              <x-button type="primary" @click.native="jump2Detail(0)">进行高危自评</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <loading :show="isShowLoading" text="加载中..."></loading>
    </div>
  </div>
</template>
<script>
  import { XHeader, XButton, Flexbox, FlexboxItem, Loading } from 'vux'
  import { Obstetrics } from '../../api'
  import { RESULT_CODE } from '../../config/ResultCode'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      XHeader, XButton, Flexbox, FlexboxItem, Loading
    },
    computed: {
      ...mapGetters([
        'gestInfo'
      ])
    },
    data () {
      return {
        deptId: '',
        contentCardStyle: {
          paddingTop: '30px'
        },
        isShowLoading: false,
        subjectRecord: [], // 风险评测列表
        subjectStandards: {} // 等级标准
      }
    },
    watch: {
      /**
       * 检查孕周
       */
      gestInfo (val) {
        const _this = this
        if (val.flag !== -1) {
          this.QuerySubjectById(this.deptId)
        } else {
          this.$vux.alert.show({
            title: '提示',
            content: '请先补充孕周信息',
            onHide () {
              _this.$router.push({name: 'GestationalWeeks'})
            }
          })
        }
      }
    },
    methods: {
      jump2Detail (id) {
        let query = {deptId: this.deptId}
        if (id) query.id = id
        this.$router.push({path: '/special/safe-eval/detail', query: query})
      },
      /**
       * 查询科室下的风险评分标准
       */
      QuerySubjectById () {
        this.isShowLoading = true
        Obstetrics.querySubject(this.deptId).then(res => {
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            this.subjectStandards = res.data.data.standards
            this.querySubjectRecord()
            this.setStyle()
          }
        })
      },
      /**
       * 查询风险评估测评列表
       */
      querySubjectRecord () {
        Obstetrics.querySubjectRecord({
          dept_id: this.deptId
        }).then(res => {
          this.isShowLoading = false
          if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
            const recods = res.data.data
            if (recods && recods.length) {
              this.subjectRecord = recods.map(record => {
                if (this.subjectStandards.length) {
                  this.subjectStandards.forEach(standard => {
                    // 根据测评标准, 给测评列表增加一个颜色的值, 供列表显示
                    if (record.level === standard.name) {
                      record.levelColor = standard.depict
                    }
                  })
                }
                return record
              })
            }
          }
        })
      },
      /**
       * 配置展示的高危因素
       */
      getRecordsList (list) {
        let recordsList = []
        if (list.length) {
          list.forEach(record => {
            record.show = ''
            if (record.score > '0') {
              record.parent_list.forEach(para => {
                record.show += para + ' / '
              })
              record.show += record.name
              record.show += ' (' + record.score + '分)'
              recordsList.push(record)
            }
          })
        }
        return recordsList
      },
      setStyle () {
        this.$nextTick(function () {
          const height = this.$refs.colorFlex.clientHeight
          this.contentCardStyle.paddingTop = height + 10 + 'px'
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.deptId = this.$route.query.deptId
        this.$store.dispatch('queryGestInfo')
      })
    }
  }
</script>
<style lang="scss">
  @import "style/safety_evaluat.scss";
</style>
