import { Articles } from '../../api'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  userAgreement: '',
  articlesList: {result: [], total: 0},
  articleInfo: {},
  articleMsg: '',
  articleType: null
}
const getters = {
  articleType: state => state.articleType,
  articleMsg: state => state.articleMsg,
  userAgreement: state => state.userAgreement,
  articlesList: state => state.articlesList,
  articleInfo: state => state.articleInfo
}
const mutations = {
  GET_USER_AGREEMENT (state, data) {
    state.userAgreement = data
  },
  GET_ARTICLES (state, data) {
    state.articlesList = data
  },
  GET_ARTICLE_INFO (state, data) {
    state.articleInfo = data
  },
  CLEAR_ARTICLES_DATA (state) {
    state.articlesList = {result: [], total: 0}
    state.articleInfo = {}
  },
  ARTICLE_FAVOR (state, data) {
    state.articleMsg = data
  },
  GET_ARTICLE_TYPE (state, data) {
    state.articleType = data
  }
}
const actions = {
  clearArticleMsg ({commit}) {
    commit('ARTICLE_FAVOR', '')
  },
  /**
   * 意见反馈
   */
  suggest ({commit}, data) {
    Articles.suggest(data.data).then(res => {
      if (res.ok) {
        data._this.openMsg(res.data.data || '意见反馈成功')
        setTimeout(function () {
          data._this.isBtnDisabled = false
          window.history.back()
        }, 2000)
      }
    }).catch(err => {
      data._this.isBtnDisabled = false
      console.error('suggest---->err=', err)
    })
  },
  /**
   * 根据文章类型获取文章分页
   */
  getArticles ({commit}, art) {
    Articles.getArticles(art).then(res => {
      if (res.ok) {
        commit('GET_ARTICLES', res.data.data)
      }
    }).catch(err => {
      console.error('getArticles---->err=', err.toString())
    })
  },
  /**
   * 获取文章详细信息
   */
  getArticleInfo ({commit}, artId) {
    Articles.getArticleInfo(artId).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_ARTICLE_INFO', res.data.data)
        if (artId === 25) { // 用户协议的ID是25
          commit('GET_USER_AGREEMENT', res.data.data)
        }
      } else {
        // console.log('suggest--else------->', res)
      }
    }).catch(err => {
      console.log('getArticleInfo--err-------->', err)
    })
  },
  articleFavor ({commit}, artId) {
    Articles.articleFavor(artId).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('ARTICLE_FAVOR', res.data.data)
      }
    }).catch(err => {
      console.log('articleFavor--err-------->', err)
    })
  },
  /**
   * 清除文章信息
   * @param commit
   */
  clearArticlesData ({commit}) {
    commit('CLEAR_ARTICLES_DATA')
  },
  articleTypesByCode ({commit}, data) {
    Articles.articleTypesByCode(data).then(res => {
      if (res.ok) {
        commit('GET_ARTICLE_TYPE', res.data.data)
      }
    }).catch(err => {
      console.log('articleTypesByCode---err=', err)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}

