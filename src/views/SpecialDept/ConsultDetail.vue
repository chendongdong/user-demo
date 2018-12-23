<template>
  <div class="yimi-service">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">{{docName}}</x-header>
    </div>
    <div class="app-content" @click.native="closePic" style="padding-top: 56px">
      <div class="chat-list" id="chatlist" :style="{'padding-bottom': marBottom}">
        <div v-for="(item, index) in chatList">
          <p style="text-align: center" v-if="item.sendTime"><span class="msg-time">{{item.sendTime}}</span></p>
          <div :class="item.isMyself?'custom':'service'">
            <div class="chat-msg" v-if="item.isMyself" style="margin-right: 10px"><p v-html="item.content">{{item.content}}</p><i></i></div>
            <div class="img-father">
              <img :src="$store.state.imgServer + item.img" class="img-msg" v-if="item.img">
              <img src="~assets/image/women.png" class="img-empty" v-else>
            </div>
            <!--<i class="fa fa-user-circle-o" style="color: orange;font-size: 40px;margin-left: 10px" v-else></i>-->
            <div class="chat-msg" v-if="!item.isMyself" style="margin-left: 10px"><p v-html="item.content">{{item.content}}</p><i></i></div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="auto-search" v-if="suggestionVisible">
          <ul>
            <li
              v-for="(item, index) in searchQAList"
              @click="select(item)"
              v-html="item.insurance_question">
            </li>
          </ul>
        </div>
        <div class="msg-input">
          <textarea id="textarea" v-model="msg" autofocus @click.stop.prevent="closePic"></textarea>
          <x-button mini type="primary" style="margin-right: 10px;height: 28px" @click.native="threadPoxi(msg)" v-if="msg">发送</x-button>
          <x-icon type="ios-plus-outline" size="30" style="margin-right: 10px;" @click="opetPic" v-if="!msg"></x-icon>
        </div>
        <div class="add-pic" v-show="isShowAdd">
          <input type="file" accept="image/*" style="opacity:0;position:absolute;width: 110px;height: 96px"
                 @change="upload" text="上传图片" id="avar-camera"/>
          <img src="~assets/image/pic1.png">
        </div>
      </div>
    </div>
    <previewer :list="img" ref="previewer" :options="previewerOptions"></previewer>
    <toast v-model="showHint" type="text" id="my-toast">发送内容不能为空</toast>
    <loading v-model="isLoadChatHis" text="加载中"></loading>
  </div>
  </div>
