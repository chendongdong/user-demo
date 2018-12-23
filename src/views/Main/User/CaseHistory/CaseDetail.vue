<template>
  <div class="case-detail">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        病历详情
      </x-header>
    </div>
    <div class="app-content">
      <p>诊治时间：{{oneCaseInfo.occur_time}}</p>
      <p>医院：{{oneCaseInfo.hos_name}}</p>
      <p>科室：{{oneCaseInfo.dept_name}}</p>
      <p>诊断：{{oneCaseInfo.diagnosis}}</p>
      <p>是否住院：
      <span v-if="oneCaseInfo.type_hospitalization==1">是</span>
      <span v-if="oneCaseInfo.type_hospitalization==0">否</span>
      </p>
      <p>是否手术：
        <span v-if="oneCaseInfo.type_operation==1">是</span>
        <span v-if="oneCaseInfo.type_operation==0">否</span>
      </p>
      <p>手术名(如有)：{{oneCaseInfo.remarks}}</p>
      <p>病历图片：</p>
      <div clas="flex-img">
        <img class="image" v-for="(img, index) in oneCaseInfo.images" :src="$store.state.imgServer + img.url" @click="magnifyImg(index)">
      </div>
      <div style="padding:30px; max-width:90%;">
        <x-button text="编辑病历" @click.native="jump" style="font-size:15px;" type="primary"></x-button>
      </div>
    </div>
    <x-dialog v-model="isMagnifyImg" :hide-on-blur="true">
      <img :src="$store.state.imgServer + imgUrl" style="width: 100%;height:100%">
      <span class="vux-close" @click="isMagnifyImg=false"></span>
    </x-dialog>
    <previewer :list="img" ref="previewer" :options="previewerOptions"></previewer>
  </div>
</template>
<script>
  import {XHeader, XButton, Group, Cell, XInput, Toast, XDialog, Previewer} from 'vux'
  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      XInput,
      Toast,
      XDialog,
      Previewer
    },
    computed: {
      oneCaseInfo () {
        return this.$store.getters.oneCaseInfo
      }
    },
    watch: {
      oneCaseInfo (val) {
        if (val.images) {
          for (let i = 0; i < val.images.length; i++) {
            this.img.push({src: this.$store.state.imgServer + val.images[i].url})
          }
        }
      }
    },
    data () {
      return {
        isMagnifyImg: false,
        imgUrl: '',
        img: [],
        previewerOptions: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = window.document.querySelectorAll('.image')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    methods: {
      magnifyImg (index) {
        this.$refs.previewer.show(index)
//        this.isMagnifyImg = true
//        this.imgUrl = url
      },
      jump () {
        this.$router.push({name: 'NewCase'})
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        let id = this.$route.params.id
        this.$store.dispatch('getOneCase', id)
      })
    }
  }
</script>

<style lang="scss">
  .case-detail{
    .app-content{
      p{
        padding: 6px 20px;
        font-size: 15px;
      }
    }
  .flex-img{
    display: flex;
    flex-wrap: wrap;
  }
  .image {
    width: 100px;
    height: 100px;
    margin-left: 16px;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    overflow: hidden;
    color: #ccc;
  &:after,&:before{
             content: '';
             position: absolute;
             height: 1px;
             width: 100%;
             top: 50%;
             left: 0;
             background: #98979d;
           }
  &:before{
     transform: rotate(45deg);
   }
  &:after{
     transform: rotate(-45deg);
   }
  }
  }
</style>

