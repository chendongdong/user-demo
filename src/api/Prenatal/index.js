import Vue from 'vue'
import { ApiVersion } from '../resources'

/**
 * 孕检患者相关
 */
const PrenatalUrl = {
  // 医生申请产检
  PrenatalDoctorApplyRes: Vue.resource(ApiVersion + 'd/orders_obst_chk'),
  // common 申请产检
  PrenatalCommonApplyRes: Vue.resource(ApiVersion + 'common/orders_obst_chk'),
  // 获取产检列表
  GetPrenatalListRes: Vue.resource(ApiVersion + 'orders_obst_chk/list'),
  // 获取产检列表
  GetPrenatalInfoRes: Vue.resource(ApiVersion + 'orders_obst_chk/one/{id}'),
  // 更新产检状态
  UpdatePrenatalInfoRes: Vue.resource(ApiVersion + 'orders_obst_chk/update_state/{id}/{state}', {}, {}, {emulateJSON: false}),
  // 孕检孕检通知
  PrenatalNotifyChectRes: Vue.resource(ApiVersion + 'orders_obst_chk/notify_chect/{id}'),
  // 孕妇学校查询课程
  QueryCourseRes: Vue.resource(ApiVersion + 'obst/course/query_course'),
  // 孕妇学校参与或取消课程
  AttendCourseRes: Vue.resource(ApiVersion + 'obst/course/attend_course')
}
const PrenatalApi = {
  // 医生申请产检
  prenatalDoctorApply: function (data) {
    return PrenatalUrl.PrenatalDoctorApplyRes.update(data)
  },
  // common 申请产检
  prenatalCommonApply: function (data) {
    return PrenatalUrl.PrenatalCommonApplyRes.update(data)
  },
  // 获取产检列表
  getPrenatalList: function (data) {
    return PrenatalUrl.GetPrenatalListRes.save(data)
  },
  // 获取产检列表
  getPrenatalInfo: function (id) {
    return PrenatalUrl.GetPrenatalInfoRes.save({id: id}, {})
  },
  // 更新产检状态
  updatePrenatalInfo: function (data) {
    return PrenatalUrl.UpdatePrenatalInfoRes.get(data)
  },
  // 孕检孕检通知
  prenatalNotifyChect: function (id) {
    return PrenatalUrl.PrenatalNotifyChectRes.get({id: id})
  },
  // 查询课程
  queryCourse: function (data) {
    return PrenatalUrl.QueryCourseRes.save(data)
  },
  attendCourse: function (data) {
    return PrenatalUrl.AttendCourseRes.save(data)
  }
}
export default PrenatalApi
