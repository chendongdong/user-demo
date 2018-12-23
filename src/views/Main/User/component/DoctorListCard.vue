<template>
  <div>
    <div v-for="(doc, index) in dataList" :key="doc.id" class="doctor-list-card"  @click="cardClick(doc.id)">
      <div class="doctor-image-bg">
        <img :src="imgServer + doc.img_url" alt="" class="doctor-image">
      </div>
      <div class="doctor-content">
        <div class="doctor-header">
          <span class="name">{{doc.name}}</span>
          <span class="position">{{doc.position}}</span>
        </div>
        <div class="doctor-body">
          <span class="dept">{{doc.dept_name}}</span><br>
          <span class="hos">{{doc.hos_name}}</span><br>
          <!--<div class="remark">{{doc.profile}}</div>-->
          <x-icon type="ios-arrow-forward" class="cell-x-icon pull-right"></x-icon>
        </div>
        <div class="doctor-footer">
          <flexbox class="footer-box">
            <flexbox-item  @click.stop.prevent.native="bookClick(doc.id)">
              <img src="../../../../assets/image/booking.png" alt="预约" class="doctor-footer-image">
              <span class="doctor-footer-title">预约床位</span>
            </flexbox-item>
            <flexbox-item  @click.stop.prevent.native="followClick(doc.id)">
              <img src="../../../../assets/image/followed.png" alt="预约" class="doctor-footer-image">
              <span class="doctor-footer-title">已收藏</span>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { FlexboxItem, Flexbox, XButton } from 'vux'

  export default {
    components: {FlexboxItem, Flexbox, XButton},
    computed: {},
    props: {
      dataList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data: function () {
      return {
        imgServer: ''
      }
    },
    watch: {},
    methods: {
      cardClick (id) {
        this.$emit('card-click', id)
      },
      followClick (id) {
        this.$emit('follow-click', id)
      },
      bookClick (id) {
        this.$emit('book-click', id)
      }
    },
    mounted () {
      this.imgServer = this.$store.state.imgServer
    }
  }
</script>

<style lang="scss">
  @import 'style/doctorListCard.scss';
</style>



