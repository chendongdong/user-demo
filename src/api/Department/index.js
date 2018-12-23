import Vue from 'vue'
import {ApiVersion} from '../resources'
/**
 * 科室相关
 * */
const DepartmentsUrl = {
  // 获取科室的所有管理组
  GetGroupRes: Vue.resource(ApiVersion + 'common/departments/deptGroup'),
  // 获取科室信息
  getDeptInfoRes: Vue.resource(ApiVersion + 'common/departments/{id}'),
  // 保存科室信息
  saveDeptInfoRes: Vue.resource(ApiVersion + 'common/departments'),
  // 科室设置(获取)
  DeptSettingRes: Vue.resource(ApiVersion + 'common/departments/{id}/settings'),
  OneDepartmentRes: Vue.resource(ApiVersion + 'common/departments/one/{id}'),
  // 获取医院下面的所有科室(最详细, 包括设置了是否对外显示等详细信息)
  AlldeptOfHosRes: Vue.resource(ApiVersion + 'common/departments/all/{id}'),
  // 获取推荐的科室
  RecommendDepartment: Vue.resource(ApiVersion + 'common/departments/find_recommend_dept')
}
const DepartmentsApi = {
  getDeptInfo: function (deptId) {
    return DepartmentsUrl.getDeptInfoRes.get({id: deptId})
  },
  getDeptsSetting: function (deptId) {
    return DepartmentsUrl.DeptSettingRes.get({id: deptId})
  },
  getManaGroup: function () {
    return DepartmentsUrl.GetGroupRes.get()
  },
  getOneDeptInfo: function (deptId) {
    return DepartmentsUrl.OneDepartmentRes.get({id: deptId})
  },
  getAlldeptOfHos: function (hosId) {
    return DepartmentsUrl.AlldeptOfHosRes.get({id: hosId})
  },
  getRecommendDepartment: function (pageSize, pageNumber) {
    return DepartmentsUrl.RecommendDepartment.get({page_size: pageSize, page_number: pageNumber})
  }
}
export default DepartmentsApi
