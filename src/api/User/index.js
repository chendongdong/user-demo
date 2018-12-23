
import Vue from 'vue'
import { ApiVersion } from '../resources'
/**
 * 用户
 * */
const UsertUrl = {
  // 获取用户信息
  UserRes: Vue.resource(ApiVersion + 'member/info'),
  // 编辑用户信息
  EditUserRes: Vue.resource(ApiVersion + 'member/edit_info')
}

const UserApi = {
  // 获取用户信息
  getUser: function () {
    return UsertUrl.UserRes.get()
  },
  // 编辑用户信息
  editUser: function (payload) {
    return UsertUrl.EditUserRes.save(payload)
  }
}

export default UserApi

