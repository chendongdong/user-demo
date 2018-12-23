<template>
  <div class="dept-booking">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">科室预约</x-header>
    </div>
    <div class="pad-content">
      <span class="state">我要预约：</span>
      <grid :cols="2">
        <grid-item>
          <div class="card">
            <p class="title">日间病房</p>
            <p class="text">预约内容：人流，药流，水电费手动</p>
            <span class="btn-day" @click="jump2Day">快速预约</span>
          </div>
        </grid-item>
        <grid-item>
          <div class="card">
            <p class="title course">孕妇课程</p>
            <p class="text">预约内容：人流，药流，水电费手动，水电费螺丝钉；了打水电费手动水电费水电费手动水电费水电费水电费手动防守打法手动开</p>
            <span class="btn-course" @click="jump2Course">快速预约</span>
          </div>
        </grid-item>
        <grid-item>
          <div class="card">
            <p class="title baby">新生儿游泳</p>
            <p class="text">预约内容：人流，药流，水电费手动</p>
            <span class="btn-baby" @click="jump2Baby">快速预约</span>
          </div>
        </grid-item>
      </grid>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import {XHeader, Grid, GridItem, XButton} from 'vux'
  export default {
    components: {
      XHeader, Grid, GridItem, XButton
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      jump2Day () {
        this.$router.push({name: 'DayWard'})
      },
      jump2Course () {
        this.$router.push({name: 'PregnaSchool'})
      },
      jump2Baby () {
        this.$router.push({name: 'BabySwiming'})
      }
    }
  }
</script>
<style lang="scss">
  @import "style/dept_booking.scss";
</style>
