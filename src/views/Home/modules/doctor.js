import HomeApi from '../HomeApi'

const state = {
  doctor: {
    doctor: {},
    doc_detail: {},
    doc_dept: {},
    doc_hospital: {},
    same_level_docs: []
  }
}
const getters = {
  doctor: state => {
    return state.doctor
  },
  doc_doctor: state => {
    return state.doctor.doctor
  },
  doc_doc_detail: state => {
    return state.doctor.doc_detail
  },
  doc_doc_dept: state => {
    return state.doctor.doc_dept
  },
  doc_doc_hos: state => {
    return state.doctor.doc_hospital
  },
  doc_same_level_docs: state => {
    return state.doctor.same_level_docs
  }
}
const mutations = {
  GET_HOME_DOCTOR (state, payload) {
    state.doctor = payload
  }
}
const actions = {
  getDoctor ({commit}, id) {
    HomeApi.getDoctor(id).then(res => {
      if (res.ok) {
        commit('GET_HOME_DOCTOR', res.data.data)
      }
    }).catch(err => {
      console.log(err)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
