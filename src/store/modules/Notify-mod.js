import { Notify } from '../../api'
// import {SESSION_DATA} from '../../config/sessionStorage'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  msgNotify: {list: []},
  msgNotifyInfo: {},
  setMsgNotifyReadResult: {},
  is_show_notify_loading: true,
  notifyTemplate: []
}

const getters = {
  msgNotify: state => state.msgNotify,
  msgNotifyInfo: state => state.msgNotifyInfo,
  setMsgNotifyReadResult: state => state.setMsgNotifyReadResult,
  is_show_notify_loading: state => state.is_show_notify_loading,
  notifyTemplate: state => state.notifyTemplate
}
const mutations = {
  MSG_NOTIFY (state, data) {
    state.is_show_notify_loading = false
    state.msgNotify = data
  },
  GET_ONE_MSG_NOTIFY (state, data) {
    state.msgNotifyInfo = data
  },
  SET_MSG_NOTIFY_READ (state, data) {
    state.setMsgNotifyReadResult = data
  },
  FIND_NOTIFY_TEMPLATE (state, data) {
    state.is_show_notify_loading = false
    state.notifyTemplate = data
  },
  UPDATE_NOTIFY_LOADING (state, isLoading = true) {
    state.is_show_notify_loading = isLoading
  }
}
const actions = {
  clearNotify ({commit}) {
    commit('MSG_NOTIFY', {list: []})
  },
  /**
   * 获取消息提醒
   * @param commit
   * @param payload
   */
  getMsgNotify ({commit}, payload) {
    Notify.getMsgNotify(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('MSG_NOTIFY', res.data.data)
      } else {
        commit('UPDATE_NOTIFY_LOADING', false)
      }
    }).catch(err => {
      commit('UPDATE_NOTIFY_LOADING', false)
      console.error('action---gteSmsNotify----err=>', err.toString())
    })
  },
  /**
   * 获取单条消息提醒
   * @param commit
   * @param id
   */
  getOneMsgNotify ({commit}, id) {
    Notify.getOneMsgNotify(id).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_ONE_MSG_NOTIFY', res.data.data)
      }
    }).catch(err => {
      console.error('action---getOneMsgNotify----err=>', err.toString())
    })
  },
  /**
   * 设置消息已读
   * @param commit
   * @param payload
   */
  setMsgNotifyRead ({commit}, payload) {
    Notify.setMsgNotifyRead(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('SET_MSG_NOTIFY_READ', res.data.data)
      }
    }).catch(err => {
      console.error('action---setMsgNotifyRead----err=>', err.toString())
    })
  },
  /**
   * 查找消息模板
   * @param {*} commit
   * @param {*} payload
   */
  findNotifyTemplate ({commit}, payload) {
    Notify.findNotifyTemplate(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('FIND_NOTIFY_TEMPLATE', res.data.data)
      }
    }).catch(err => {
      console.error('action---findNotifyTemplate----err=>', err.toString())
    })
  },
  /**
   * 更新loading状态
   * @param commit
   * @param isLoading
   */
  updateNotifyLoading ({ commit }, isLoading) {
    commit('UPDATE_NOTIFY_LOADING', isLoading)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
