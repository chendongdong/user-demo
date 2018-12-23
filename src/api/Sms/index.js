import Vue from 'vue'
import {ApiVersion} from '../resources'
/**
 * 短信相关接口
 * */
const SmsUrl = {
  // 发送验证码
  SmsRes: Vue.resource(ApiVersion + 'sms_r_code/sms/get')
}
/**
 * 账户类
 * */
const SmsApi = {
  // 发送短信验证码
  sendSmsCode: function (data) {
    return SmsUrl.SmsRes.save({image_code: data.imageCode}, JSON.stringify(data.form))
  }
}
export default SmsApi
