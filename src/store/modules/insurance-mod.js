import { Insurance } from '../../api'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  insurCategorys: null,
  insurCpny: null,
  insurOrders: null,
  isLoadInsur: false
}

const getters = {
  insurCategorys: state => state.insurCategorys,
  insurCpny: state => state.insurCpny,
  insurOrders: state => state.insurOrders,
  isLoadInsur: state => state.isLoadInsur
}
const mutations = {
  GET_INSUR_CATE (state, data) {
    state.insurCategorys = data
  },
  QUERY_CPNY (state, data) {
    state.insurCpny = data
  },
  GET_INSUR_ORDERS (state, data) {
    state.insurOrders = data
  },
  STATE_LOAD (state, data) {
    state.isLoadInsur = data
  }
}
const actions = {
  /**
   * 查询保险种类
   * @param commit
   * @param payload
   */
  getInsurCate ({commit}, payload) {
    commit('STATE_LOAD', true)
    Insurance.getInsurCate(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_INSUR_CATE', res.data.data)
      }
      commit('STATE_LOAD', false)
    }).catch(err => {
      commit('STATE_LOAD', false)
      console.error('getInsurCate---->err=', err.toString())
    })
  },
  /**
   * 获取保险订单
   * @param commit
   * @param payload
   */
  getInsurOrders ({commit}, payload) {
    commit('STATE_LOAD', true)
    Insurance.getInsurOrders(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_INSUR_ORDERS', res.data.data)
      }
      commit('STATE_LOAD', false)
    }).catch(err => {
      commit('STATE_LOAD', false)
      console.error('getInsurCate---->err=', err.toString())
    })
  },
  /**
   * 查询保险公司
   * @param commit
   * @param payload
   */
  queryCpny ({commit}, payload) {
    Insurance.queryCpny(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('QUERY_CPNY', res.data.data)
      }
    }).catch(err => {
      console.error('queryCpny---->err=', err.toString())
    })
  },
  updateInsurData () {
    Insurance.updateInsurData().then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
      }
    })
  },
  subInsurOrder ({commit}, data) {
    Insurance.subInsurOrder(data).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
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
