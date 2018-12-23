import { User } from '../../api'
import DateUtil from '../../utils/DateUtil'
// import {SESSION_DATA} from '../../config/sessionStorage'
// import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  userData: {},
  returnMsg: ''
}

const getters = {
  userData: state => state.userData,
  returnMsg: state => state.returnMsg
}
const mutations = {
  GET_USER_DATA (state, data) {
    state.userData = data
  },
  EDIT_USER_DATA (state, data) {
    state.returnMsg = data
  },
  CLEAR_USER_MSG (state, data) {
    state.returnMsg = data
  }
}
const actions = {
  clearUserMsg ({commit}) {
    var data = ''
    commit('CLEAR_USER_MSG', data)
  },
  getUser ({commit}) {
    User.getUser().then(res => {
      if (res.ok) {
        if (res.data.data.born_date !== null) {
          let date = DateUtil.getDate(0)
          let days = DateUtil.daysBetween(date, res.data.data.born_date)
          res.data.data.born_date = parseInt(days / 365)
        }
        commit('GET_USER_DATA', res.data.data)
      }
    }).catch(err => {
      console.error('action---loadImg----err=>', err.toString())
    })
  },
  editUser ({commit}, payload) {
    User.editUser(payload).then(res => {
      if (res.ok) {
        commit('EDIT_USER_DATA', res.data.data)
      }
    }).catch(err => {
      console.error('action---loadImg----err=>', err.toString())
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
