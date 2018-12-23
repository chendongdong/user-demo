<template>
  <div class="hos-main">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        意见反馈
      </x-header>
    </div>
    <group class="textArea">
      <x-textarea :max="200"
                  placeholder="为了更好的为你服务, 请尽量详细描述你意见和建议哦~"
                  v-model="suggestValue"
                  :height="200">
      </x-textarea>
    </group>
    <p style="margin:10px;">客服专线: 010-83035099</p>
    <div style=" font-size: 14px; padding: 10px">
      <x-button class="booking-btn" @click.native="suggest" type="primary" :disabled="isBtnDisabled" style="font-size: 16px">提交意见</x-button>
    </div>
    <toast v-model="toastMessage.isShow" type="text" width="20em">{{toastMessage.message}}</toast>
  </div>
</template>
<script>
  import { XHeader, XTextarea, Group, Toast, XButton } from 'vux'
  export default{
    components: {XHeader, XTextarea, Group, Toast, XButton},
    computed: {},
    data () {
      return {
        phone: '',
        suggestValue: '',
        toastMessage: {
          isShow: false,
          message: ''
        },
        isBtnDisabled: false
      }
    },
    methods: {
      suggest () {
        if (this.suggestValue === '') {
          this.openMsg('请输入您的意见')
        } else {
          this.isBtnDisabled = true
          this.$store.dispatch('suggest', {
            _this: this,
            data: {
              msg_content: this.suggestValue,
              msg_title: '意见反馈',
              phone: this.phone
            }
          })
        }
      },
      openMsg (msg) {
        this.toastMessage = {isShow: true, message: msg}
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.phone = this.$route.params.phone
      })
    }
  }
</script>
<style lang="scss">
  .hos-main {

  .mint-field-core {
    border: 1px;
  }

  .textArea {
    margin-top: 50px;
  }

  .booking-btn {
    position: fixed;
    bottom: 20px;
    width: 96%;
  }

  .weui-btn_disabled.weui-btn_primary {
    background-color: lightgray;
  }


  }
</style>
