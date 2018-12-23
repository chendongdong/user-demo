import Vue from 'vue'
import {ApiVersion} from '../../api/resources'

const HomeUrl = {
  HomeIndexRes: Vue.resource(ApiVersion + 'common/home/index'),
  HospitalRes: Vue.resource(ApiVersion + 'common/home/hospitals/{id}'),
  DoctorRes: Vue.resource(ApiVersion + 'common/home/doctors/{id}'),
  DeptRes: Vue.resource(ApiVersion + 'common/home/departments/{id}'),
  ExportsRes: Vue.resource(ApiVersion + 'common/home/exports/recomments'),
  // 加密医院id，获取医院信息
  EncrypHosRes: Vue.resource(ApiVersion + 'common/home/hospitals/encrypted/{hos_id}'),
  // 获取推荐医生
  RecomDocRes: Vue.resource(ApiVersion + 'common/member/push_doctor'),
  // 后台通过ip地址获取当前城市
  IPCityRes: Vue.resource(ApiVersion + 'common/base_data/location_addr'),
  // 通过经纬度获取当前城市
  LocationCityRes: Vue.resource(ApiVersion + 'common/base_data/position_addr'),
  // 获取科室就医指导列表
  DeptGuideRes: Vue.resource(ApiVersion + 'common/find_istt_notice')
}

const HomeApi = {
  getHomeIndex: function () {
    return HomeUrl.HomeIndexRes.get()
  },
  getHospital: function (id) {
    return HomeUrl.HospitalRes.get({
      id: id
    })
  },
  getEncrypHos: function (id) {
    return HomeUrl.EncrypHosRes.get({
      hos_id: id
    })
  },
  getDepartment: function (id) {
    return HomeUrl.DeptRes.get({
      id: id
    })
  },
  getDoctor: function (id) {
    return HomeUrl.DoctorRes.get({
      id: id
    })
  },
  getExports: (payload) => {
    return HomeUrl.ExportsRes.get({
      q: payload.q || '',
      start: payload.start || 0,
      size: payload.size || 10,
      type: payload.type
    })
  },
  getRecomDoc: (payload) => {
    return HomeUrl.RecomDocRes.update(payload)
  },
  getIPCity: () => {
    return HomeUrl.IPCityRes.get()
  },
  getLocationCity: (data) => {
    return HomeUrl.LocationCityRes.get(data)
  },
  getDeptGuide: (payload) => {
    return HomeUrl.DeptGuideRes.save(payload)
  }
}

export default HomeApi
