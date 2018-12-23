/**
 * Created by Fussa on 2016/11/18 下午3:17
 */

import {Doctor} from '../../api'
import {RESULT_CODE} from '../../config/ResultCode'

const state = {
  doctorPositions: [],
  doctorInfo: '',
  doctorApprovalList: [],
  resultMsg: [],
  certificate: [],
  doctorMenu: {},
  improveInfoResponse: {}
}
const getters = {
  doctorPositions: state => state.doctorPositions,
  doctorInfo: state => state.doctorInfo,
  resultMsg: state => state.resultMsg,
  certificate: state => state.certificate,
  doctorApprovalList: state => state.doctorApprovalList,
  doctorMenu: state => state.doctorMenu,
  improveInfoResponse: state => state.improveInfoResponse
}
const mutations = {
  GET_DOCTOR_POSITIONS (state, data) {
    state.doctorPositions = data
  },
  GET_DOCTOR_INFO (state, data) {
    state.doctorInfo = data
  },
  EDIT_DOCTOR_INFO (state, data) {
    state.resultMsg = data
  },
  GET_DOCTOR_APPROVALLIST (state, data) {
    state.doctorApprovalList = data
  },
  DOCTOR_APPROVAL (state, data) {
    state.resultMsg = data
  },
  GET_CERTIFICATE (state, data) {
    state.certificate = data
  },
  DOCTOR_MENU (state, data) {
    state.doctorMenu = data
  },
  IMPROVE_INFO_RESPONSE (state, data) {
    state.improveInfoResponse = data
  }
}
const actions = {
  getDoctorPositions ({commit}) {
    Doctor.getProfession().then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_DOCTOR_POSITIONS', res.data.data)
      }
    }).catch(err => {
      console.log('getDoctorPositions--err-------->', err)
    })
  },
  getDoctorInfo ({commit}, docId) {
    Doctor.getDoctorInfo(docId).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_DOCTOR_INFO', res.data.data)
      }
    }).catch(err => {
      console.log('getDoctorInfo--err-------->', err)
    })
  },
  editDoctorInfo ({commit}, doctor) {
    Doctor.editDoctorInfo(doctor).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('EDIT_DOCTOR_INFO', res.data.data)
      }
    }).catch(err => {
      console.log('editDoctorInfo--err-------->', err)
    })
  },
  getDocApprovalList ({commit}) {
    Doctor.getDocApprovalList().then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_DOCTOR_APPROVALLIST', res.data.data)
      }
    }).catch(err => {
      console.log('GET_DOCTOR_APPROVALLIST--err-------->', err)
    })
  },
  approvalResult ({commit}, datas) {
    Doctor.getDocApprovalState(datas.id, datas.status, datas.msg).then(res => {
      let msgg = ''
      if (res.ok) {
        msgg = res.data.data
      }
      commit('DOCTOR_APPROVAL', msgg)
    }).catch(err => {
      console.log('getDocApprovalState------->', err.toString())
    })
  },
  getCerdential ({commit}, id) {
    Doctor.getCerdential(id).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_CERTIFICATE', res.data.data)
      }
    }).catch(err => {
      console.log('getCerdential--err-------->', err)
    })
  },
  improveInfo ({commit}, data) {
    Doctor.improveInfo(data).then(res => {
      commit('IMPROVE_INFO_RESPONSE', res.data)
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
      }
    }).catch(err => {
      console.log('getCerdential--err-------->', err)
    })
  },
  getDoctorAuth ({commit}, doctorId) {
    Doctor.getDoctorMenu(doctorId, 2).then(res => {
      if (res.ok) {
        commit('DOCTOR_MENU', res.data.data)
      }
    }).catch(err => {
      console.log('getDoctorAuth--err-------->', err)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}

