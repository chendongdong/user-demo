import {GroupChat} from '../../api'

const state = {
  groupList: null,
  groupChatHisMsg: null,
  groupOptMsg: null,
  groupInfo: null,
  isLoadGroup: false
}

const getters = {
  isLoadGroup: state => state.isLoadGroup,
  groupInfo: state => state.groupInfo,
  groupOptMsg: state => state.groupOptMsg,
  groupChatHisMsg: state => state.groupChatHisMsg,
  groupList: state => state.groupList
}

const mutations = {
  GROUP_LIST (state, data) {
    state.groupList = data
  },
  GROUP_HIS_MSG (state, data) {
    state.groupChatHisMsg = data
  },
  GROUP_OPT_MSG (state, data) {
    state.groupOptMsg = data
  },
  GROUP_INFO (state, data) {
    state.groupInfo = data
  },
  LOAD_GROUP_STATE (state, data) {
    state.isLoadGroup = data
  }
}

const actions = {
  clearGroupChatOptMsg ({commit}) {
    commit('GROUP_OPT_MSG', '')
  },
  /**
   * 获取群聊天列表
   * @param commit
   */
  getGroupList ({commit}) {
    GroupChat.getGroupList().then(res => {
      if (res.ok) {
        commit('GROUP_LIST', res.data.data)
      }
    }).catch(err => {
      console.log('getGroupList--->', err.toString())
    })
  },
  /**
   * 获取群历史消息
   * @param commit
   * @param data
   */
  groupHisMsg ({commit}, data) {
    commit('LOAD_GROUP_STATE', true)
    GroupChat.groupHisMsg(data).then(res => {
      if (res.ok) {
        commit('GROUP_HIS_MSG', res.data.data)
      }
      commit('LOAD_GROUP_STATE', false)
    }).catch(err => {
      commit('LOAD_GROUP_STATE', false)
      console.log(err.toString())
    })
  },
  /**
   * 退出群聊
   * @param commit
   * @param data
   */
  removeGroup ({commit}, data) {
    GroupChat.removeGroup(data).then(res => {
      if (res.ok) {
        commit('GROUP_OPT_MSG', '删除成功')
      }
    }).catch(err => {
      console.log(err.toString())
    })
  },
  /**
   * 获取群信息
   * @param commit
   * @param data
   */
  getGroupInfo ({commit}, data) {
    GroupChat.getGroupInfo(data).then(res => {
      if (res.ok) {
        commit('GROUP_INFO', res.data.data)
      }
    }).catch(err => {
      console.log(err.toString())
    })
  },
  /**
   * 退出聊天页面时，设置消息表示已读
   * @param commit
   * @param data
   */
  setGroupChatMsg  ({commit}, data) {
    GroupChat.setChatMsg(data).then(res => {
      if (res.ok) {
      }
    }).catch(err => {
      console.log(err.toString())
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
