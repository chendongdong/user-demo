import Vue from 'vue'
import {ApiVersion} from '../resources'

const ChatUrl = {
  // 获取聊天历史消息
  ChatHistoryRes: Vue.resource(ApiVersion + 'common/chat/get_history'),
  // 获取问题提示信息列表
  searchQARes: Vue.resource(ApiVersion + 'common/searchQA'),
  // 获取客服编号
  getServiceNumRes: Vue.resource(ApiVersion + 'common/member/get_client_id'),
  // 获取未读会话列表
  UnreadChatListRes: Vue.resource(ApiVersion + 'common/chat/get_offline_chat_list_with_num'),
  // 设置消息为已读
  SetMsgReadRes: Vue.resource(ApiVersion + 'common/chat/set_chat_readed')
}

const ChatHisApi = {
  getChatHis: function (data) {
    return ChatUrl.ChatHistoryRes.get(data)
  },
  getSearchQA: function (data) {
    return ChatUrl.searchQARes.get(data)
  },
  getServiceNum: function () {
    return ChatUrl.getServiceNumRes.get()
  },
  getUnreadChatList: function (data) {
    return ChatUrl.UnreadChatListRes.get(data)
  },
  setMsgRead: function (data) {
    return ChatUrl.SetMsgReadRes.get(data)
  }
}

export default ChatHisApi
