<template>
  <div class="select-location">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">选择地区</x-header>
      <div v-show="location" class="current-city" style="top: 46px;background: white;height: 40px;border-bottom: 1px solid #dfdfdf" @click="clickCur">
        <img src="~assets/image/address-green.png" style="width: 20px">
        <span style="color: #68C84F;margin-left: 5px">定位当前城市</span>
      </div>
    </div>
    <div class="app-content" :style="{'padding-top': location==null?'46px':'86px'}">
      <div class="location-city">
        <div style="width: 30%">
          <p v-for="(item, index) in provinceList" @click="clickProvince(item.value, index)"
             :style="{'background': activeIdx==index?'white':'rgb(230,253,220)','border-right-color': activeIdx==index?'transparent':'#dfdfdf'}"
             class="province">
            {{item.name}}
          </p>
        </div>
        <div style="width: 70%;background: white;">
          <p v-for="(item, idx) in cityList" class="city" @click="clickCity(item)">
            {{item.name}}
          </p>
        </div>
      </div>
    </div>
    <loading v-model="isLoadingLoca" text="加载中..."></loading>
    <div style="display: none">{{provinceData}}{{cityData}}</div>
  </div>
</template>
<script>
  import {XHeader, Loading} from 'vux'
  import {mapGetters} from 'vuex'
  import CloneData from '../../utils/CloneData'
  import {SESSION_DATA} from '../../config/sessionStorage'
  export default {
    components: {
      XHeader,
      Loading
    },
    computed: {
      ...mapGetters([
        'provinceData',
        'cityData',
        'isLoadingLoca'
      ])
    },
    watch: {
      provinceData (val) {
        this.provinceList = []
        CloneData.extend(this.provinceList, val)
        let temp = {
          value: 0,
          name: '热门城市'
        }
        this.provinceList.splice(0, 0, temp)
      },
      cityData (val) {
        this.cityList = []
        CloneData.extend(this.cityList, val)
        if (this.activeIdx > 0) {
          let temp = {
            value: 0,
            name: '所有医院'
          }
          this.cityList.splice(0, 0, temp)
        }
      }
    },
    data () {
      return {
        activeIdx: 0,
        provinceList: [],
        cityList: [],
        location: null,
        lastPage: ''
      }
    },
    methods: {
      clickProvince (id, index) {
        if (id === 0) {
          this.$store.dispatch('getHotCity')
        } else {
          this.$store.dispatch('getCity', id)
        }
        this.activeIdx = index
        window.scrollTo(0, 0)
      },
      clickCity (item) {
        let temp = {}
        if (item.value === 0) {
          // 省份所有医院，显示省份
          temp = JSON.stringify(this.provinceList[this.activeIdx])
        } else {
          temp = JSON.stringify(item)
        }
        if (this.lastPage === 'home') {
            // 跳转到搜索全部医院
          window.sessionStorage.setItem(SESSION_DATA.SET_CITY, temp)
          this.$router.push({path: '/search-result-more/4'})
        } else if (this.lastPage === 'result') {
          window.sessionStorage.setItem(SESSION_DATA.SWITCH_CITY, temp)
          this.$router.go(-1)
        }
      },
      clickCur () {
        if (this.lastPage === 'home') {
          window.sessionStorage.setItem(SESSION_DATA.SET_CITY, this.location)
          this.$router.push({path: '/search-result-more/4'})
        } else if (this.lastPage === 'result') {
          window.sessionStorage.setItem(SESSION_DATA.SWITCH_CITY, this.location)
          this.$router.go(-1)
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.lastPage = this.$route.query.page
        this.$store.dispatch('getProvince')
        this.$store.dispatch('getHotCity')
        this.location = window.sessionStorage.getItem(SESSION_DATA.LOCATION_CITY)
      })
    }
  }
</script>
<style lang="scss">
  @import "style/select-location.scss";
</style>
