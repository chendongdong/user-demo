/**
 * 交易类
 * Fussa  2017-05-15 14:32:06
 */
import Vue from 'vue'
import { ApiVersion } from '../resources'
const TradeUrl = {
  // 账户充值
  AccountRechargeRes: Vue.resource(ApiVersion + 'trade_order/account_recharge'),
  // 账户支付
  AccountPayRes: Vue.resource(ApiVersion + 'trade_order/account_pay'),
  // 检查订单状态
  CheckOrderStateRes: Vue.resource(ApiVersion + 'trade_order/check_order_state'),
  // 支付宝支付
  AliPayRes: Vue.resource(ApiVersion + 'common/alipay/wap/pay'),
  // 微信支付
  WeChatQrCodePayRes: Vue.resource(ApiVersion + 'wechatpay/pay'),
  // 支付流水账
  TradeRecordRes: Vue.resource(ApiVersion + 'member/trade_record'),
  WeChatPayWepRes: Vue.resource(ApiVersion + 'wechatpay/wap/pay'),
  GetWeChatPayResultRes: Vue.resource(ApiVersion + 'common/wechatpay/get_pay_result')
}
const TradeApi = {
  // 账户充值
  accountRecharge: function (data) {
    return TradeUrl.AccountRechargeRes.save(data)
  },
  // 账户支付
  accountPay: function (data) {
    return TradeUrl.AccountPayRes.save(data)
  },
  // 检查订单状态
  checkOrderState: function (data) {
    return TradeUrl.CheckOrderStateRes.get(data)
  },
  // 支付宝支付
  aliPay: function (data) {
    return TradeUrl.AliPayRes.get(data)
  },
  // 微信支付
  weChatQrCodePay: function (data) {
    return TradeUrl.WeChatQrCodePayRes.get(data)
  },
  // 支付流水账
  tradeRecord: function (data) {
    return TradeUrl.TradeRecordRes.save(data)
  },
  // 获取微信支付H5的参数
  getWeChatPayWepParams: function (data) {
    return TradeUrl.WeChatPayWepRes.get(data)
  },
  // 查询微信支付扫描结果
  getWeChatPayResult: function (data) {
    return TradeUrl.GetWeChatPayResultRes.get(data)
  }
}

export default TradeApi