</template>
<script>
  import {XHeader, XButton, XInput, Group, XTextarea, XDialog, Toast, Confirm, Previewer, Loading} from 'vux'
  import CloneData from '../../utils/CloneData'
  import lrz from 'lrz'
  import HtmlCodeUtil from '../../utils/HtmlCodeUtil'
  import {mapGetters} from 'vuex'
  import moment from 'moment'
  import TextAreaUtil from '../../utils/textareaUtil'
  export default {
    components: {
      XHeader,
      XButton,
      XInput,
      Group,
      XTextarea,
      XDialog,
      Toast,
      Confirm,
      Previewer,
      Loading
    },
    computed: {
      ...mapGetters([
        'chatHistory',
        'isLoadChatHis'
      ]),
      // 发送图片地址
      getImg () {
        return this.$store.getters.imgUrl
      }
    },
    watch: {
      getImg (val) {
        if (val) {
          this.isShowAdd = false
          // 将img元素一起作为消息发送
          let img = '<img src=' + '"' + this.$store.state.imgServer + val + '">'
          this.threadPoxi(img)
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
      },
      chatHistory (val) {
        this.chatList = []
        CloneData.extend(this.chatList, val)
        for (let i = 0; i < this.chatList.length; i++) {
          // 将html转义标签转换成正常的标签
//          console.log('content--', this.chatList[i].content)
          this.chatList[i].content = HtmlCodeUtil.HTMLDecode(this.chatList[i].content)
          this.chatList[i].sendTime = moment(this.chatList[i].sendTime).format('YYYY年MM月DD日  HH:mm')
          if (this.chatList[i].fromId === Number(this.userId) && this.chatList[i].fromType === this.userType) {
            this.chatList[i].isMyself = true
          } else {
            this.chatList[i].isMyself = false
          }
//          console.log('HTMLDecode--content--', this.chatList[i].content)
        }
        let that = this
        setTimeout(function () {
          for (let i = 0; i < that.chatList.length; i++) {
            // 给每个消息div里面的img标签设置点击监听
            that.chatClick(i)
          }
          window.scrollTo(0, 900000)
        }, 500)
      },
      isShowAdd (val) {
        // 判断上传图片布局是否显示，动态设置聊天记录布局的margin值
        if (val) {
          this.marBottom = '150px'
        } else {
          this.marBottom = '50px'
        }
        setTimeout(function () {
          window.scrollTo(0, 900000)
        }, 50)
      },
      msg (val) {
        if (val) {
//          this.suggestionVisible = true
//          this.$store.dispatch('getSearchQA', {q: val})
        } else {
//          this.suggestionVisible = false
        }
      }
    },
    data () {
      return {
        toType: 2,
        docId: null,
        docName: null,
        suggestionVisible: false,
        isShowLogin: false,
        showHint: false,
        userId: '',
        userName: '',
        userType: 1,
        userHead: '',
        msg: '',
        websock: null,
        isShowAdd: false,
        chatList: [],
        textEle: null,
        marBottom: '50px',
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
      select (item) {
        this.suggestionVisible = false
        let question = {
          fromType: -1,
          content: HtmlCodeUtil.HTMLDecode(item.insurance_question)
        }
        let answer = {
          fromType: 0,
          content: '自动回复：' + HtmlCodeUtil.HTMLDecode(item.insurance_answer)
        }
        this.chatList.push(question)
        this.chatList.push(answer)
        this.msg = ''
        setTimeout(function () {
          window.scrollTo(0, 900000)
        }, 50)
      },
      hideDialog () {
        // 怎么保存页面当前位置，不要滚动
        setTimeout(function () {
          window.scrollTo(0, 900000)
        }, 50)
      },
      onConfirm () {
        this.$router.push({name: 'Login'})
      },
      chatClick (i) {
        if (i < 0) return
        // 获取第i个消息的div
        let divMsg = document.getElementsByClassName('chat-msg')[i]
//        if (!divMsg || !divMsg.getElementsByTagName) return
        // 获取该div下的所有img标签
        let imgList = divMsg.getElementsByTagName('img')
        for (let i = 0; i < imgList.length; i++) {
          this.img.push({src: imgList[i].src})
          let that = this
          // 给img标签设置点击监听
          imgList[i].className = 'image'
          imgList[i].addEventListener('click', function (e) {
            let srcIdx
            for (let j = 0; j < that.img.length; j++) {
              if (that.img[j].src === imgList[i].src) {
                srcIdx = j
                break
              }
            }
            that.recimg(srcIdx)
          })
        }
      },
      // 点击消息中的图片时，将图片放大
      recimg (index) {
        this.$refs.previewer.show(index)
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
      },
      opetPic () {
        this.isShowAdd = !this.isShowAdd
      },
      closePic () {
        this.isShowAdd = false
      },
      // 发送消息逻辑
      threadPoxi (sendMsg) {
        if (sendMsg.trim()) {
          // 若是ws开启状态
          if (this.websock.readyState === this.websock.OPEN) {
            this.websocketsend(sendMsg)
          } else if (this.websock.readyState === this.websock.CONNECTING) {
            // 若是 正在开启状态，则等待300毫秒
            let that = this// 保存当前对象this
            setTimeout(function () {
              that.websocketsend(sendMsg)
            }, 300)
          } else {
            // 若未开启 ，则等待500毫秒
            this.initWebSocket()
            let that = this // 保存当前对象this
            setTimeout(function () {
              that.websocketsend(sendMsg)
            }, 500)
          }
        } else {
          this.showHint = true
          this.msg = ''
          let t = document.getElementById('my-toast').getElementsByTagName('div')
          if (t.length > 1) {
            t[1].style.width = '200px'
          }
        }
      },
      // 初始化websocket,连接服务器
      initWebSocket () {
        // ws地址
        const wsuri = this.$store.state.webSocketServer + 'myHandler?userid=' + this.userId + '&username=' +
          this.userName + '&usertype=' + this.userType + '&chattype=' + this.toType
//        console.log('wsuri=', wsuri)
        this.websock = new window.WebSocket(wsuri)
        // 服务器返回消息回调，（发送的消息也会返回到这里）
        this.websock.onmessage = this.websocketonmessage
        // 关闭连接回调
        this.websock.onclose = this.websocketclose
      },
      // 接收到服务的消息
      websocketonmessage (e) {
        // fromType： -1游客，0客服，1用户，2医生，3业务员,4群聊
        const redata = JSON.parse(e.data)
//        console.log('redata=', redata)
        let userInfo = redata.identity.split('|')
        let msgContent = HtmlCodeUtil.HTMLDecode(redata.content)
        let time = redata.time.split(' ')[1].split(':')
        let temp = {
          img: redata.img,
          fromType: userInfo[2],
          content: msgContent,
          sendTime: time[0] + ':' + time[1]
        }
        if (Number(userInfo[0]) === Number(this.userId) && Number(userInfo[2]) === this.userType) {
          temp.isMyself = true
        } else {
          temp.isMyself = false
        }
        this.chatList.push(temp)
        this.msg = ''
        this.textEle.focus()
        this.textEle.currHeight = parseInt('28px')
        this.textEle.value = ''
        let that = this
        setTimeout(function () {
          that.chatClick(that.chatList.length - 1)
          window.scrollTo(0, 900000)
        }, 500)
      },
      // 发送消息
      websocketsend (sendMsg) {
        let message = {
          from_identity: this.userId + '|' + this.userName + '|' + this.userType + '|' + this.toType,
          to_identity: this.docId + '|' + this.docName + '|' + this.toType + '|' + this.userType,
          content: sendMsg,
          img: this.userHead
        }
//        console.log('message==', message)
        this.websock.send(JSON.stringify(message))
      },
      websocketclose (e) {
        console.log('connection closed (' + e.code + ')')
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.docId = this.$route.params.docId
        this.docName = this.$route.params.docName
        this.$store.dispatch('clearImg')
        this.textEle = document.getElementById('textarea')
        TextAreaUtil.autoTextarea(this.textEle, 0, 100) // 调用
        this.userId = this.$auth.user().user_id
        this.userName = this.$auth.user().user_name
        this.userHead = this.$auth.user().user_pic
        let temp = {
          from_identity: this.userId + '|' + this.userName + '|' + this.userType + '|' + this.toType,
          to_identity: this.docId + '|' + this.docName + '|' + this.toType + '|' + this.userType
        }
        // 获取登录用户的历史消息
        this.$store.dispatch('getChatHis', temp)
        this.initWebSocket()
      })
    },
    beforeDestroy () {
      let temp = {
        currentUserId: this.userId,
        fromUserId: this.docId
      }
      this.$store.dispatch('setMsgRead', temp)
    }
  }
</script>
<style lang="scss">
  @import "../Home/style/service.scss";
</style>
