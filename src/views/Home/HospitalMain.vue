<template>
  <div class="hos-main">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">{{hos.hospital_name}}</x-header>
    </div>
    <div class="app-content">
      <div class="hos-header-image-bg">
        <img class="hos-header-image" :src="hos.hospital_img ? imgServer + hos.hospital_img : ''" alt="">
      </div>
      <div class="hos-content-card" style="padding-bottom: 36px;">
        <div class="h-title-bg">
          <span class="h-title"><span class="h-title-img">❐</span>简介</span>
        </div>
        <div></div>

        <div :class="[(isShowMoreDes || !description)? showMoreDesClass : normalDesClass]" ref="hosDes" id="hosDes" v-html="description" style="padding: 10px 8px;color: #666"></div>
        <x-button class="pull-right more-button"
                  :class="[isShowMoreDes ? tranButtonClass : '']"
                  type="default"
                  mini
                  @click.native="showMoreDes"
                  style="color: #666;"
                  v-show="description && description.length > 80">展开
        </x-button>
      </div>
      <div class="hos-content-card h-content">
        <span style="color: #666">电话：<a :href="'tel:' + hos.hospital_tel" class="h-text">{{hos.hospital_tel}}</a></span><br>
        <span style="color: #666">网址：<a :href="hos.website" class="h-text">{{hos.website}}</a></span><br>
        <span style="color: #666">地址：<span class="h-text">{{hos.address}}</span></span><br>
      </div>
      <div class="hos-content-card">
        <div class="h-title-bg">
          <span class="h-title"><span class="h-title-img">❐</span>医院科室</span><br>
        </div>
        <flexbox :gutter="0" wrap="wrap" class="hos-content-flex" style="padding: 8px 0">
          <flexbox-item :span="1/3" v-for="(item, idx) in allDepts" :key="item.id">
            <div class="content-flex-dept" @click="jump2Dept(item.id)" style="text-align: center;color: #838FA1">{{item.name}}</div>
          </flexbox-item>
        </flexbox>
      </div>

      <div class="hos-content-card recommend-title" v-show="docs.length>0">
        <div class="h-title-bg">
          <p class="h-title" style="font-size: 14px;line-height: 2">
            <span class="h-title-img">❐</span>推荐医生
            <span class="more-doc" @click="showMoreDoc">更多</span>
          </p>
        </div>
        <div class="recommed-doc">
          <div class="doc-item" v-for="(doc, idx) in docs" v-show="idx<4" @click="docClick(doc.doctor.id)">
            <img class="doc-head" :src="imgServer + doc.doctor.picture" alt="">
            <p style="color: #333;">{{doc.doctor.name}}</p>
            <p style="color:#888;font-size: 12px">{{doc.doctor.position_name}}</p>
            <p style="color:#888;font-size: 12px;">{{doc.doctor.dept_name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import PanelCard from '../../components/panel-card'
  import { XHeader, Tab, TabItem, Cell, XDialog, XButton, Flexbox, FlexboxItem } from 'vux'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      PanelCard, XHeader, Tab, TabItem, Cell, XDialog, XButton, Flexbox, FlexboxItem
    },
    computed: {
      ...mapGetters({
//        hos: 'hos_hospital',
        docs: 'hos_doctor_list',
        depts: 'hos_departments',
        point_depts: 'hos_point_dept'
      }),
      hos () {
        let hos = this.$store.getters.hos_hospital
        // 将html转义标签转换成正常的标签, 不能直接修改getter数据，会报错
        this.description = this.HTMLDecode(hos.hospital_description)
        return hos
      },
      allDepts () {
        if (this.depts && this.depts.length > 0) {
          let deptList = []
          this.depts.forEach(function (d) {
            if (d.depts) {
              d.depts.forEach(function (subDept) {
                deptList.push(subDept)
              })
            }
          })
          return deptList
        }
      }
    },
    data () {
      return {
        description: '',
        imgServer: '',
        isShowMoreDes: false,
        showMoreDesClass: 'hos-address-content-more',
        normalDesClass: 'hos-address-content',
        tranButtonClass: 'tran-button'
      }
    },
    methods: {
      jump2Dept (id) {
        this.$router.push({name: 'DeptMain', params: {deptId: id}})
      },
      showMoreDes () {
        this.isShowMoreDes = !this.isShowMoreDes
      },
      showMoreDoc () {
        this.$router.push({name: 'RecomDoctor', query: {type: 'hos', id: this.hos.hospital_id}})
      },
      docClick (id) {
        this.$router.push({name: 'DocDetail', params: {docId: id}})
      },
      // 将标签转义码转换成html标签
      HTMLDecode (text) {
        let temp = document.createElement('div')
        temp.innerHTML = text
        let output = temp.innerText || temp.textContent
        temp = null
        return output
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        let path = this.$route.path
        let id = this.$route.params.hosId
        if (path.indexOf('hospital-main-home') > 0) {
          this.$store.dispatch('getEncrypHos', id)
        } else {
          this.$store.dispatch('getHospital', id)
        }
        this.imgServer = this.$store.state.imgServer
      })
    }
  }
</script>
<style lang="scss">
  @import "style/hospital-main.scss";
</style>
