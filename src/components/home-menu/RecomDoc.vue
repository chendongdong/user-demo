<template>
  <div class="home">
    <div class="recommend-title">
      <img src="~assets/recom_doc.png" class="icon">
      <p class="recommed-more" @click="jump2RecomDoc">
        {{title}}
        <span class="more-doc" v-if="type=='home'||(type=='dept'&&dept_doctorDetails.length>4)">更多</span>
      </p>
      <div class="recommed-doc" v-if="type=='home'&&recomDocs&&recomDocs.list.length>0">
        <div class="doc-item" v-for="item in recomDocs.list" @click="jump2Doc(item.id)">
          <div class="doc-head-father">
            <img :src="$store.state.imgServer + item.picture" class="doc-head">
          </div>
          <p style="color: #333;">{{item.name}}</p>
          <p style="color:#666;font-size: 12px;">{{item.position_name}}</p>
          <p style="color:#666;font-size: 12px;">{{item.dept_name}}</p>
        </div>
      </div>
      <div class="recommed-doc" v-if="type=='dept'&&dept_doctorDetails.length>0">
        <div class="doc-item" v-for="(item, idx) in dept_doctorDetails" @click="jump2Doc(item.doctor.id)" v-if="idx<4">
          <div class="doc-head-father">
            <img :src="$store.state.imgServer + item.doctor.picture" class="doc-head">
          </div>
          <p style="color: #333;">{{item.doctor.name}}</p>
          <p style="color:#666;font-size: 12px;">{{item.doctor.position_name}}</p>
          <p style="color:#666;font-size: 12px;">{{item.doctor.dept_name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'recomDocs',
        'dept_doctorDetails'
      ])
    },
    props: {
      type: {
        type: String,
        default: 'home'
      }
    },
    data () {
      return {
        title: ''
      }
    },
    methods: {
      jump2RecomDoc () {
        if (this.type === 'home') {
          this.$router.push({name: 'RecomDoctor'})
        }
      },
      jump2Doc (id) {
        this.$router.push({path: '/doctor-detail/' + id})
      }
    },
    mounted () {
      this.$nextTick(function () {
        if (this.type === 'home') {
          this.title = '名医推荐'
          this.$store.dispatch('getRecomDoc', {page_number: 1, page_size: 4})
        } else if (this.type === 'dept') {
          this.title = '科室医生'
        }
      })
    }
  }
</script>
<style lang="scss">
  @import "../../views/Home/style/home.scss";
</style>
