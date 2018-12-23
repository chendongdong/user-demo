<template>
  <div class="detail">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">转诊详情</x-header>
    </div>
    <div class="app-content">
      <span class="state">{{transDetail.transfer_state}}</span>
      <group title="转诊人信息" style="margin-top: 20px">
        <p class="item">{{transDetail.patient_name}} {{transDetail.patient_gender}} {{transDetail.patient_grow_age}}</p>
        <p class="item">手机号码：{{transDetail.patient_phone}}</p>
      </group>
      <group title="患者疾病信息">
        <p class="item">诊断名称：{{transDetail.transfer_diagnostic}}</p>
        <p class="item">描述：{{transDetail.priorities}}</p>
        <!--<p class="item">转诊类型：{{transDetail.transfer_type}}</p>-->
        <div class="item">
          病历说明：{{transDetail.patient_reason}}
        </div>
        <div class="item">
          病历图片：
          <div clas="flex-img">
            <img class="image" v-for="(img, idx) in transDetail.medical_pics" :src="$store.state.imgServer + img.url"
                 @click="magnifyImg(idx)">
          </div>
        </div>
        <div style="text-align: right;margin: 10px 20px">
          <x-button text="添加病历图片" mini @click.native="addImg" style="font-size:15px;padding: 0 10px"
                    type="primary"></x-button>
        </div>
      </group>
      <group title="转入机构信息">
        <p class="item">医院：{{transDetail.hos_name}}</p>
        <p class="item">科室：{{transDetail.dept_name}}</p>
        <p class="item">医生：{{transDetail.recipient_doctor_name}}</p>
      </group>
      <group title="转出机构信息">
        <p class="item">医院：{{transDetail.transfer_doctor_hos_name}}</p>
        <p class="item">科室：{{transDetail.transfer_doctor_dept_name}}</p>
        <p class="item">医生：{{transDetail.transfer_doctor_name}}</p>
      </group>
      <p class="item">转出时间：{{transDetail.created}}</p>
      <div style="padding:30px; max-width:90%;" v-if="transDetail.transfer_state=='待处理'">
        <x-button text="取消" @click.native="cancelTrans" style="font-size:15px;" type="primary"></x-button>
      </div>
    </div>
    <x-dialog v-model="isMagnifyImg" :hide-on-blur="true">
      <img :src="$store.state.imgServer + imgUrl" style="width: 100%;height:100%">
      <span class="vux-close" @click="isMagnifyImg=false"></span>
    </x-dialog>
    <previewer :list="img" ref="previewer" :options="previewerOptions"></previewer>
    <toast v-model="showHint" type="text">{{getRet}}</toast>
  </div>
</template>
<script>
  import {XHeader, XInput, Group, XButton, Toast, XDialog, Previewer} from 'vux'
  export default {
    components: {
      XHeader,
      XInput,
      Group,
      XButton,
      Toast,
      XDialog,
      Previewer
    },
    computed: {
      getRet () {
        let data = this.$store.getters.transMsg
        if (data) {
          this.showHint = true
          this.$store.dispatch('clearTransMsg')
        }
        return data
      },
      transDetail () {
        return this.$store.getters.transDetail
      }
    },
    watch: {
      transDetail (val) {
        if (val.medical_pics) {
          for (let i = 0; i < val.medical_pics.length; i++) {
            this.img.push({src: this.$store.state.imgServer + val.medical_pics[i].url})
          }
        }
      }
    },
    data () {
      return {
        showHint: false,
        id: 0,
        type: 0,
        isMagnifyImg: false,
        imgUrl: '',
        img: [],
        previewerOptions: {
          getThumbBoundsFn (index) {
            let thumbnail = window.document.querySelectorAll('.image')[index]
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            let rect = thumbnail.getBoundingClientRect()
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          }
        }
      }
    },
    methods: {
      addImg () {
        this.$router.push({name: 'AddCaseImg', params: {id: this.id, type: this.type}})
      },
      magnifyImg (index) {
//        this.isMagnifyImg = true
//        this.imgUrl = url
        this.$refs.previewer.show(index)
      },
      cancelTrans () {
        let data = {
          id: this.id,
          type: this.type
        }
        this.$store.dispatch('userTransCanel', data)
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.id = this.$route.params.id
        this.type = this.$route.params.type
        let data = {
          id: this.id,
          type: this.type
        }
        this.$store.dispatch('getTransDetail', data)
      })
    }
  }
</script>
<style lang="scss">
  @import "style/detail.scss";
</style>

