import Vue from 'vue'
import {ApiVersion} from '../resources'

const OrderUrl = {
  // 获取预约队列列表
  BookingListRes: Vue.resource(ApiVersion + 'orders'),
  // 订单详情
  BookingDetailRes: Vue.resource(ApiVersion + 'orders/detail/{id}'),
  // 用户手动确认
  UserConfirmRes: Vue.resource(ApiVersion + 'member/orders/hand_confirm/{ids}'),
  // 订单重新排队
  UserRequeueRes: Vue.resource(ApiVersion + 'member/orders/re_queueing/{id}'),
  // 取消订单
  UserCancelRes: Vue.resource(ApiVersion + 'member/orders/{id}')
}

const OrderApi = {
  getBookingList: function (datas) {
    return OrderUrl.BookingListRes.save(datas)
  },
  // 订单详情
  getBookingDetail: function (orderId) {
    return OrderUrl.BookingDetailRes.get({id: orderId})
  },
  // 用户确认
  userConfirm: function (id) {
    return OrderUrl.UserConfirmRes.get({ids: id})
  },
  // 重新排队
  userRequeue: function (id) {
    return OrderUrl.UserRequeueRes.get({id: id})
  },
  // 取消订单
  userCancel: function (id) {
    return OrderUrl.UserCancelRes.delete({id: id})
  }
}

export default OrderApi
