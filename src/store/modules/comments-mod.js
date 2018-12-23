import {Comments} from '../../api'
import moment from 'moment'

const state = {
  commentList: {list: []},
  commentMsg: '',
  favorComMsg: ''
}

const getters = {
  commentList: state => state.commentList,
  favorComMsg: state => state.favorComMsg,
  commentMsg: state => state.commentMsg
}

const mutations = {
  COMMENT_LIST (state, data) {
    let listData = data.list
    for (let i = 0; i < listData.length; i++) {
      data.list[i].created = moment(listData[i].created).format('YYYY-MM-DD HH:mm')
      data.list[i].updated = moment(listData[i].created).format('YYYY-MM-DD HH:mm')
    }
    state.commentList = data
  },
  COMMENT_MSG (state, data) {
    state.commentMsg = data
  },
  FAVOR_MSG (state, data) {
    state.favorComMsg = data
  }
}

const actions = {
  clearCommentMsg ({commit}) {
    commit('COMMENT_MSG', '')
    commit('FAVOR_MSG', '')
  },
  getComments ({commit}, data) {
    Comments.getComments(data).then(res => {
      if (res.ok) {
        commit('COMMENT_LIST', res.data.data)
      }
    }).catch(err => {
      console.log('getComments--->', err.toString())
    })
  },
  commentsFavor ({commit}, data) {
    Comments.commentsFavor(data).then(res => {
      if (res.ok) {
        commit('FAVOR_MSG', res.data.data)
      }
    })
  },
  commentsDo ({commit}, data) {
    Comments.commentsDo(data).then(res => {
      if (res.ok) {
        commit('COMMENT_MSG', res.data.data)
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
