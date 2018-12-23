import HomeApi from '../HomeApi'
const state = {
  hospital: {
    hospital: {},
    doctor_list: [],
    departments: [],
    point_dept: []
  },
  experts: []
}
const getters = {
  hospital: state => {
    return state.hospital
  },
  hos_hospital: state => {
    return state.hospital.hospital
  },
  hos_doctor_list: state => {
    return state.hospital.doctor_list
  },
  hos_departments: state => {
    return state.hospital.departments
  },
  hos_point_dept: state => {
    return state.hospital.point_dept
  },
  experts: state => {
    return state.experts
  }
}
const mutations = {
  GET_HOSPITAL (state, payload) {
    state.hospital = payload
  },
  GET_EXPERTS (state, payload) {
    state.experts = payload
  }
}
const actions = {
  getHospital ({commit}, id) {
    HomeApi.getHospital(id).then(res => {
      if (res.ok) {
        commit('GET_HOSPITAL', res.data.data)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  getEncrypHos ({commit}, id) {
    HomeApi.getEncrypHos(id).then(res => {
      if (res.ok) {
        commit('GET_HOSPITAL', res.data.data)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  getExperts ({commit}) {
    HomeApi.getExports().then(res => {
      if (res.ok) {
        commit('GET_EXPERTS', res.data.data)
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
