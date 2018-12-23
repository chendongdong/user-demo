<template>
  <div class="user-modify">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        {{title}}
        <span slot="right" class="save" @click="saveBtn" v-show="this.type!=6">保存</span>
      </x-header>
    </div>
    <div class="app-content">
      <group v-show="showAge">
        <calendar v-model="bornDate" title="请选择出生日期" disable-future></calendar>
      </group>
      <group v-show="showGender">
        <cell title="点击选择性别" @click.native="onClick">{{gender}}</cell>
        <actionsheet v-model="show1" :menus="menus1" @on-click-menu="click" show-cancel></actionsheet>
      </group>
      <group v-show="showPhoto">
        <div style="text-align: center">
          <img :src="userInfoCpu" @click='isShowImg = true' class="img-head"/>
          <div style="margin: 20px;">
            <input type="file" name="videoUrl" @change="onFileChange" class="input-file">
            <input type="text" value="上传图片" readonly="readonly" class="input-text">
          </div>
        </div>
      </group>
      <!--查看大图-->
      <div class="manage-group">
        <x-dialog v-model="isShowImg" title="">
          <span class="close-dialog" @click="isShowImg=false"></span>
          <img :src="userInfoCpu" style="width: 100%;height:100%;margin-bottom:-10px;">
        </x-dialog>
      </div>
      <toast v-model="showRes">修改成功</toast>
      {{retuenMsgCpu}}
    </div>
  </div>
</template>
<script>
  import { Group, Cell, Calendar, Toast, XHeader, Actionsheet, XDialog } from 'vux'
  import lrz from 'lrz'

  export default {
    components: {Group, Cell, Calendar, Toast, XHeader, Actionsheet, XDialog},
    data () {
      return {
        title: '修改信息',
        type: 0,
        showAge: false,
        showGender: false,
        showWork: false,
        valueGender: '',
        valueAge: '',
        valueWork: '',
        options: [
          {
            label: '男',
            value: '1'
          },
          {
            label: '女',
            value: '0'
          }
        ],
        bornDate: '',
        showRes: false,
        showPhoto: false,
        imagePath: '',
        userInfo: {},
        right: true,
        show1: false,
        menus1: {
          menu1: '男',
          menu2: '女'
        },
        gender: '',
        isShowImg: false
      }
    },
    methods: {
      saveBtn () {
        if (this.type === '1') {
          let payload = {
            born_date: this.bornDate
          }
          this.$store.dispatch('editUser', payload)
        } else if (this.type === '2') {
          let payload = {
            gender: this.valueGender
          }
          this.$store.dispatch('editUser', payload)
        }
      },
      onClick () {
        this.show1 = true
      },
      click (item) {
        if (item === 'menu1') {
          this.gender = '男'
          this.valueGender = 1
        } else if (item === 'menu2') {
          this.gender = '女'
          this.valueGender = 0
        }
      },
      /**
       * input的change方法
       */
      onFileChange (e) {
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
      this.$store.dispatch('clearImg')
      this.type = this.$route.params.type
      this.$store.dispatch('getUser')
      if (this.type === '1') {
        this.title = '修改年龄'
        this.showAge = true
      } else if (this.type === '2') {
        this.valueGender = this.$store.getters.userData.gender.toString()
        this.title = '修改性别'
        this.showGender = true
      } else if (this.type === '5') {
        this.title = '修改职业'
        this.showWork = true
      } else if (this.type === '6') {
        this.title = '修改头像'
        this.showPhoto = true
        this.right = false
        this.userInfo = this.$auth.user()
      }
    },
    computed: {
      retuenMsgCpu: function () {
        if (this.$store.getters.returnMsg === '成功' || this.$store.getters.returnMsg === '修改成功') {
          this.$auth.fetch()
          this.showRes = true
          clearTimeout(timer)
          var timer = setTimeout(() => {
            this.$store.dispatch('clearUserMsg')
            this.$router.push({name: 'UserInformation'})
          }, 2000)
        }
      },
      userInfoCpu: function () {
        let ret = this.$store.getters.imgUrl
        if (ret !== '') {
          this.userInfo.user_pic = ret
          let userPicture = {
            user_pic: this.userInfo.user_pic
          }
          this.$store.dispatch('editUser', userPicture)
          this.$store.dispatch('clearImg')
        }
        return this.$store.state.imgServer + this.userInfo.user_pic
      }
    }
  }
</script>
<style lang="scss">
 @import "style/modify_info.scss";
</style>
