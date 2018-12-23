<template>
  <div class="case">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        添加病历图片
        <span slot="right" class="save" @click="submitImg">保存</span>
      </x-header>
    </div>
    <div class="app-content">
      <div class="flex-img" style="margin-left: 15px;">
        <div v-for="(img, index) in imgList">
          <img class="image" :src="img_srv + img" @click="magnifyImg(index)">
          <icon type="clear" class="delete-img" @click.native="deleteImg(index)"></icon>
        </div>
        <div class="add-pic">
          <input class="image" type="file" accept="image/*" style="opacity:0;position:absolute;"
                 @change="upload" text="上传图片" id="avar-camera"/>
          <img src="~assets/add.png" class="image">
        </div>
      </div>
    </div>

    <x-dialog v-model="isMagnifyImg" :hide-on-blur="true">
      <img :src="img_srv + imgUrl" style="width: 100%;height:100%">
      <span class="vux-close" @click="isMagnifyImg=false"></span>
    </x-dialog>
    <div style="display: none">{{getImg}}</div>
    <toast v-model="showHint" type="text">{{getRet}}</toast>
    <loading v-model="showLoadding" text="正在提交..."></loading>
    <previewer :list="img" ref="previewer" :options="previewerOptions"></previewer>
  </div>
</template>
<script>
  import {XHeader, XButton, Group, Cell, XInput, Toast, XDialog, Icon, Loading, Previewer} from 'vux'
  import lrz from 'lrz'
  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      XInput,
      Toast,
      XDialog,
      Icon,
      Loading,
      Previewer
    },
    computed: {
      getImg () {
        return this.$store.getters.imgUrl
      },
      getRet () {
        this.showLoadding = false
        let data = this.$store.getters.transMsg
        if (data) {
          this.showHint = true
          this.$store.dispatch('clearTransMsg')
        }
        return data
      }
    },
    watch: {
      getImg (val) {
        if (val) {
          this.imgList.push(val)
          this.img.push({src: this.img_srv + val})
          // 清除input数据
          let file = document.getElementById('avar-camera')
          // 清除file数据
          file.value = ''
          if (file.outerHTML) {
            file.outerHTML = file.outerHTML
          }
          // 清空后替换旧节点
          let imgDiv = document.getElementsByClassName('add-pic')[0]
          imgDiv.replaceChild(file, imgDiv.firstChild)
        }
      }
    },
    data () {
      return {
        showLoadding: false,
        showHint: false,
        imgList: [],
        isMagnifyImg: false,
        imgUrl: '',
        id: 0,
        type: 0,
        img_srv: '',
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
      submitImg () {
        this.showLoadding = true
        let data = {
          id: this.id,
          type: this.type,
          images: {
            urls: this.imgList
          }
        }
        this.$store.dispatch('addTranImg', data)
        this.imgList = []
        this.img = []
      },
      deleteImg (idx) {
        this.imgList.splice(idx, 1)
        this.img.splice(idx, 1)
      },
      magnifyImg (index) {
        this.$refs.previewer.show(index)
//        this.isMagnifyImg = true
//        this.imgUrl = url
      },
      upload (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        this.createImage(files[0])
      },
      /**
       * 获取到图片, 并处理, 上传
       */
      createImage (file) {
        if (typeof FileReader === 'undefined') {
          this.alertMessage = {isShow: true, message: '请升级您的浏览器'}
          return false
        }
        //   接受 jpeg, jpg, png 类型的图片
        if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) return

        if (file.size <= 1 * 1024 * 1024) {
          let formD = new window.FormData()
          formD.append('image', file)
          this.$store.dispatch('loadImg', formD)
          return
        }

        /**
         * 使用lrz插件对图片进行压缩处理
         * 用法: https://github.com/think2011/localResizeIMG
         */
        const _this = this
        lrz(file, {width: 200, height: 200, quality: 1}).then(function (rst) {
          //   处理成功会执行
          let formData = new window.FormData()
          formData.append('image', rst.base64)
          _this.$store.dispatch('base64StrImage', formData)
        }).catch(function () {
          //   处理失败会执行
          _this.$vux.alert.show({title: '提示', content: '图片上传失败, 请重试!'})
        }).always(function () {
          //   不管是成功失败，都会执行
        })
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.img_srv = this.$store.state.imgServer
        this.$store.dispatch('clearImg')
        this.id = this.$route.params.id
        this.type = this.$route.params.type
      })
    }
  }
</script>
<style lang="scss">
  @import "CaseHistory/style/case.scss";
</style>
