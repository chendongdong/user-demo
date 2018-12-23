<template>
  <div class="panel-card">
    <p class="title" v-show="title!=''">{{ title }}</p>
    <!--推荐科室-->
    <div class="search" v-if="type===1" v-for="(list, index) in dataList" @click="jump2Dept(list.dept_id)" :key="index">
      <div class="img-father">
        <img class="image" :src="img_v + list.img_url">
      </div>
      <div class="base-info">
        <p class="name">{{list.dept_name}}</p>
        <p>{{list.hospital_name}}</p>
        <p>{{list.address}}</p>
      </div>
      <div class="button">
        <button class="btn-booking"
                @click.stop.prevent="jump2Booking(list.dept_id)">约床
        </button>
      </div>
      <x-icon type="ios-arrow-forward" class="cell-x-icon pull-right"></x-icon>
    </div>
    <!--搜索结果医生-->
    <div class="search" v-if="type===2 && (index<3 || isMore)" v-for="(list, index) in dataList" :key="list.doctor_id"
         @click="jump2Doctor(list.doctor_id)">
      <div class="img-father">
        <img class="image" :src="img_v + list.picture">
      </div>
      <div class="base-info">
        <p><span class="name">{{list.doctor_name}}</span> {{list.position}}</p>
        <p>{{list.dept_name}}</p>
        <p>{{list.hos_name}}</p>
      </div>
      <x-icon type="ios-arrow-forward" class="cell-x-icon pull-right" style="width: 15px"></x-icon>
    </div>
    <!--搜索结果科室-->
    <div class="search" v-if="type===3 && (index<3 || isMore)" v-for="(list, index) in dataList"  :key="list.dept_id"
         @click="jump2Dept(list.dept_id)">
      <div class="img-father">
        <img class="image" :src="img_v + list.picture">
      </div>
      <div class="base-info">
        <p class="name">{{list.dept_name}}</p>
        <p>{{list.dept_hos_name}}</p>
        <p>{{list.dept_hos_address}}</p>
      </div>
      <div class="button">
        <button class="btn-booking"
                @click.stop.prevent="jump2Booking(list.dept_id)">约床
        </button>
      </div>
      <x-icon type="ios-arrow-forward" class="cell-x-icon pull-right"></x-icon>
    </div>
    <!--搜索结果医院-->
    <div class="search" v-if="type===4 && (index<3 || isMore)" v-for="(list, index) in dataList"  :key="list.hos_id"
         @click="jump2Hos(list.hos_id)">
      <div class="img-father">
        <img class="image" :src="img_v + list.picture">
      </div>
      <div class="base-info">
        <p class="name">{{list.hos_name}}</p>
        <p>{{list.hos_level_name}}</p>
        <p>{{list.address}}</p>
      </div>
      <x-icon type="ios-arrow-forward" class="cell-x-icon pull-right" style="width: 15px"></x-icon>
    </div>
    <!--科室主页的医生列表-->
    <div class="search" v-if="type===5" v-for="list in dataList" :key="list.doctor.id" @click="jump2Doctor(list.doctor.id)">
      <div class="img-father">
        <img class="image" :src="img_v + list.doctor.picture">
        <badge :text="list.doctor.unread" v-if="list.doctor.unread > 0"></badge>
      </div>
      <div class="base-info">
        <p><span class="name">{{list.doctor.name}}</span> {{list.doctor.position_name}}</p>
        <p>{{list.doctor.dept_name}}</p>
        <p>{{list.doctor.hos_name}}</p>
      </div>
      <x-icon type="ios-arrow-forward" class="cell-x-icon pull-right"></x-icon>
    </div>
    <!--我的约床 订单列表-->
    <div class="order" v-if="type===6" v-for="list in dataList" :key="list.id" @click="jump2Detail('BookingDetail', list.id)">
      <span class="state">{{ list.state }}</span>
      <p class="blue">{{ list.dept_name }}</p>
      <p style="font-size: 14px">{{ list.hos_name }}</p>
      <p>住院人：{{ list.name }}</p>
      <p>期望入住日期：{{ list.expect_checkin_date }}</p>
      <p>疾病情况：{{ list.illness }}</p>
    </div>
    <!--我的转诊 转诊列表-->
    <div class="order" v-if="type===7" v-for="list in dataList" :key="list.id" @click="jump2TransDetail('TransDetail', list.id, list.transfer_rec_type)">
      <span class="state">{{ list.transfer_state }}</span>
      <p style="font-size:16px;color:#5491ec">{{list.transfer_diagnostic}}</p>
      <p>{{ list.patient_name }} {{ list.patient_gender }} {{ list.patient_grow_age }}</p>
      <p>{{ list.hos_name }} {{list.dept_name}} {{list.recipient_doctor_name}}</p>
    </div>
    <!--病历列表-->
    <div class="case-his" v-if="type===8" v-for="list in dataList" @click="jump2Detail('CaseDetail', list.id)" :key="list.id">
      <div class="date">
        <p>{{list.occur_time.split('-')[1]}}月{{list.occur_time.split('-')[2]}}日</p>
        <p>{{list.occur_time.split('-')[0]}}年</p>
      </div>
      <div class="item">
        <p>{{list.diagnosis}}</p>
        <p>
          <span v-if="list.type_hospitalization==0">非住院</span>
          <span v-if="list.type_hospitalization==1">住院</span>
          <span v-if="list.type_hospitalization==2">未知</span>
          <span v-if="list.type_operation==0">非手术</span>
          <span v-if="list.type_operation==1">手术</span>
          <span v-if="list.type_operation==2">未知</span>
        </p>
        <p>{{list.hos_name}} {{list.dept_name}}</p>
      </div>
      <x-icon type="ios-arrow-forward" class="cell-x-icon pull-right" style="width: 22px"></x-icon>
    </div>

    <!--余额收支记录-->
    <div class="balance-his" v-if="type===9" v-for="list in dataList" :key="list.order_id">
      <div class="b-info">
        <span>{{list.title}}</span>
        <span>{{list.order_id}}</span>
      </div>
      <span class="b-number">{{list.trade_money}}</span>
    </div>

    <!--推荐医生列表-->
    <div class="search" v-if="type===10" v-for="(list, index) in dataList"
          :key="index"
         @click="jump2Doctor(list.id)">
      <img class="image" :src="img_v + list.picture">
      <div class="base-info">
        <p><span class="name">{{list.name}}</span> {{list.position_name}}</p>
        <p>{{list.dept_name}}</p>
        <p>{{list.hos_name}}</p>
      </div>
      <div class="button">
        <button class="btn-booking"
                @click.stop.prevent="jump2DocBooking(list.id)">约床
        </button>
      </div>
      <x-icon type="ios-arrow-forward" class="cell-x-icon pull-right"></x-icon>
    </div>

    <!--医生提醒-->
    <div class="remind-card" v-if="type==11" v-for="item in dataList" :key="item.id" @click="cardClick(item.id)">
      <div class="header">
        <span class="name">{{item.type_name}}</span>
        <span class="date">{{item.created}}</span>
      </div>
      <div class="base-info">
        <div class="cell-x-icon-bg">
          <x-icon type="ios-arrow-forward" class="cell-x-icon"></x-icon>
        </div>
        <div class="content">
          <span v-show="item.doctor">来自{{item.doctor}}的提醒：</span>
          <span v-html="item.content"></span>
        </div>
      </div>
    </div>

    <!--复诊提醒、用药提醒-->
    <div class="remind-card" v-if="type==12||type==13||type==14" v-for="item in dataList" :key="item.id" @click="cardClick(item.id)">
      <div class="header">
        <span class="name">{{item.type_name}}</span>
        <span class="date">{{item.start_time}}</span>
      </div>
      <img class="done-img" v-show="item.valid=='0'" src="../../assets/image/done.png" alt="">
      <div class="base-info">
        <div class="cell-x-icon-bg">
          <x-icon type="ios-arrow-forward" class="cell-x-icon"></x-icon>
        </div>
        <div class="content">
          <div v-if="type==12">
            <div v-show="item.params && item.params.doctor_name">
              <span>医生:  <span v-html="item.params && item.params.doctor_name"></span></span><br>
            </div>
            <div v-show="item.params && item.params.hos_name">
              <span>医院:  <span v-html="item.params && item.params.hos_name"></span></span><br>
            </div>
            <span>备注:  <span v-html="item.params && item.params.remark"></span></span>
          </div>
          <div v-if="type==13">
            <span>药品名称:  <span v-html="item.params && item.params.medicine_name"></span></span><br>
            <span>剂量单位:  <span v-html="item.params && item.params.count_name"></span></span><br>
            <span>服药原因:  <span v-html="item.params && item.params.cause"></span></span><br>
            <span>药品来源:  <span v-html="item.params && item.params.origin"></span></span><br>
            <span>备注:  <span v-html="item.params && item.params.remark"></span></span>
          </div>
          <div v-if="type==14">
            <span>备注:  <span v-html="item.params && item.params.remark"></span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="notify-card" v-if="type==15" v-for="item in dataList" :key="item.id" @click="cardClick(item.id)">
      <div class="card-content">
        <div class="card-content-header">
          <badge class="pull-left" style="margin-bottom: 15px;margin-top: 15px;margin-left: -15px;" v-show="item.read_flag==0"></badge>
          <span class="reminder-title">{{item.title}}</span>
          <span class="time">{{item.created}}</span>
        </div>
        <div class="content">
          <span>{{item.content}}</span>
        </div>
      </div>
    </div>

    <div class="prenatal-record-card" v-if="type===16" v-for="(item, index) in dataList" :key="item.id" @click="cardClick(item.id)">
      <div style="width:100%;font-size: 13px;">
        <div class="base-info">
          <div class="base-info-name">
            <!--<div class="image-bg">-->
              <!--<img src="../../assets/women.png" alt="">-->
            <!--</div>-->
            <span class="name">{{item.patient_name }}</span>
            <span class="state">{{item.apply_state_name}}</span>
          </div>
          <div class="operate">
            <button class="info-btn" type="button" @click.stop="stateButtonClick(item.id, index)">{{item.btn_title}}</button>
          </div>
        </div>
        <div class="bed-info">
          <div class="cell-x-icon-bg">
            <x-icon type="ios-arrow-forward" class="cell-x-icon"></x-icon>
          </div>
          <div>
            <p style="font-weight:600">怀孕周期: {{item.patient_pregnant_period}}周</p>
            <!--<p>主治医生: {{list.recommend}}</p>-->
            <!--<p>所在科室: {{list.dept_name}}</p>-->
            <p>主治医生: <span>{{item.recommend_name}}</span></p>
            <p>所在科室: <span>{{item.dept_name}}</span></p>
          </div>
        </div>
      </div>
    </div>
    <!--定制科室专家列表-->
    <div class="search" v-if="type===17" v-for="list in dataList" :key="list.doctor.id" @click="jump2Doctor(list.doctor.id)">
      <div class="consult-img">
        <img :src="img_v + list.doctor.picture">
        <badge :text="list.doctor.unread" v-if="list.doctor.unread > 0" class="bradge"></badge>
      </div>
      <div class="base-info">
        <p><span class="name">{{list.doctor.name}}</span> {{list.doctor.position_name}}</p>
      </div>
      <div class="button">
        <x-button mini type="primary" @click.stop.prevent.native="jump2consult(list.doctor.id, list.doctor.name)" style="float: right;margin-right: 10px">
          在线咨询
        </x-button>
        <!--<button class="btn-booking"-->
                <!--@click.stop.prevent="">在线咨询-->
        <!--</button>-->
      </div>
      <x-icon type="ios-arrow-forward" class="cell-x-icon pull-right"></x-icon>
    </div>
    <div @click="checkMore" class="more" v-show="isShowMore"><span class="check-more">查看更多</span></div>
  </div>
