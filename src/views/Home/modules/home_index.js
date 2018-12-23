import HomeApi from '../HomeApi'
const state = {
  home: {
    banner_list: [],
    doctor_list: [],
    inner_cate: [],
    pc_hospital_list: []
  },
  recomDocs: {list: []},
  isLoadingHome: false,
  cityInfo: null
}
const getters = {
  home: state => {
    return state.home
  },
  home_doctor_list: state => {
    return state.home.doctor_list
  },
  home_inner_cate: state => {
    return state.home.inner_cate
  },
  home_pc_hospital_list: state => {
    return state.home.pc_hospital_list
  },
  recomDocs: state => state.recomDocs,
  isLoadingHome: state => state.isLoadingHome,
  cityInfo: state => state.cityInfo
}
const mutations = {
  GET_HOME_INDEX (state, payload) {
    state.home = payload
  },
  GET_RECOM_DOC (state, data) {
    state.recomDocs = data
  },
  STATE_LOAD (state, data) {
    state.isLoadingHome = data
  },
  GET_CITY_INFO (state, data) {
    state.cityInfo = data
  }
}
const actions = {
  clearRecomData ({commit}) {
    commit('GET_RECOM_DOC', {list: []})
  },
  getHomeIndex ({commit}) {
    HomeApi.getHomeIndex().then(res => {
      if (res.ok) {
        commit('GET_HOME_INDEX', res.data.data)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  getRecomDoc ({commit}, payload) {
    commit('STATE_LOAD', true)
    HomeApi.getRecomDoc(payload).then(res => {
      if (res.ok) {
        commit('GET_RECOM_DOC', res.data.data)
      }
      commit('STATE_LOAD', false)
    }).catch(err => {
      commit('STATE_LOAD', false)
      console.log('getRecomDoc---err=', err)
    })
  },
  getIPCity ({commit}) {
    HomeApi.getIPCity().then(res => {
      if (res.ok) {
        commit('GET_CITY_INFO', res.data.data)
      }
    }).catch(err => {
      console.log('getIPCity---err=', err)
    })
  },
  getLocationCity ({commit, dispatch}, payload) {
    HomeApi.getLocationCity(payload).then(res => {
      if (res.ok) {
        commit('GET_CITY_INFO', res.data.data)
        // 没有获取到城市地址
        if (!res.data.data.area_name) {
          dispatch('getIPCity')
        }
      }
    }).catch(err => {
      console.log('getLocationCity---err=', err)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
