<template>
  <div class="dept-guide-detail">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">{{guidtDetail.title}}</x-header>
    </div>
    <group v-if="size>0 && deptGruidData" class="app-content">
      <cell v-for="item in  deptGruidData.list" :title="item.title" :key="item.id" is-link @click.native="jump(item.id, item.children_size)"></cell>
    </group>
    <div v-if="size==0" class="app-content" v-html="guidtDetail.content"></div>
    <div style="display: none">{{deptGruidData}}</div>
  </div>
</template>
<script>
  import {XHeader, Group, Cell} from 'vux'
  export default{
    components: {
      XHeader, Group, Cell
    },
    computed: {
      deptGruidData () {
        return this.$store.getters.deptGruidData
      }
    },
    watch: {
      deptGruidData (data) {
        if (this.size === 0 && data) {
          for (let i = 0; i < data.list.length; i++) {
            if (data.list[i].id === this.id) {
              this.guidtDetail = data.list[i]
            }
          }
        }
      }
    },
    data () {
      return {
        id: 0,
        deptId: 0,
        size: 0,
        guidtDetail: {
          title: '',
          content: ''
        }
      }
    },
    methods: {
      jump (id, s) {
        this.id = id
        this.size = Number(s)
        this.getData()
      },
      getData () {
        let temp
        if (this.size > 0) {
            // 是父类
          temp = {
            parent_id: this.id,
            istt_id: this.deptId,
            module: 1,
            type: 2
          }
        } else {
          temp = {
            id: this.id,
            istt_id: this.deptId,
            module: 1,
            type: 2
          }
        }
        this.$store.dispatch('getDeptGuide', temp)
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.id = Number.parseInt(this.$route.params.id)
        this.deptId = Number.parseInt(this.$route.params.deptId)
        this.size = Number.parseInt(this.$route.params.size)
        this.getData()
      })
    }
  }
</script>
<style lang="scss">
  .dept-guide-detail {
    .app-content{
      padding: 50px 10px 10px 10px;
      line-height: 150%;
    img{
        width: 200px;
        }
    }
  }
</style>
