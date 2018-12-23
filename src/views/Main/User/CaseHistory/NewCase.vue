<template>
  <div class="case">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        {{title}}
        <span slot="right" class="save" @click="saveCase">保存</span>
      </x-header>
    </div>
    <div class="app-content">
      <group>
        <calendar v-model="diaTime" title="诊断时间" disable-future></calendar>
        <cell title="地区" is-link :value="addressValue" @click.native="showArea"></cell>
        <cell title="医院" is-link @click.native="jump2Hos" :value="selectHos.hosName"></cell>
        <cell title="科室" is-link @click.native="jump2Dept" :value="selectDept.department_name"></cell>
      </group>

      <group>
        <x-input type="text" title="诊断：" placeholder="请输入诊断名称" v-model="diagnosis"></x-input>
      </group>
      <div class="radio" style="padding: 20px">
        是否住院：
        <div v-for="(item, index) in radioList">
          <input class="sex-input" :name="'hos'+index" type="radio" :value="index" v-model="isHos"/>{{item}}
        </div>
      </div>
      <div class="radio" style="padding: 0 20px">
        是否手术：
        <div v-for="(item, index) in radioList">
          <input class="sex-input" :name="'surgery'+index" type="radio" :value="index" v-model="isSurgery"/>{{item}}
        </div>
      </div>
      <group>
        <x-input type="text" title="手术名(如有)：" placeholder="请输入手术名" v-model="surgeryName"></x-input>
      </group>
    </div>

    <div class="load-img">病历图片：
      <div class="flex-img">
        <div v-for="(img, index) in imgList">
          <img class="image" :src="img_srv + img.url" @click="magnifyImg(index)">
          <icon type="clear" class="delete-img" @click.native="deleteImg(index)"></icon>
        </div>
        <div class="add-pic">
          <input class="image" type="file" accept="image/*" style="opacity:0;position:absolute;"
                   @change="upload" text="上传图片" id="avar-camera"/>
          <img src="~assets/add.png" class="image">
        </div>
      </div>
    </div>


    <div class="booking-picker-popup">
      <popup v-model="isShowPicker">
        <div class="operate-button">
          <span class="picker-cancel" @click="pickerCancel">取消</span>
          <span class="picker-conform" @click="pickerConform">确定</span>
        </div>
        <picker :data='locationsList' v-model='areaPickerValue' @on-change='areaChange'></picker>
      </popup>
    </div>
    <x-dialog v-model="isMagnifyImg" :hide-on-blur="true">
      <img :src="$store.state.imgServer + imgUrl" style="width: 100%;height:100%">
      <span class="vux-close" @click="isMagnifyImg=false"></span>
    </x-dialog>
    <div style="display: none">{{oneCaseInfo}}{{getImg}}</div>
    <toast v-model="showHint" type="text">{{getRet}}</toast>
    <toast v-model="isHint" type="text">{{hintText}}</toast>
    <loading v-model="showLoadding" text="正在提交..."></loading>
    <previewer :list="img" ref="previewer" :options="previewerOptions"></previewer>
  </div>
