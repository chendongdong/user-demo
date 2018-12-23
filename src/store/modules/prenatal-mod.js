import { Prenatal } from '../../api'
// import { SESSION_DATA } from '../../config/sessionStorage'
import { RESULT_CODE } from '../../config/ResultCode'
import moment from 'moment'

const state = {
  courseDatas: null,
  prenataCourseMsg: '',
  prenatalList: [],
  prenatalInfo: [],
  prenatalCommonApplyResult: {},
  prenatalDoctorApplyResult: {},
  updatePrenatalInfoResult: {},
  PrenatalNotifyChectResult: {},
  isShowPrenatalLoadingOrder: false
}

const getters = {
  courseDatas: state => state.courseDatas,
  prenataCourseMsg: state => state.prenataCourseMsg,
  prenatalList: state => state.prenatalList,
  prenatalInfo: state => state.prenatalInfo,
  prenatalCommonApplyResult: state => state.prenatalCommonApplyResult,
  prenatalDoctorApplyResult: state => state.prenatalDoctorApplyResult,
  updatePrenatalInfoResult: state => state.updatePrenatalInfoResult,
  PrenatalNotifyChectResult: state => state.PrenatalNotifyChectResult,
  isShowPrenatalLoadingOrder: state => state.isShowPrenatalLoadingOrder
}

const mutations = {
  QUERY_COURSE  (state, data) {
    let listData = data.list
    for (let i = 0; i < listData.length; i++) {
      data.list[i].week = '星期' + '日一二三四五六'.charAt(new Date(listData[i].lecture_start).getDay())
      data.list[i].week += '(' + moment(listData[i].lecture_start).format('MM-DD') + ')'
      data.list[i].lecture_start = moment(listData[i].lecture_start).format('HH:mm')
      data.list[i].sign_start = moment(listData[i].sign_start).format('HH:mm')
      data.list[i].lecture_end = moment(listData[i].lecture_end).format('HH:mm')
      data.list[i].sign_end = moment(listData[i].sign_end).format('HH:mm')
    }
    state.courseDatas = data
  },
  PRENATAL_COURSE_MSG (state, data) {
    state.prenataCourseMsg = data
  },
  PRENATAL_COMMON_APPLY (state, data) {
    state.prenatalCommonApplyResult = data
  },
  PRENATAL_DOCTOR_APPLY (state, data) {
    state.prenatalDoctorApplyResult = data
  },
  GET_PRENATAL_LIST (state, data) {
    state.prenatalList = data
  },
  GET_PRENATAL_INFO (state, data) {
    state.prenatalInfo = data
  },
  UPDATE_PRENATAL_INFO (state, data) {
    state.updatePrenatalInfoResult = data
  },
  PRENATAL_NOTIFY_CHECT (state, data) {
    state.PrenatalNotifyChectResult = data
  },
  CLEAR_PRENATAL_MSG (state, data) {
    state.prenatalList = {}
    state.prenataCourseMsg = ''
    state.prenatalInfo = {}
    state.prenatalCommonApplyResult = {}
    state.prenatalDoctorApplyResult = {}
    state.updatePrenatalInfoResult = {}
  }
}

const actions = {
  /**
   * 清除产检相关信息
   * @param commit
   */
  clearPrenatalMsg ({commit}) {
    commit('CLEAR_PRENATAL_MSG')
  },
  /**
   * common申请产检
   * @param commit
   * @param datas
   */
  prenatalCommonApply ({commit}, datas) {
    Prenatal.prenatalCommonApply(datas).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('PRENATAL_COMMON_APPLY', res.data.data)
      }
    }).catch(err => {
      console.log('prenatalCommonApply------->', err.toString())
    })
  },
  /**
   * 医生申请产检
   * @param commit
   * @param datas
   */
  prenatalDoctorApply ({commit}, datas) {
    Prenatal.prenatalDoctorApply(datas).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('PRENATAL_DOCTOR_APPLY', res.data.data)
      }
    }).catch(err => {
      console.log('prenatalDoctorApply------->', err.toString())
    })
  },
  /**
   * 获取产检列表
   * @param commit
   * @param datas
   */
  getPrenatalList ({commit}, datas) {
    Prenatal.getPrenatalList(datas).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_PRENATAL_LIST', res.data.data)
      }
    }).catch(err => {
      console.log('getPrenatalList------->', err.toString())
    })
  },
  /**
   * 获取产检详情
   * @param commit
   * @param datas
   */
  getPrenatalInfo ({commit}, datas) {
    Prenatal.getPrenatalInfo(datas).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_PRENATAL_INFO', res.data.data)
      }
    }).catch(err => {
      console.log('getPrenatalInfo------->', err.toString())
    })
  },
  /**
   * 更新产检信息
   * @param commit
   * @param datas
   */
  updatePrenatalInfo ({commit}, datas) {
    Prenatal.updatePrenatalInfo(datas).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('UPDATE_PRENATAL_INFO', res.data.data)
      }
    }).catch(err => {
      console.log('updatePrenatalInfo------->', err.toString())
    })
  },
  /**
   * 通知产检
   * @param commit
   * @param id
   */
  prenatalNotifyChect ({commit}, id) {
    Prenatal.prenatalNotifyChect(id).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('PRENATAL_NOTIFY_CHECT', res.data.data)
      }
    }).catch(err => {
      console.log('prenatalNotifyChect------->', err.toString())
    })
  },
  /**
   * 查询课程列表
   * @param commit
   * @param data
   */
  queryCourse ({commit}, data) {
    Prenatal.queryCourse(data).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('QUERY_COURSE', res.data.data)
      }
    }).catch(err => {
      console.log('queryCourse--err---', err)
    })
  },
  /**
   * 预约或取消课程
   * @param commit
   * @param data
   */
  attendCourse ({commit}, data) {
    Prenatal.attendCourse(data).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('PRENATAL_COURSE_MSG', '操作成功')
      }
    }).catch(err => {
      console.log('attendCourse--err---', err)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
