
const state = {
  isShowLoading: true
}

const getters = {
  isShowLoading: state => state.isShowLoading
}
const mutations = {
  UPDATE_LOADING (state, isLoading = true) {
    state.isShowLoading = isLoading
  }
}
const actions = {

  /**
   * 更新loading状态
   * @param commit
   * @param isLoading
   */
  updateLoading ({commit}, isLoading) {
    commit('UPDATE_LOADING', isLoading)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
