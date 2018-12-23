/**
 * Created by Fussa on 2018/1/4 11:36
 */
import Vue from 'vue'
import { ApiVersion } from '../resources'

const ObstetricsUrl = {
  // 孕妇健康提醒/查询
  QueryObstTipsRes: Vue.resource(ApiVersion + 'common/obst/query_obst_tips'),
  // 孕妇健康提醒/删除
  DelObstTipsRes: Vue.resource(ApiVersion + 'obst/del_obst_tips'),
  // 风险评估/审批测评
  ApproveRiskRes: Vue.resource(ApiVersion + 'obst/risk/approve_risk'),
  // 风险评估/删除测评
  DelSubjectRecordRes: Vue.resource(ApiVersion + 'obst/risk/del_subject_record'),
  // 风险评估/查询题目
  QuerySubjectRes: Vue.resource(ApiVersion + 'obst/risk/query_subject/{id}'),
  // 风险评估/测评列表
  QuerySubjectRecordRes: Vue.resource(ApiVersion + 'obst/risk/query_subject_record'),
  // 风险评估/保存测评
  SaveSubjectRecordRes: Vue.resource(ApiVersion + 'obst/risk/save_subject_record'),
  // 孕妇健康提醒/保存
  SaveObstTipsRes: Vue.resource(ApiVersion + 'obst/save_obst_tips'),
  // 用户孕周/查询
  QueryGestInfoRes: Vue.resource(ApiVersion + 'obst/user/query_gest_info'),
  // 用户孕周/修改
  UpdateGestInfoRes: Vue.resource(ApiVersion + 'obst/user/update_gest_info')
}

const ObstetricsApi = {
  // 孕妇健康提醒/查询
  queryObstTips: function (data) {
    return ObstetricsUrl.QueryObstTipsRes.save(data)
  },
  // 孕妇健康提醒/删除
  delObstTips: function (data) {
    return ObstetricsUrl.DelObstTipsRes.save(data)
  },
  // 风险评估/审批测评
  approveRisk: function (data) {
    return ObstetricsUrl.ApproveRiskRes.save(data)
  },
  // 风险评估/删除测评
  delSubjectRecord: function (data) {
    return ObstetricsUrl.DelSubjectRecordRes.save(data)
  },
  // 风险评估/查询题目
  querySubject: function (id) {
    return ObstetricsUrl.QuerySubjectRes.get({id: id})
  },
  // 风险评估/测评列表
  querySubjectRecord: function (data) {
    return ObstetricsUrl.QuerySubjectRecordRes.save(data)
  },
  // 风险评估/保存测评
  saveSubjectRecord: function (data) {
    return ObstetricsUrl.SaveSubjectRecordRes.save(data)
  },
  // 孕妇健康提醒/保存
  saveObstTips: function (data) {
    return ObstetricsUrl.SaveObstTipsRes.get(data)
  },
  // 用户孕周/查询
  queryGestInfo: function (data) {
    return ObstetricsUrl.QueryGestInfoRes.get(data)
  },
  // 用户孕周/修改
  updateGestInfo: function (data) {
    return ObstetricsUrl.UpdateGestInfoRes.save(data)
  }
}

export default ObstetricsApi
