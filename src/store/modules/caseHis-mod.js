import {CaseHis} from '../../api'

const state = {
  caseList: [],
  caseMsg: '',
  caseInfo: {},
  oneCaseInfo: {}
}

const getters = {
  oneCaseInfo: state => state.oneCaseInfo,
  caseInfo: state => state.caseInfo,
  caseList: state => state.caseList,
  caseMsg: state => state.caseMsg
}

const mutations = {
  CASELIST (state, data) {
    state.caseList = data
  },
  OPERATE_CASE (state, msg) {
    state.caseMsg = msg
  },
  CLEAR_CASE_MSG (state) {
    state.caseMsg = ''
  },
  CASE_INFO (state, data) {
    state.caseInfo = data
  },
  CASE_ONE_INFO (state, data) {
    state.oneCaseInfo = data
  }
}

const actions = {
  clearCaseMsg ({commit}) {
    commit('CLEAR_CASE_MSG')
  },
  getCaseList ({commit}, id) {
    CaseHis.getCaseList(id).then(res => {
      if (res.ok) {
        commit('CASELIST', res.data.data.reverse())
      }
    }).catch(err => {
      console.log('getCaseList--->', err.toString())
    })
  },
  newCase ({commit}, data) {
    CaseHis.newCase(data).then(res => {
      if (res.ok) {
        commit('OPERATE_CASE', res.data.data)
        clearTimeout(timer)
        var timer = setTimeout(() => {
          window.history.back()
        }, 2000)
      }
    }).catch(err => {
      console.log('newCase--->', err.toString())
    })
  },
  baseCaseInfo ({commit}) {
    CaseHis.getCaseInfo().then(res => {
      if (res.ok) {
        commit('CASE_INFO', res.data.data)
      }
    }).catch(err => {
      console.log('baseCaseInfo--->', err.toString())
    })
  },
  saveCaseInfo ({commit}, data) {
    CaseHis.saveCaseInfo(data).then(res => {
      if (res.ok) {
        commit('OPERATE_CASE', res.data.data)
      }
    }).catch(err => {
      console.log('saveCaseInfo--->', err.toString())
    })
  },
  getOneCase ({commit}, id) {
    CaseHis.getOneCase(id).then(res => {
      if (res.ok) {
        commit('CASE_ONE_INFO', res.data.data)
      }
    }).catch(err => {
      console.log('getOneCase--->', err.toString())
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
