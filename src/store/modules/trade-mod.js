import { Trade } from '../../api'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  accountPay: {},
  accountRecharge: {},
  CheckOrderState: {},
  aliPayRes: {},
  weChatQrCodePayRes: {},
  tradeRecordInfo: {},
  weChatPayWepParams: {},
  weChatPayResultRes: {}
}

const getters = {
  accountPay: state => state.accountPay,
  accountRecharge: state => state.accountRecharge,
  CheckOrderState: state => state.CheckOrderState,
  aliPayRes: state => state.aliPayRes,
  weChatQrCodePayRes: state => state.weChatQrCodePayRes,
  tradeRecordInfo: state => state.tradeRecordInfo,
  weChatPayWepParams: state => state.weChatPayWepParams,
  weChatPayResultRes: state => state.weChatPayResultRes
}
const mutations = {
  ACCOUNT_PAY (state, data) {
    state.accountPay = data
  },
  ACCOUNT_RECHARGE (state, data) {
    state.accountRecharge = data
  },
  CHECK_ORDER_STATE (state, data) {
    state.CheckOrderState = data
  },
  ALI_PAY (state, res) {
    state.aliPayRes = res
  },
  WE_CHAT_QR_CODE_PAY (state, data) {
    state.weChatQrCodePayRes = data
  },
  GET_TRADE_RECORD (state, data) {
    state.tradeRecordInfo = data
  },
  GET_WE_CHAT_PAY_WEP_PARAM (state, data) {
    state.weChatPayWepParams = data
  },
  GET_WE_CHAT_PAY_RESULT (state, data) {
    state.weChatPayResultRes = data
  },
  CLEAR_TRADE_DATA (state) {
    state.accountPay = null
    state.accountRecharge = null
    state.CheckOrderState = {}
    state.aliPayRes = null
    state.weChatQrCodePayRes = {}
    state.tradeRecordInfo = {}
    state.weChatPayWepParams = {}
    state.weChatPayResultRes = {}
  }
}
const actions = {
  /**
   * 账户支付
   */
  accountPay ({commit}, payload) {
    let _this = payload._this
    Trade.accountPay(payload.form).then(res => {
      _this.isShowPay = false
      _this.isPaying = false
      _this.isShowCheckPassword = false
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('ACCOUNT_PAY', res.data.data)
      } else {
        _this.$vux.alert.show({
          title: '提示',
          content: res.data.data || '支付失败, 请稍后再试'
        })
      }
    }).catch(err => {
      console.error('accountPay---->err=', err.toString())
    })
  },
  /**
   * 账户充值
   */
  accountRecharge ({commit}, payload) {
    let _this = payload._this
    Trade.accountRecharge(payload.form).then(res => {
      _this.isShowPay = false
      _this.isPaying = false
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('ACCOUNT_RECHARGE', res.data.data)
      } else {
        _this.$vux.alert.show({
          title: '提示',
          content: res.data.data || '支付失败, 请稍后再试'
        })
      }
    }).catch(err => {
      console.error('accountRecharge---->err=', err.toString())
    })
  },
  /**
   * 检查订单状态
   */
  checkOrderState ({commit}, payload) {
    Trade.checkOrderState(payload).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('CHECK_ORDER_STATE', res.data.data)
      }
    }).catch(err => {
      console.error('checkOrderState---->err=', err.toString())
    })
  },
  /**
   * 支付宝支付
   */
  aliPay ({commit}, payload) {
    Trade.aliPay(payload).then(res => {
      if (res.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('ALI_PAY', res)
      }
    }).catch(err => {
      console.error('aliPay---->err=', err.toString())
    })
  },
  /**
   * 微信支付
   */
  weChatQrCodePay ({commit}, payload) {
    Trade.weChatQrCodePay(payload).then(res => {
      console.log('res---->', res)
      if (res.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('WE_CHAT_QR_CODE_PAY', res.data.data)
      }
    }).catch(err => {
      console.error('weChatQrCodePay---->err=', err.toString())
    })
  },
  /**
   * 获取支付流水账信息
   */
  getTradeRecord ({commit}, payload) {
    Trade.tradeRecord(payload).then(res => {
      if (res.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_TRADE_RECORD', res.data.data)
      }
    }).catch(err => {
      console.error('getTradeRecord---->err=', err.toString())
    })
  },
  /**
   *  获取微信支付 H5 的支付参数
   */
  getWeChatPayWepParams ({commit}, payload) {
    Trade.getWeChatPayWepParams(payload).then(res => {
      console.log('res---->', res)
      if (res.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_WE_CHAT_PAY_WEP_PARAM', res.data.data)
      }
    }).catch(err => {
      console.error('getWeChatPayWepParams---->err=', err.toString())
    })
  },
  /**
   * 查询微信支付扫描结果
   */
  getWeChatPayResult ({commit}, payload) {
    Trade.getWeChatPayResult(payload).then(res => {
      if (res.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_WE_CHAT_PAY_RESULT', res.data.data)
      }
    }).catch(err => {
      console.error('getWeChatPayResult---->err=', err.toString())
    })
  },
  /**
   * 清楚交易相关信息
   */
  clearTradeData ({commit}) {
    commit('CLEAR_TRADE_DATA')
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
