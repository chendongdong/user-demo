import { Obstetrics } from '../../api'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  obstTips: {},  // 孕妇健康提醒/查询
  obstRiskSubject: {}, // 风险评估/查询题目
  obstRiskSubjectRecord: {}, // 风险评估/测评列表
  gestInfo: {}, // 用户孕周/查询
  delObstTipsResult: {}, // 孕妇健康提醒/删除
  approveRiskResult: {}, // 风险评估/审批测评
  delSubjectRecordResult: {}, // 风险评估/删除测评
  saveSubjectRecordResult: {}, // 风险评估/保存测评
  saveObstTipsResult: {}, // 孕妇健康提醒/保存
  updateGestInfoResult: {} // 用户孕周/修改
}

const getters = {
  obstTips: state => state.obstTips,
  obstRiskSubject: state => state.obstRiskSubject,
  obstRiskSubjectRecord: state => state.obstRiskSubjectRecord,
  gestInfo: state => state.gestInfo,
  delObstTipsResult: state => state.delObstTipsResult,
  approveRiskResult: state => state.approveRiskResult,
  delSubjectRecordResult: state => state.delSubjectRecordResult,
  saveSubjectRecordResult: state => state.saveSubjectRecordResult,
  saveObstTipsResult: state => state.saveObstTipsResult,
  updateGestInfoResult: state => state.updateGestInfoResult
}
const mutations = {
  QUERY_OBST_TIPS (state, data) {
    state.obstTips = data
  },
  DEL_OBST_TIPS (state, data) {
    state.delObstTipsResult = data
  },
  APPROVE_RISK (state, data) {
    state.approveRiskResult = data
  },
  DEL_SUBJECT_RECORD (state, data) {
    state.delSubjectRecordResult = data
  },
  QUERY_SUBJECT (state, data) {
    state.obstRiskSubject = data
  },
  QUERY_SUBJECT_RECORD (state, data) {
    state.obstRiskSubjectRecord = data
  },
  SAVE_SUBJECT_RECORD (state, data) {
    state.saveSubjectRecordResult = data
  },
  SAVE_OBST_TIPS (state, data) {
    state.saveObstTipsResult = data
  },
  QUERY_GEST_INFO (state, data) {
    state.gestInfo = data
  },
  UPDATE_GEST_INFO (state, data) {
    state.updateGestInfoResult = data
  }

}
const actions = {
  /**
   * 孕妇健康提醒/查询
   */
  queryObstTips ({commit}, payload) {
    Obstetrics.queryObstTips(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('QUERY_OBST_TIPS', res.data.data)
      }
    }).catch(err => {
      console.error('action---queryObstTips----err=>', err.toString())
    })
  },
  /**
   * 孕妇健康提醒/删除
   */
  delObstTips ({commit}, payload) {
    Obstetrics.delObstTips(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('DEL_OBST_TIPS', res.data.data)
      }
    }).catch(err => {
      console.error('action---delObstTips----err=>', err.toString())
    })
  },
  /**
   * 风险评估/审批测评
   */
  approveRisk ({commit}, payload) {
    Obstetrics.approveRisk(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('APPROVE_RISK', res.data.data)
      }
    }).catch(err => {
      console.error('action---approveRisk----err=>', err.toString())
    })
  },
  /**
   * 风险评估/删除测评
   */
  delSubjectRecord ({commit}, payload) {
    Obstetrics.delSubjectRecord(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('DEL_SUBJECT_RECORD', res.data.data)
      }
    }).catch(err => {
      console.error('action---delSubjectRecord----err=>', err.toString())
    })
  },
  /**
   * 风险评估/查询题目
   */
  querySubject ({commit}, payload) {
    Obstetrics.querySubject(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('QUERY_SUBJECT', res.data.data)
      }
    }).catch(err => {
      console.error('action---querySubject----err=>', err.toString())
    })
  },
  /**
   * 风险评估/测评列表
   */
  querySubjectRecord ({commit}, payload) {
    Obstetrics.querySubjectRecord(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('QUERY_SUBJECT_RECORD', res.data.data)
      }
    }).catch(err => {
      console.error('action---querySubjectRecord----err=>', err.toString())
    })
  },
  /**
   * 风险评估/保存测评
   */
  saveSubjectRecord ({commit}, payload) {
    Obstetrics.saveSubjectRecord(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('SAVE_SUBJECT_RECORD', res.data.data)
      }
    }).catch(err => {
      console.error('action---saveSubjectRecord----err=>', err.toString())
    })
  },
  /**
   * 孕妇健康提醒/保存
   */
  saveObstTips ({commit}, payload) {
    Obstetrics.saveObstTips(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('SAVE_OBST_TIPS', res.data.data)
      }
    }).catch(err => {
      console.error('action---saveObstTips----err=>', err.toString())
    })
  },
  /**
   * 用户孕周/查询
   */
  queryGestInfo ({commit}, payload) {
    Obstetrics.queryGestInfo(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('QUERY_GEST_INFO', res.data.data)
      }
    }).catch(err => {
      console.error('action---queryGestInfo----err=>', err.toString())
    })
  },
  /**
   *  用户孕周/修改
   */
  updateGestInfo ({commit}, payload) {
    Obstetrics.updateGestInfo(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('UPDATE_GEST_INFO', res.data.data)
      }
    }).catch(err => {
      console.error('action---updateGestInfo----err=>', err.toString())
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
