import Vue from 'vue'
import {ApiVersion} from '../resources'

const CaseHisUrl = {
  // 获取病历列表
  CaseListRes: Vue.resource(ApiVersion + 'medical_record/treat/{friends_id}'),
  // 新建病历
  NewCaseRes: Vue.resource(ApiVersion + 'medical_record/treat/{friends_id}'),
  // 获取基础病历信息
  GetCaseInfoRes: Vue.resource(ApiVersion + 'medical_record/basic'),
  // 保存基础病历信息
  SaveCaseInfoRes: Vue.resource(ApiVersion + 'medical_record/basic'),
  // 获取病历详情，一个病历信息
  OneCaseInfoRes: Vue.resource(ApiVersion + 'medical_record/treat/one/{id}')
}

const CaseHisApi = {
  getCaseList: function (id) {
    return CaseHisUrl.CaseListRes.get({friends_id: id})
  },
  newCase: function (data) {
    return CaseHisUrl.NewCaseRes.save({friends_id: 0}, data)
  },
  getCaseInfo: function () {
    return CaseHisUrl.GetCaseInfoRes.get()
  },
  saveCaseInfo: function (data) {
    return CaseHisUrl.SaveCaseInfoRes.save(data)
  },
  getOneCase: function (id) {
    return CaseHisUrl.OneCaseInfoRes.get({id: id})
  }
}

export default CaseHisApi
