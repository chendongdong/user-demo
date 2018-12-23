<template>
  <div class="search-hospital">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">请选择医院</x-header>
    </div>
    <div class="app-content">
      <p v-for="list in hospitalList" @click="selectHos(list.name,list.id)">{{ list.name }}</p>
      <h5 v-if="hospitalList.length==0" style="text-align: center;margin-top: 20px">该地区没有搜索到相关医院</h5>
    </div>
  </div>
</template>
<script>
  import {XHeader} from 'vux'
  export default{
    components: {
      XHeader
    },
    computed: {
      hospitalList () {
        let temp = this.$store.getters.hospitalDataByArea
        return temp
      }
    },
    methods: {
      selectHos (name, id) {
        let temp = {
          hosName: name,
          hospId: id
        }
        this.$store.dispatch('selectHos', temp)
        // 选了医院必须重新选科室，将科室致空
        let dept = {
          department_id: 0,
          department_name: ''
        }
        this.$store.dispatch('selectDept', dept)
        window.history.back()
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        let areaId = this.$route.params.areaId
        this.$store.dispatch('getHospitalByArea', areaId)
      })
    }
  }
</script>
<style lang="scss">
 .search-hospital{
 p {
   border-bottom: 1px solid #eee;
   padding: 13px;
   font-size: 15px;
   text-align: center;
   margin: 0px;
   background: white;
 }
 }
</style>
