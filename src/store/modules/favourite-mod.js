import { Favourite } from '../../api'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  addFavouriteDoctorResult: {},
  addFavouriteArticleResult: {},
  delFavouriteDoctorResult: {},
  favouriteIdList: [],
  favouriteList: [],
  is_show_favourite_loading: true,
  is_favourite: false
}

const getters = {
  addFavouriteDoctorResult: state => state.addFavouriteDoctorResult,
  addFavouriteArticleResult: state => state.addFavouriteArticleResult,
  delFavouriteDoctorResult: state => state.delFavouriteDoctorResult,
  favouriteIdList: state => state.favouriteIdList,
  favouriteList: state => state.favouriteList,
  is_show_favourite_loading: state => state.is_show_favourite_loading,
  is_favourite: state => state.is_favourite
}
const mutations = {
  ADD_FAVOURITE_DOCTOR (state, data) {
    state.addFavouriteDoctorResult = data
  },
  ADD_FAVOURITE_ARTICLE (state, data) {
    state.addFavouriteArticleResult = data
  },
  DEL_FAVOURITE_DOCTOR (state, data) {
    state.delFavouriteDoctorResult = data
  },
  GET_FAVOURITE_ID_LIST (state, data) {
    state.is_show_favourite_loading = false
    state.favouriteIdList = data
  },
  GET_FAVOURITE_LIST (state, data) {
    state.is_show_favourite_loading = false
    state.favouriteList = data
  },
  CHECK_IS_FAVOURITE (state, data) {
    state.favouriteList = data
  },
  UPDATE_FAVOURITE_STATUS (state, isFavourite = false) {
    state.is_favourite = isFavourite
  },
  UPDATE_FAVOURITE_LOADING (state, isLoading = true) {
    state.is_show_favourite_loading = isLoading
  },
  CLEAN_FAVOURITE_DATA (state) {
    state.favouriteList = []
    state.favouriteIdList = []
  }
}
const actions = {

  /**
   * 添加收藏医生
   * @param commit
   * @param payload
   */
  addFavouriteDoctor ({commit}, payload) {
    Favourite.addFavouriteDoctor(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('ADD_FAVOURITE_DOCTOR', res.data.data)
      }
    }).catch(err => {
      console.error('action---addFavouriteDoctor----err=>', err.toString())
    })
  },
  /**
   * 添加收藏文章
   * @param commit
   * @param payload
   */
  addFavouriteArticle ({commit}, payload) {
    Favourite.addFavouriteArticle(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('ADD_FAVOURITE_ARTICLE', res.data.data)
      }
    }).catch(err => {
      console.error('action---addFavouriteArticle----err=>', err.toString())
    })
  },
  /**
   * 删除收藏医生/收藏文章
   * @param commit
   * @param payload
   */
  delFavouriteDoctor ({commit}, payload) {
    Favourite.delFavouriteDoctor(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('DEL_FAVOURITE_DOCTOR', res.data.data)
      }
    }).catch(err => {
      console.error('action---delFavouriteDoctor----err=>', err.toString())
    })
  },
  /**
   * 获取用户收藏的文章或者医生的id列表
   * @param commit
   * @param payload
   */
  getFavouriteIdList ({commit}, payload) {
    Favourite.getFavouriteIdList(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_FAVOURITE_ID_LIST', res.data.data)
      }
    }).catch(err => {
      console.error('action---getFavouriteIdList----err=>', err.toString())
    })
  },
  /**
   * 获取用户收藏的文章或者医生列表
   * @param commit
   * @param payload
   */
  getFavouriteList ({commit}, payload) {
    Favourite.getFavouriteList(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_FAVOURITE_LIST', res.data.data)
      }
    }).catch(err => {
      console.error('action---getFavouriteList----err=>', err.toString())
    })
  },
  /**
   * 检查是否已收藏
   * @param commit
   * @param payload
   */
  checkIsFavourite ({commit}, payload) {
    Favourite.checkIsFavourite(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('CHECK_IS_FAVOURITE', res.data.data)
      }
    }).catch(err => {
      console.error('action---checkIsFavourite----err=>', err.toString())
    })
  },
  /**
   * 更新isFavourite状态
   * @param commit
   * @param isFavourite
   */
  updateFavouriteStatus ({commit}, isFavourite) {
    commit('UPDATE_FAVOURITE_STATUS', isFavourite)
  },
  /**
   * 更新loading状态
   * @param commit
   * @param isLoading
   */
  updateFavouriteLoading ({commit}, isLoading) {
    commit('UPDATE_FAVOURITE_LOADING', isLoading)
  },
  /**
   * 清除store中收藏数据
   * @param {*} param0
   */
  cleanFavouriteData ({ commit }) {
    commit('CLEAN_FAVOURITE_DATA')
  }

}
export default {
  state,
  getters,
  mutations,
  actions
}
