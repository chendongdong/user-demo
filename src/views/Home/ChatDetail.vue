<template>
  <div class="yimi-service">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">咨询详情</x-header>
    </div>
    <div class="app-content" @click.native="closePic" style="padding-top: 56px">
      <div class="chat-list" id="chatlist" :style="{'padding-bottom': marBottom}">
        <div v-for="(item, index) in chatList">
          <p style="text-align: center" v-if="item.sendTime"><span class="msg-time">{{item.sendTime}}</span></p>
          <div class="service" v-if="item.fromType==0">
            <div class="img-father" style="margin-right: 10px">
              <img src="~assets/image/service_tran.png" class="img-msg">
            </div>
            <div class="chat-msg"><p v-html="item.content"></p><i></i></div>
          </div>
          <div class="custom" v-else>
            <!--<div v-html="item.content" class="chat-msg"></div>-->
            <div class="chat-msg"><p v-html="item.content"></p><i></i></div>
            <div class="img-father" v-if="userHead" style="margin-left: 10px">
              <img :src="userHead" class="img-msg">
            </div>
            <i class="fa fa-user-circle-o" style="color: orange;font-size: 40px;margin-left: 10px" v-else></i>
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
    <!--<x-dialog v-model="isMagnifyImg" :hide-on-blur="true" @on-hide="hideDialog">-->
      <!--<img :src="imgUrl" style="width: 100%;height:100%">-->
      <!--<span class="vux-close" @click="isMagnifyImg=false"></span>-->
    <!--</x-dialog>-->
    <confirm v-model="isShowLogin"
             @on-confirm="onConfirm">
      <p style="text-align:center;">您尚未登录，将不会保存聊天记录，马上去登录</p>
    </confirm>
    <div style="display: none">{{chatHistory}}</div>
    <previewer :list="img" ref="previewer" :options="previewerOptions"></previewer>
    <toast v-model="showHint" type="text" id="my-toast">发送内容不能为空</toast>
  </div>
</template>
<script>
  import {XHeader, XButton, XInput, Group, XTextarea, XDialog, Toast, Confirm, Previewer} from 'vux'
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
      Previewer
    },
    data: function () {
      return {
        toType: 0,
        suggestionVisible: false,
        isShowLogin: false,
        showHint: false,
        imgUrl: '',
        isMagnifyImg: false,
        userId: '012345678912',
        userName: '游客',
        userType: '-1',
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
    computed: {
      ...mapGetters([
        'chatHistory',
        'searchQAList',
        'isLoadChatQue',
        'isLoadChatHis',
        'serviceNum'
      ]),
      // 发送图片地址
      getImg () {
        return this.$store.getters.imgUrl
      }
    },
    watch: {
      serviceNum (val) {
        if (val && this.$auth.check()) {
          this.getHistory()
        }
      },
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
          this.chatList[i].content = HtmlCodeUtil.HTMLDecode(this.chatList[i].content)
          this.chatList[i].sendTime = moment(this.chatList[i].sendTime).format('YYYY年MM月DD日  HH:mm')
        }
        let that = this
        setTimeout(function () {
          for (let i = 0; i < that.chatList.length; i++) {
              // 给每个消息div里面的img标签设置点击监听
            that.chatClick(i)
          }
          window.scrollTo(0, 900000)
        }, 50)
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
          this.suggestionVisible = true
          this.$store.dispatch('getSearchQA', {q: val})
        } else {
          this.suggestionVisible = false
        }
      }
    },
    methods: {
      getHistory () {
        let temp = {
          from_identity: this.userId + '|' + this.userName + '|' + this.userType + '|' + this.toType,
          to_identity: this.serviceNum + '|client|' + this.toType + '|' + this.userType
        }
        // 获取登录用户的历史消息
        this.$store.dispatch('getChatHis', temp)
      },
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
//        this.isMagnifyImg = true
//        this.imgUrl = url
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
        const wsuri = this.$store.state.webSocketServer + 'myHandler?userid=' + this.userId +
          '&username=' + this.userName + '&usertype=' + this.userType + '&chattype=' + this.toType
        this.websock = new window.WebSocket(wsuri)
        // 服务器返回消息回调，（发送的消息也会返回到这里）
        this.websock.onmessage = this.websocketonmessage
        // 关闭连接回调
        this.websock.onclose = this.websocketclose
      },
      // 接收到服务的消息
      websocketonmessage (e) {
        // fromType： -1游客，0客服，1用户，2医生，3业务员
        const redata = JSON.parse(e.data)
//        console.log('redata=', redata)
        let userInfo = redata.identity.split('|')
        let msgContent = HtmlCodeUtil.HTMLDecode(redata.content)
        let time = redata.time.split(' ')[1].split(':')
        let temp = {
          fromType: userInfo[2],
          content: msgContent,
          sendTime: time[0] + ':' + time[1]
        }
        this.chatList.push(temp)
        this.msg = ''
        this.textEle.focus()
        this.textEle.currHeight = parseInt('28px')
        this.textEle.value = ''
        let that = this
        setTimeout(function () {
          window.scrollTo(0, 900000)
          that.chatClick(that.chatList.length - 1)
        }, 500)
      },
      // 发送消息
      websocketsend (sendMsg) {
        let message = {
          from_identity: this.userId + '|' + this.userName + '|' + this.userType + '|' + this.toType,
          to_identity: this.serviceNum + '|client|' + this.toType + '|' + this.userType,
          content: sendMsg
        }
//        console.log('message==', message)
        this.websock.send(JSON.stringify(message))
      },
      websocketclose (e) {
        console.log('connection closed (' + e.code + ')')
      },
      generateMixed (n) {
        let res = ''
        for (let i = 0; i < n; i++) {
          res += Math.floor(Math.random() * 10)
        }
        return res
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.$store.dispatch('getServiceNum')
        this.$store.dispatch('clearImg')
        this.textEle = document.getElementById('textarea')
        TextAreaUtil.autoTextarea(this.textEle, 0, 100) // 调用
//        this.textEle.focus()
        // 判断是否是登录用户
        if (this.$auth.check()) {
          this.userId = this.$auth.user().user_id
          this.userName = this.$auth.user().user_name
          this.userType = 1
          this.userHead = this.$store.state.imgServer + this.$auth.user().user_pic
          if (this.serviceNum) {
            this.getHistory()
          }
        } else {
          this.isShowLogin = true
            // 获取随机数用户id，12位数字
          this.userId = this.generateMixed(12)
        }
        this.initWebSocket()
        // 未完善：1.上传图片点击代理 2.消息过长，有时候头像被压扁，刷新又恢复正常 3. 上传图片较大时，压缩图片出异常 4. 消息边框尖角
        // 遇到难解决问题： 1. textarea 动态设置高度，并且内容致空时恢复默认高度
        // 2. 控制输入的内容不能为空 msg.trim() 方法
        // 3. 批量给img标签设置点击监听，每个消息可能有多张图片
        // 4. 将html反义字符，转换成html标签，再通过v-html解析标签并显示出来
        // 5. 设置页面滚动到底部，window.scrollTo(0, 900000)，js数据变化后要延迟一点设置该属性，因为需要等html渲染完成
      })
    }
  }
</script>

<style lang="scss">
  @import "style/service.scss";
</style>

