const state = {
  tabIdx: 0
}

const getters = {
  tabIdx: state => state.tabIdx
}

const mutations = {
  SET_TAB_IDX (state, idx) {
    state.tabIdx = idx
  }
}

const actions = {
  setTabIdx ({commit}, idx) {
    commit('SET_TAB_IDX', idx)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
