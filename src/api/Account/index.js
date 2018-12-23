/**
 * Created by Fussa on 2017/2/13 下午4:53
 */
import Vue from 'vue'
import { ApiVersion } from '../resources'
/**
 * 账号类
 * */
const AccountUrl = {
   // 登录
  RegisterRes: Vue.resource(ApiVersion + 'auth/register'),
  ForgetPwdRes: Vue.resource(ApiVersion + 'common/member/forget_pswd'),
  changePasswordRes: Vue.resource(ApiVersion + 'member/change_pswd'),
  setPayPasswordRes: Vue.resource(ApiVersion + 'member/set_pay_password'),
  // 修改支付密码
  changePayPasswordRes: Vue.resource(ApiVersion + 'member/change_pay_password'),
  // 检查手机号码是否已经注册
  checkPhoneRes: Vue.resource(ApiVersion + 'common/member/is_user_exist'),
  // 自动注册
  autoRegisterRes: Vue.resource(ApiVersion + 'common/member/auto_register'),
  // 检测用户是否关注工作号
  checkAttentYM99Res: Vue.resource(ApiVersion + 'obst/user/check_user_follow')
}
/**
 *  账号类
 */
const AccountApi = {
  // 注册
  register: function (data) {
    return AccountUrl.RegisterRes.save(data)
  },
  // 登录-忘记密码
  forgetLoginPassword: function (data) {
    return AccountUrl.ForgetPwdRes.save({}, data)
  },
  // 更改登录密码
  changePassword: function (data) {
    return AccountUrl.changePasswordRes.save(data)
  },
  // 设置支付密码
  setPayPassword: function (data) {
    return AccountUrl.setPayPasswordRes.save(data)
  },
  // 修改支付密码
  changePayPassword: function (data) {
    return AccountUrl.changePayPasswordRes.save(data)
  },
  checkPhone: function (data) {
    return AccountUrl.checkPhoneRes.save(data)
  },
  autoRegister: function (data) {
    return AccountUrl.autoRegisterRes.save(data)
  },
  checkAttentYM99: function () {
    return AccountUrl.checkAttentYM99Res.get()
  }
}

export default AccountApi