</template>
<script>
  import { QUERY_NAME } from '../../config/Constant'
  import { Badge, XButton } from 'vux'

  export default {
    components: {
      Badge, XButton
    },
    data () {
      return {
        img_v: '',
        prenatalStateText: ['取消', '排队中', '', '已检查', '违约']
      }
    },
    props: {
      dataList: {
        type: Array,
        default () {
          return []
        }
      },
      type: {
        type: Number,
        default: 1
      },
      isMore: {
        type: Boolean,
        default: false
      },
      isShowMore: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      }
    },
    methods: {
      jump2consult (id, name) {
        this.$router.push({path: '/special/consult-detail/' + id + '/' + name})
      },
      jump2Booking (id) {
        this.$router.push({name: 'Booking', query: {id: id, t: QUERY_NAME.DEPARTMENT}})
      },
      jump2DocBooking (id) {
        this.$router.push({name: 'Booking', query: {id: id, t: QUERY_NAME.DOCTOR}})
      },
      jump2Doctor (id) {
        this.$router.push({name: 'DocDetail', params: {docId: id}})
      },
      jump2Dept (id) {
        this.$router.push({name: 'DeptMain', params: {deptId: id}})
      },
      jump2Hos (id) {
        this.$router.push({name: 'HospitalMain', params: {hosId: id}})
      },
      checkMore () {
//        this.$emit('check-more')
        this.$router.push({name: 'SearchResultMore', params: {type: (this.type - 1)}})
      },
      jump2Detail (name, id) {
        this.$router.push({name: name, params: {id: id}})
      },
      jump2TransDetail (name, id, type) {
        this.$router.push({name: name, params: {id: id, type: type}})
      },
      cardClick (id) {
        this.$emit('card-click', id)
      },
      stateButtonClick (id, index) {
        this.$emit('state-btn-click', id, index)
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.img_v = this.$store.state.imgServer
      })
    }
  }
</script>
<style lang="scss">
  @import "panel-card.scss";
</style>
