<template>
  <div class="home">
    <grid :cols="3" v-if="type=='home'">
      <grid-item v-for="(item, index) in homeData" :key="index" @click.prevent.native="gridClick(index)">
        <badge :text="msgNotify.list.length" v-if="index==3&&msgNotify.list.length>0" class="badge"></badge>
        <img :src="getImgSrc(item.icon)" class="image" slot="icon">
        <span class="grid-center">{{item.name}}</span>
      </grid-item>
    </grid>
    <grid :cols="4" v-if="type=='dept' && dept_department.obstetricsConfig">
      <grid-item v-for="(item, index) in dept_department.obstetricsConfig.menus" v-if="item.isSelect" :key="index" @click.prevent.native="gridClick(item)">
        <badge :text="msgNotify.list.length" v-if="item.value=='医生提醒'&&msgNotify.list.length>0" class="badge"></badge>
        <badge :text="unReadMsg" v-if="item.value=='专家咨询'&&unReadMsg>0" class="badge"></badge>
        <img :src="getImgSrc(deptIcon[item.key-1])" class="image" slot="icon">
        <span class="grid-center">{{item.value}}</span>
      </grid-item>
    </grid>
    <div v-transfer-dom>
      <alert v-model="isShowHint" title="提示">{{hintText}}</alert>
    </div>
  </div>
</template>

<script>
  import { Grid, GridItem, Alert, Badge, TransferDomDirective as TransferDom } from 'vux'
  import { mapGetters } from 'vuex'
  import { QUERY_NAME } from '../../config/Constant'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Grid, GridItem, Alert, Badge
    },
    computed: {
      ...mapGetters([
        'msgNotify',
        'dept_department',
        'unreadChatList'
      ])
    },
    watch: {
      unreadChatList (val) {
        this.unReadMsg = 0
        for (let i = 0; i < val.length; i++) {
          let str = this.unreadChatList[i].split('|')
          // str[0]:id,str[1]:type,str[2]:未读消息条数
          this.unReadMsg += Number(str[2])
        }
      }
    },
    props: {
      type: {
        type: String,
        default: 'home'
      }
    },
    data () {
      return {
        unReadMsg: 0,
        hintText: '此功能暂未开通，敬请期待！',
        isShowHint: false,
        homeData: [
          {
            name: '快速约床',
            path: '/booking',
            icon: 'ic_booking_bed.png'
          },
          {
            name: '保险在线',
            path: '/insurance/list',
            icon: 'ic_insurance.png'
          },
          {
            name: '医秘小助',
            path: '/home/yimi-service',
            icon: 'ic_service.png'
          },
          {
            name: '我的提醒',
            path: '/home/my-remind',
            icon: 'ic_remind.png'
          },
          {
            name: '家庭医生',
            path: '/user/case-his/healthRecords',
            icon: 'ic_family_doc.png'
          },
          {
            name: '绿色通道',
            path: '/commonContent/18',
            icon: 'ic_green_pip.png'
          }
        ],
        deptIcon: ['ic_inline_record.png', 'ic_doc_remind.png', 'ic_inline_register.png',
          'ic_expert_cons.png', 'ic_mom_school.png', 'ic_mom_group.png',
          'ic_safe_evaluat.png', 'ic_store.png', 'ic_dept_booking.png']
      }
    },
    methods: {
      getImgSrc (imgName) {
        return require('../../assets/' + imgName)
      },
      gridClick (val) {
        if (this.type === 'home') {
          if (val === 3) {
            if (!this.checkLogin()) return
          }
          if (val < 4) {
            this.$router.push({path: this.homeData[val].path})
          } else {
            this.isShowHint = true
            this.hintText = '此功能暂未开通，敬请期待！'
          }
        } else if (this.type === 'dept') {
          if (val.value === '在线建档') {
            // 在线建档
            this.$router.push({path: val.path, query: {id: this.$route.params.id, t: QUERY_NAME.DEPARTMENT}})
          } else if (val.value === '微商城' || val.value === '在线挂号') {
            this.$vux.alert.show({
              title: '提示',
              content: '此功能暂未开通，敬请期待'
            })
          } else {
            if (!this.checkLogin()) return
            if (val.value === '专家咨询' || val.value === '高危自评') {
              this.$router.push({path: val.path, query: {deptId: this.$route.params.id}})
            } else {
              this.$router.push({path: val.path})
            }
          }
        }
      },
      checkLogin () {
        if (!this.$auth.check()) {
          let _this = this
          this.$vux.alert.show({
            title: '提示',
            content: '您尚未登录, 请先登录再进行操作',
            onHide () {
              _this.$router.push({name: 'Login'})
            }
          })
          return false
        }
        return true
      }
    },
    mounted () {
      this.$nextTick(function () {
      })
    }
  }
</script>
<style lang="scss">
  @import "../../views/Home/style/home.scss";
</style>
