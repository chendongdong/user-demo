import { Booking } from '../../api'
// import {SESSION_DATA} from '../../config/sessionStorage'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  // deptInfo: [],
  patientBookingResData: {
    isShow: false,
    data: ''
  },
  updateSubmitButton: {          // 发送短信验证按钮的状态
    isDisabled: false,
    title: '提交'
  },
  encryptionDetail: {
    isError: false,
    data: {}
  }
}

const getters = {
  patientBookingResData: state => state.patientBookingResData,
  updateSubmitButton: state => state.updateSubmitButton,
  encryptionDetail: state => state.encryptionDetail
}
const mutations = {
  BOOKING_RES_DATA (state, data) {
    state.patientBookingResData = Object.assign({isShow: true, data: {}}, data)
  },
  UPDATE_SUBMIT_BUTTON (state, btn) {
    state.updateSubmitButton = Object.assign({isDisabled: false, title: '提交'}, btn)
  },
  ENCRYTION_DETAIL (state, doc) {
    state.encryptionDetail = Object.assign({isError: false, data: {}}, doc)
  }
}
const actions = {
  /**
   * 患者约床
   */
  newBooking ({commit}, data) {
    let _this = data._this
    Booking.newBooking(data.form).then(res => {
      commit('BOOKING_RES_DATA', res.data)
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        /**
         *  判断是否支付约床订金
         *
         *  apply_validate: 订单是否有效:0=等待支付, 1=申请成功
         *  pay_deposits: 等待支付的金额
         */
        if (res.data.data.apply_validate === 0 ||
          res.data.data.apply_validate === null &&
          res.data.data.pay_deposits > 0) { // 需要支付约床定金
          _this.$router.push({
            name: 'ConfirmOrder',
            query: {
              id: res.data.data.id,
              orderId: res.data.data.trade_order,
              sourceRoute: 'Booking'
            }
          })
        } else {
          _this.$router.push({name: 'BookingResult', query: {id: res.data.data.id}})
        }
      } else {
        _this.alertMessage = {isShow: true, message: res.data.data || '预约失败, 请稍后再试'}
      }
      commit('UPDATE_SUBMIT_BUTTON', {isDisabled: false})
    }).catch(err => {
      console.log('err--->', err.toString())
      _this.alertMessage = {isShow: true, message: '预约失败'}
      commit('UPDATE_SUBMIT_BUTTON', {isDisabled: false})
    })
  },
  getEncryptionDoctorDetail ({commit}, docId) {
    Booking.getEncryptionDoctorDetail(docId).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        // let ret = res.data.data
        commit('ENCRYTION_DETAIL', {isError: false, data: res.data.data})
      } else {
        commit('ENCRYTION_DETAIL', {isError: true, data: res.data.data})
      }
    }).catch(err => {
      console.log('err--->', err.toString())
    })
  },
  getEncryptionDeptDetail ({commit}, deptId) {
    Booking.getEncryptionDeptDetail(deptId).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('ENCRYTION_DETAIL', {isError: false, data: res.data.data})
      } else {
        commit('ENCRYTION_DETAIL', {isError: true, data: res.data.data})
      }
    }).catch(err => {
      console.log('err--->', err.toString())
    })
  },
  updateSubmitBtn ({commit}, btn) {
    commit('UPDATE_SUBMIT_BUTTON', btn)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
