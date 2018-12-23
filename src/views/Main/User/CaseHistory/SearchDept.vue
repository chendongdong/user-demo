<template>
  <div class="search-dept">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">请选择科室</x-header>
    </div>
    <div class="app-content">
      <p v-for="item in deptList" @click="selectDepart(item)">{{ item.name }}</p>
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
      deptList () {
        let temp = this.$store.getters.allDeptOfHos
        return temp
      }
    },
    methods: {
      selectDepart (item) {
        let temp = {
          department_id: item.id,
          department_name: item.name
        }
        this.$store.dispatch('selectDept', temp)
        window.history.back()
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        let hospId = this.$route.params.hospId
        this.$store.dispatch('getAllDepartments', hospId)
      })
    }
  }
</script>
<style lang="scss">
  .search-dept {
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
