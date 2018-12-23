<template>
  <div class="pregna-school">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">课程详情</x-header>
    </div>
    <div class="app-content" v-if="courseDatas">
      <div class="info-flex">
        <p class="info-title">课程名称</p>
        <p class="info-detail">{{courseDatas.list[0].name}}</p>
      </div>
      <div class="info-flex">
        <p class="info-title">课程内容</p>
        <p class="info-detail">{{courseDatas.list[0].content}}</p>
      </div>
      <div class="info-flex">
        <p class="info-title">授课老师</p>
        <p class="info-detail">{{courseDatas.list[0].teacher}}</p>
      </div>
      <div class="info-flex">
        <p class="info-title">类别</p>
        <p class="info-detail">{{courseDatas.list[0].mold}}</p>
      </div>
      <div class="info-flex">
        <p class="info-title">课程状态</p>
        <p class="info-detail">{{courseDatas.list[0].state_name}}</p>
      </div>
      <div class="info-flex">
        <p class="info-title">签到时间</p>
        <p class="info-detail">{{courseDatas.list[0].sign_start}}-{{courseDatas.list[0].sign_end}}</p>
      </div>
      <div class="info-flex">
        <p class="info-title">授课时间</p>
        <p class="info-detail">{{courseDatas.list[0].lecture_start}}-{{courseDatas.list[0].lecture_end}}</p>
      </div>
      <div class="info-flex">
        <p class="info-title">上课地点</p>
        <p class="info-detail">{{courseDatas.list[0].addr}}</p>
      </div>
      <div style="padding: 40px 20px;" v-if="courseDatas.list[0].user_attend_cnt==0&&courseDatas.list[0].state_name!='已结束'">
        <x-button text="预约" @click.native="attend(1)" type="primary" style="height: 40px;font-size: 16px;"></x-button>
      </div>
      <div style="padding: 40px 20px;" v-if="courseDatas.list[0].user_attend_cnt>=1&&courseDatas.list[0].state_name!='已结束'">
        <x-button text="取消" @click.native="attend(-1)" type="warn" style="height: 40px;font-size: 16px;"></x-button>
      </div>
    </div>
    <toast v-model="isShow">{{toastText}}</toast>
  </div>
</template>
<script>
  import {XHeader, XButton, Toast} from 'vux'
  import {mapGetters} from 'vuex'
  import {LOCATION_DATA} from '../../config/sessionStorage'
  export default {
    components: {
      XHeader, XButton, Toast
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
        isShow: false
      }
    },
    methods: {
      attend (state) {
        let data = {
          attend_flag: state,
          course_id: this.courseDatas.list[0].id
        }
        this.$store.dispatch('attendCourse', data)
      },
      getData () {
        let qrCodeData = window.localStorage.getItem(LOCATION_DATA.QRCODE_DEPT)
        let temp = {
          dept_id: JSON.parse(qrCodeData).deptId,
          id: this.$route.params.id,
          page_number: 1,
          page_size: 1
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
