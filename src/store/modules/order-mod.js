import { Order } from '../../api'
const state = {
  bookingList: [],
  bookingDetail: {},
  bookingMsg: '',
  isLoadOrder: false
}

const getters = {
  bookingMsg: state => state.bookingMsg,
  bookingList: state => state.bookingList,
  bookingDetail: state => state.bookingDetail,
  isLoadOrder: state => state.isLoadOrder
}

const mutations = {
  BOOKING_LIST (state, datas) {
    state.bookingList = datas
  },
  BOOKING_DETAIL (state, datas) {
    state.bookingDetail = datas
  },
  CLEAR_USER_ORDER_MSG (state) {
    state.bookingMsg = ''
  },
  USER_ORDER_MSG (state, msg) {
    state.bookingMsg = msg
  },
  LOAD_STATE (state, data) {
    state.isLoadOrder = data
  }
}

const actions = {
  clearBookingMsg ({commit}) {
    commit('CLEAR_USER_ORDER_MSG')
  },
  getBookingList ({commit}, datas) {
    commit('LOAD_STATE', true)
    Order.getBookingList(datas).then(res => {
      if (res.ok) {
        let genStr = ['女', '男']
        let bedStr = ['占位', '不限', '单人间', '非单人间']
        let stateStr = ['排队中', '待确认', '待入住', '已入住', '拟出院', '已出院', '违约', '已取消']
        let origin = ['患者约床', '占床', '手动入住']
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].age != null && res.data.data[i].age.indexOf('岁') > 0) {
            res.data.data[i].age = res.data.data[i].age.split('岁')[0] + '岁'
          } else {
            res.data.data[i].age = '0岁'
          }
          let tempPro = ''
          for (let j = 0; j < res.data.data[i].priorities.length; j++) {
            tempPro = tempPro + res.data.data[i].priorities[j].param_name
            if (j < res.data.data[i].priorities.length - 1) {
              tempPro = tempPro + ','
            }
          }
          res.data.data[i].priorities = tempPro
          res.data.data[i].gender = genStr[res.data.data[i].gender]
          res.data.data[i].bed_type = bedStr[res.data.data[i].bed_type]
          /**
           *  判断是否支付约床订金
           *
           *  apply_validate: 订单是否有效:0=等待支付, 1=申请成功
           *  pay_deposits: 等待支付的金额
           */
          if (res.data.data[i].state === 0 &&
            res.data.data[i].apply_validate === 0 &&
            res.data.data[i].pay_deposits > 0) { // 需要支付约床定金
            res.data.data[i].state = '待支付'
          } else { // 不需要支付约床订金
            res.data.data[i].state = stateStr[res.data.data[i].state]
          }
          res.data.data[i].origin = origin[res.data.data[i].origin]
        }
        commit('BOOKING_LIST', res.data.data)
      }
      commit('LOAD_STATE', false)
    }).catch(err => {
      commit('LOAD_STATE', false)
      console.log('getOrderList------->', err.toString())
    })
  },
  getBookingDetail ({commit}, orderId) {
    Order.getBookingDetail(orderId).then(res => {
      if (res.ok) {
        let genStr = ['女', '男']
        let bedStr = ['占位', '不限', '单人间', '非单人间']
        let stateStr = ['排队中', '待确认', '待入住', '已入住', '拟出院', '已出院', '违约', '已取消']
        let origin = ['患者约床', '占床', '手动入住']
        if (res.data.data.age != null && res.data.data.age.indexOf('岁') > 0) {
          res.data.data.age = res.data.data.age.split('岁')[0] + '岁'
        } else {
          res.data.data.age = '0岁'
        }
        let tempPro = ''
        for (let j = 0; j < res.data.data.priorities.length; j++) {
          tempPro = tempPro + res.data.data.priorities[j].param_name
          if (j < res.data.data.priorities.length - 1) {
            tempPro = tempPro + ','
          }
        }
        res.data.data.priorities = tempPro
        res.data.data.gender = genStr[res.data.data.gender]
        res.data.data.bed_type = bedStr[res.data.data.bed_type]
        /**
         *  判断是否支付约床订金
         *
         *  apply_validate: 订单是否有效:0=等待支付, 1=申请成功
         *  pay_deposits: 等待支付的金额
         */
        if (res.data.data.state === 0 &&
          res.data.data.apply_validate === 0 &&
          res.data.data.pay_deposits > 0) { // 需要支付约床定金
          res.data.data.state = '待支付'
        } else { // 不需要支付约床订金
          res.data.data.state = stateStr[res.data.data.state]
        }
        res.data.data.origin = origin[res.data.data.origin]
        commit('BOOKING_DETAIL', res.data.data)
      }
    }).catch(err => {
      console.log('getOrderDetail------->', err.toString())
    })
  },
  clearUserOrderMsg ({commit}) {
    commit('CLEAR_USER_ORDER_MSG')
  },
  userConfirmOrder ({dispatch, commit}, id) {
    Order.userConfirm(id).then(res => {
      if (res.ok) {
        commit('USER_ORDER_MSG', res.data.data)
        dispatch('getBookingDetail', id)
      }
    }).catch(err => {
      console.log('userConfirm------->', err.toString())
    })
  },
  userRequeueOrder ({dispatch, commit}, id) {
    Order.userRequeue(id).then(res => {
      if (res.ok) {
        commit('USER_ORDER_MSG', res.data.data)
        dispatch('getBookingDetail', id)
      }
    }).catch(err => {
      console.log('userRequeue------->', err.toString())
    })
  },
  userCancelOrder ({dispatch, commit}, id) {
    Order.userCancel(id).then(res => {
      if (res.ok) {
        commit('USER_ORDER_MSG', res.data.data)
        dispatch('getBookingDetail', id)
      }
    }).catch(err => {
      console.log('userCancel------->', err.toString())
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
