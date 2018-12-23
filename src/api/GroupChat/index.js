import Vue from 'vue'
import {ApiVersion} from '../resources'

const GroupChatUrl = {
  // 获取群聊列表
  getGroupListRes: Vue.resource(ApiVersion + 'chat/get_group_chat_list_for_user'),
  // 获取历史聊天记录
  GroupHisMsgRes: Vue.resource(ApiVersion + 'chat/get_group_chat_history'),
  // 退出群聊
  RemoveGroupRes: Vue.resource(ApiVersion + 'chat/remove_from_group_chat_batch'),
  // 获取群信息
  GetGroupInfoRes: Vue.resource(ApiVersion + 'chat/get_chat_group_detail'),
  // 退出页面设置当前聊天消息条数
  SetChatMsgRes: Vue.resource(ApiVersion + 'chat/set_chat_total_num')
}

const GroupChatApi = {
  getGroupList: function () {
    return GroupChatUrl.getGroupListRes.get()
  },
  groupHisMsg: function (data) {
    return GroupChatUrl.GroupHisMsgRes.get(data)
  },
  removeGroup: function (data) {
    return GroupChatUrl.RemoveGroupRes.save(data)
  },
  getGroupInfo: function (data) {
    return GroupChatUrl.GetGroupInfoRes.get(data)
  },
  setChatMsg: function (data) {
    return GroupChatUrl.SetChatMsgRes.save(data)
  }
}

export default GroupChatApi