</template>
<script>
  import {XHeader, XButton, Group, Cell, XInput, Popup, Picker, Calendar, Toast, XDialog, Icon, Loading, Previewer} from 'vux'
  import CloneData from '../../../../utils/CloneData'
  import lrz from 'lrz'
  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      XInput,
      Popup,
      Picker,
      Calendar,
      Toast,
      XDialog,
      Icon,
      Loading,
      Previewer
    },
    watch: {
      oneCaseInfo (val) {
        if (val) {
          let data = {}
          CloneData.extend(data, val)
          this.setData(data)
        }
      },
      getImg (val) {
        if (val) {
          let temp = {
            url: val
          }
          this.imgList.push(temp)
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
    computed: {
      getImg () {
        return this.$store.getters.imgUrl
      },
      oneCaseInfo () {
        return this.$store.getters.oneCaseInfo
      },
      getRet () {
        this.showLoadding = false
        let data = this.$store.getters.caseMsg
        if (data) {
          this.showHint = true
          this.$store.dispatch('clearCaseMsg')
        }
        return data
      },
      locationsList () {
        return this.$store.getters.localData
      },
      selectHos () {
        return this.$store.getters.selectHos
      },
      selectDept () {
        return this.$store.getters.selectDept
      }
    },
    data () {
      return {
        showLoadding: false,
        isHint: false,
        hintText: '',
        isSave: false,
        imgUrl: '',
        isMagnifyImg: false,
        imgList: [],
        img_srv: '',
        title: '',
        id: 0,
        showHint: false,
        diaTime: 'TODAY',
        nowCityID: '',
        nowProvinceID: '',
        nowAraeID: '',
        addressValue: '请选择区域',
        areaPickerValue: [''],
        isShowPicker: false,
        surgeryName: '',
        diagnosis: '',
        isHos: 0,
        isSurgery: 1,
        radioList: ['是', '否', '未知'],
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
      deleteImg (idx) {
        this.imgList.splice(idx, 1)
        this.img.splice(idx, 1)
      },
      magnifyImg (index) {
        this.$refs.previewer.show(index)
//        this.isMagnifyImg = true
//        this.imgUrl = url
      },
      // 要跳转到医院时,把当前的数据保存起来，选好医院后直接读取本地，避免被服务器的数据覆盖
      jump2Hos () {
        if (this.nowAraeID > 0) {
          this.isSave = true // 跳转到选医院和选科室时，保存本地数据
          this.saveData()
          this.$router.push({name: 'SearchHos', params: {areaId: this.nowAraeID}})
        } else {
          this.isHint = true
          this.hintText = '请先选择地区'
        }
      },
      jump2Dept () {
        if (this.selectHos.hospId > 0) {
          this.isSave = true
          this.saveData()
          this.$router.push({name: 'SearchDept', params: {hospId: this.selectHos.hospId}})
        } else {
          this.isHint = true
          this.hintText = '请先选择医院'
        }
      },
      // 保存到本地的数据，字段与服务器一样，方便统一读取
      saveData () {
        let temp = {
          hos_id: this.selectHos.hospId,
          hos_name: this.selectHos.hosName,
          dept_id: this.selectDept.department_id,
          dept_name: this.selectDept.department_name,
          occur_time: this.diaTime,
          remarks: this.surgeryName,
          type_hospitalization: this.isHos,
          type_operation: this.isSurgery,
          addressValue: this.addressValue,
          diagnosis: this.diagnosis,
          area_id: this.nowAraeID,
          area_name: this.addressValue,
          images: this.imgList,
          img: this.img
        }
        window.sessionStorage.setItem('caseData', JSON.stringify(temp))
      },
      // 读取服务器或者本地保存的数据
      setData (data) {
        if (this.selectHos.hospId === 0) {
          let hos = {
            hospId: data.hos_id,
            hosName: data.hos_name
          }
          this.$store.dispatch('selectHos', hos)
          let dept = {
            department_id: data.dept_id,
            department_name: data.dept_name
          }
          this.$store.dispatch('selectDept', dept)
        }
        if (data.province_name && data.city_name) {
          if (data.city_name === data.province_name) {
            this.addressValue = data.city_name + data.area_name
          } else {
            this.addressValue = data.province_name + data.city_name + data.area_name
          }
        } else {
          this.addressValue = data.area_name
        }
        this.nowAraeID = data.area_id
        this.diaTime = data.occur_time
        this.surgeryName = data.remarks
        this.isHos = data.type_hospitalization
        this.isSurgery = data.type_operation
        this.diagnosis = data.diagnosis
        this.imgList = data.images
        if (data.img) {
          this.img = data.img
        } else {
          for (let i = 0; i < data.images.length; i++) {
            this.img.push({src: this.img_srv + data.images[i].url})
          }
        }
      },
      // 提交病历到服务器
      saveCase () {
        this.showLoadding = true
        let tempId = this.id
        if (tempId === 0 || tempId === '0') {
          tempId = null
        }
        let data = {
          id: tempId,
//          area_id: this.nowAraeID,
          dept_id: this.selectDept.department_id,
          hos_id: this.selectHos.hospId,
          occur_time: this.diaTime,
          remarks: this.surgeryName,
          type: 0, // 0本人， 1亲友
          type_hospitalization: this.isHos,
          type_operation: this.isSurgery,
          diagnosis: this.diagnosis,
          images: this.imgList
        }
        this.$store.dispatch('newCase', data)
      },
      showArea () {
        this.isShowPicker = true
        this.$store.dispatch('getProvince')
      },
      areaChange (val) {
        // 当前省份ID与滚动前不同的时候, 既滚动了省份的时候, 才去获取城市数据, 避免无限循环请求城市数据
        var provinceID = val[0]
        if (this.nowProvinceID !== provinceID) {
          this.$store.dispatch('getCity', provinceID)
          this.nowProvinceID = provinceID
        }
        if (val.length > 1) {
          var cityID = val[1]
          if (this.nowCityID !== cityID) {
            this.$store.dispatch('getArea', cityID)
            this.nowCityID = cityID
          }
        }
        this.nowAraeID = val[val.length - 1]
      },
      pickerCancel () {
        this.isShowPicker = false
      },
      pickerConform () {
        this.isShowPicker = false
        this.spliceLocationName()
      },
      // 省份和科室信息展示处理
      spliceLocationName () {
        this.addressValue = ''
        for (let j = 0; j < this.areaPickerValue.length; j++) {
          for (let i = 0; i < this.locationsList[j].length; i++) {
            if (this.locationsList[j][i].value === this.areaPickerValue[j] &&
              this.addressValue !== this.locationsList[j][i].name) {
              this.addressValue = this.addressValue + this.locationsList[j][i].name
            }
          }
        }
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
        let data = JSON.parse(window.sessionStorage.getItem('caseData'))
        if (data) {
          this.setData(data)
        }
        this.img_srv = this.$store.state.imgServer
        this.$store.dispatch('clearImg')
        this.id = this.$route.params.id
        if (this.id > 0) {
          this.title = '编辑病历'
          // 如果本地保存了数据，直接读取，无需请求，避免覆盖本地已经修改的数据
          if (data == null) {
            this.$store.dispatch('getOneCase', this.id)
          }
        } else {
          this.title = '新建病历'
        }
        if (data == null) {
          let hos = {
            hospId: 0,
            hosName: ''
          }
          this.$store.dispatch('selectHos', hos)
          let dept = {
            department_id: 0,
            department_name: ''
          }
          this.$store.dispatch('selectDept', dept)
        }
      })
    },
    destroyed () {
      // 如果是跳转到医院和科室，则不需要清除本地的数据
      if (!this.isSave) {
        window.sessionStorage.removeItem('caseData')
        this.$store.dispatch('clearImg')
      }
    }
  }

</script>

<style lang="scss">
  @import "style/case.scss";
</style>

