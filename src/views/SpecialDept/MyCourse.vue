<template>
  <div class="pregna-school">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">我的课程</x-header>
      <tab :line-width=2 active-color='#68C84F' v-model="tabIndex">
        <tab-item class="vux-center" :selected="tabSelectItem === item" v-for="(item, index) in tabList" @on-item-click="tabItemClick(index)" :key="index">{{item}}</tab-item>
      </tab>
    </div>
    <div class="app-content" style="padding-top: 90px" v-if="courseDatas">
      <x-table :cell-bordered="false" style="background-color:#fff;margin-top: 10px">
        <thead>
        <tr>
          <th style="width: 30%">课程名称</th>
          <th style="width: 30%">上课时间</th>
          <th style="width: 60px" v-if="tabIndex==1">状态</th>
          <th style="width: 20%">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in courseDatas.list">
          <td>{{item.name}}</td>
          <td style="width: 150px">{{item.lecture_start}}-{{item.lecture_end}}</td>
          <td v-if="tabIndex==1">{{item.state_name}}</td>
          <td style="width: 100px">
            <x-button mini @click.native="jump2Detail(item.id)">查看</x-button>
            <x-button mini plain type="primary" @click.native="attend(item.id, 1)" v-if="item.user_attend_cnt==0&&item.state_name!='已结束'">预约</x-button>
            <x-button mini plain type="primary" class="cancle" @click.native="attend(item.id, -1)"
                      v-if="item.user_attend_cnt>=1&&item.state_name!='已结束'">取消</x-button>
          </td>
        </tr>
        </tbody>
      </x-table>
    </div>
    <toast v-model="isShow">{{toastText}}</toast>
  </div>
</template>
<script>
  import {XHeader, Tab, TabItem, XTable, XButton, Group, Selector, Toast} from 'vux'
  import {mapGetters} from 'vuex'
  import {LOCATION_DATA} from '../../config/sessionStorage'
  export default {
    components: {
      XHeader, Tab, TabItem, XTable, XButton, Group, Selector, Toast
    },
    computed: {
      ...mapGetters([
        'courseDatas',
        'prenataCourseMsg'
      ])
    },
    watch: {
      prenataCourseMsg (val) {
        if (val) {
          this.isShow = true
          this.toastText = val
          this.$store.dispatch('clearPrenatalMsg')
          this.getData()
        }
      }
    },
    data () {
      return {
        toastText: '',
        isShow: false,
        tabList: ['线上课程', '线下课程'],
        tabSelectItem: '线上课程',
        tabIndex: 0
      }
    },
    methods: {
      tabItemClick (idx) {
        this.tabSelectItem = this.tabList[idx]
//        this.tabIndex = idx
        this.getData()
      },
      jump2Detail (id) {
        this.$router.push({path: '/special/pregna-school/detail/' + id})
      },
      attend (id, state) {
        let data = {
          attend_flag: state,
          course_id: id
        }
        this.$store.dispatch('attendCourse', data)
      },
      getData () {
        let qrCodeData = window.localStorage.getItem(LOCATION_DATA.QRCODE_DEPT)
        let temp
        if (Number(this.tabIndex) === 0) {
          // 在线课程
          temp = {
            dept_id: JSON.parse(qrCodeData).deptId,
            page_number: 1,
            page_size: 100
          }
        } else {
          // 我的课程
          temp = {
            attend_flag: 1,
            dept_id: JSON.parse(qrCodeData).deptId,
            page_number: 1,
            page_size: 100
          }
        }
        this.$store.dispatch('queryCourse', temp)
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getData()
      })
    }
  }
</script>
<style lang="scss">
  @import "style/pregna_school.scss";
</style>
