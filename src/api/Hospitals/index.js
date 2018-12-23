import Vue from 'vue'
import {ApiVersion} from '../resources'
/**
 * 医院相关
 * */
const HospitalsUrl = {
  // 搜索医院
  SearchHospitalRes: Vue.resource(ApiVersion + 'common/hospitals'),
  // 获取科室
  SearchDepartRes: Vue.resource(ApiVersion + 'common/hospitals/{id}/departments'),
  // 查询医院下面所有科室
  AllDepartRes: Vue.resource(ApiVersion + 'common/hospitals/{id}/all_departments'),
  // 区域查询科室
  AreaHospitalRes: Vue.resource(ApiVersion + 'common/hospitals/area'),
  // 查询医院的详细细信息
  HospitalInfoRes: Vue.resource(ApiVersion + 'common/hospitals/info/{hosId}'),
  // 查询医院下面的所有可约床科室
  HosFindOpenApplyDeptRes: Vue.resource(ApiVersion + 'common/hospitals/find_open_apply_dept')
}
/**
 * 医院
 * */
const HospitalsApi = {
  // 搜索医院
  searchHospitals: function (querytText) {
    return HospitalsUrl.SearchHospitalRes.save({q: querytText})
  },
  searchDepart: function (hospId, querytText) {
    return HospitalsUrl.SearchDepartRes.save({
      id: hospId
    }, {q: querytText})
  },
  // 区域查询科室
  getHospitalByArea: function (areaID) {
    return HospitalsUrl.AreaHospitalRes.save({area_id: areaID})
  },
  // 查询医院下面的所有科室
  getAllDepartments: function (hosID) {
    return HospitalsUrl.AllDepartRes.get({
      id: hosID
    })
  },
  // 查询医院的详细信息
  getHospitalInfo: function (hosId) {
    return HospitalsUrl.HospitalInfoRes.get({
      hosId: hosId
    })
  },
  // 查询医院下面所有可约床科室
  hosFindOpenApplyDept: function (hosId) {
    return HospitalsUrl.HosFindOpenApplyDeptRes.save({hos_id: hosId})
  }
}
export default HospitalsApi
