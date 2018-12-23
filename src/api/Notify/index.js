import Vue from 'vue'
import { ApiVersion } from '../resources'

/**
 * 用户
 * */
const NotifyUrl = {
  // 获取消息记录
  smsRecordRes: Vue.resource(ApiVersion + 'member/msg/ctm/record'),
  // 消息提醒
  msgNotifyRes: Vue.resource(ApiVersion + 'member/msg/notify'),
  // 设置消息提醒已读
  setMsgNotifyReadRes: Vue.resource(ApiVersion + 'member/msg/set_notify_read'),
  // 消息单条提醒
  getOneMsgNotifyRes: Vue.resource(ApiVersion + 'member/msg/notify/one/{id}'),
  // 编辑提醒模板
  setNotifyTemplateRes: Vue.resource(ApiVersion + 'member/msg/set_notify_template'),
  // 查找提醒模板
  findNotifyTemplateRes: Vue.resource(ApiVersion + 'member/msg/find_notify_template'),
  // 删除提醒模板
  delNotifyTemplateRes: Vue.resource(ApiVersion + 'member/msg/del_notify_template/{id}')
}

const NotifyApi = {
  // 获取消息记录
  getSmsRecord: function (payload) {
    return NotifyUrl.smsRecordRes.update(payload)
  },
  // 消息提醒
  getMsgNotify: function (payload) {
    return NotifyUrl.msgNotifyRes.update(payload)
  },
  // 设置消息提醒已读
  setMsgNotifyRead: function (payload) {
    return NotifyUrl.setMsgNotifyReadRes.update(payload)
  },
  // 消息单条提醒
  getOneMsgNotify: function (id) {
    return NotifyUrl.getOneMsgNotifyRes.get({id: id})
  },
  // 编辑提醒模板
  setNotifyTemplate: function (payload) {
    return NotifyUrl.setNotifyTemplateRes.update(payload)
  },
  // 查找提醒模板
  findNotifyTemplate: function (payload) {
    return NotifyUrl.findNotifyTemplateRes.update(payload)
  },
  delNotifyTemplate: function (id) {
    return NotifyUrl.delNotifyTemplateRes.delete({id: id})
  }
}

export default NotifyApi

