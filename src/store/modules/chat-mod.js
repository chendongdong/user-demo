import {Chat} from '../../api'

const state = {
  chatHistory: [],
  searchQAList: null,
  isLoadChatQue: false,
  isLoadChatHis: false,
  serviceNum: null,
  unreadChatList: null
}

const getters = {
  unreadChatList: state => state.unreadChatList,
  serviceNum: state => state.serviceNum,
  isLoadChatQue: state => state.isLoadChatQue,
  isLoadChatHis: state => state.isLoadChatHis,
  chatHistory: state => state.chatHistory,
  searchQAList: state => state.searchQAList
}

const mutations = {
  CHAT_LIST (state, data) {
    state.chatHistory = data
  },
  SEARCH_QA (state, data) {
    state.searchQAList = data
  },
  LOAD_HIS_STATE (state, data) {
    state.isLoadChatHis = data
  },
  LOAD_QUE_STATE (state, data) {
    state.isLoadChatQue = data
  },
  SERVICE_NUM (state, data) {
    state.serviceNum = data
  },
  UNREAD_CHAT_LIST (state, data) {
    state.unreadChatList = data
  }
}

const actions = {
  clearChatOptMsg ({commit}) {
    commit('GROUP_OPT_MSG', '')
  },
  getChatHis ({commit}, data) {
    commit('LOAD_HIS_STATE', true)
    Chat.getChatHis(data).then(res => {
      if (res.ok) {
        commit('CHAT_LIST', res.data.data)
      }
      commit('LOAD_HIS_STATE', false)
    }).catch(err => {
      commit('LOAD_HIS_STATE', false)
      console.log('getChatHis--->', err.toString())
    })
  },
  getSearchQA ({commit}, data) {
    commit('LOAD_QUE_STATE', true)
    Chat.getSearchQA(data).then(res => {
      if (res.ok) {
        commit('SEARCH_QA', res.data.data)
      }
      commit('LOAD_QUE_STATE', false)
    }).catch(err => {
      commit('LOAD_QUE_STATE', false)
      console.log('getChatHis--->', err.toString())
    })
  },
  getServiceNum ({commit}) {
    Chat.getServiceNum().then(res => {
      if (res.ok) {
        commit('SERVICE_NUM', res.data.data)
      }
    }).catch(err => {
      console.log('getServieNum--->', err.toString())
    })
  },
  getUnreadChatList ({commit}, data) {
    Chat.getUnreadChatList(data).then(res => {
      if (res.ok) {
        commit('UNREAD_CHAT_LIST', res.data.data)
      }
    }).catch(err => {
      console.log('getUnreadChatList--->', err.toString())
    })
  },
  setMsgRead ({commit}, data) {
    Chat.setMsgRead(data).then(res => {
      if (res.ok) {

      }
    }).catch(err => {
      console.log('unreadChatList--->', err.toString())
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
