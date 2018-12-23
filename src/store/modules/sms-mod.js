/**
 * Created by Fussa on 2016/11/17 下午2:54
 */

import { Sms } from '../../api'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  updateSmsButton: {          // 发送短信验证按钮的状态
    isSending: true,
    title: '发送短信验证码'
  },
  sendSmsReponseState: ''    // 发送短信验证码的状态 (成功or失败)
}
const getters = {
  updateSmsButton: state => state.updateSmsButton,
  sendSmsReponseState: state => state.sendSmsReponseState
}
const mutations = {
  UPDATE_SMS_BUTTON (state, btn) {
    state.updateSmsButton = Object.assign({isSending: true, title: '发送短信验证码'}, btn)
  },
  SEND_SMS_CODE (state, data) {
    state.sendSmsReponseState = data
  }
}
let timer = {}
const actions = {
  clearSmsInterval () {
    clearInterval(timer)
  },
  /**
   * 发送短信验证码
   * @param data 提交的数据在data.sms, data.callBack可以是Toast
   */
  sendSmsCode ({commit}, data) {
    let _this = data._this
    Sms.sendSmsCode(data).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        let counter = 60
        commit('UPDATE_SMS_BUTTON', {title: counter + '秒后重试'})
        timer = setInterval(function () {
          counter--
          commit('UPDATE_SMS_BUTTON', {title: counter + '秒后重试'})
          if (counter <= 0) {
            commit('UPDATE_SMS_BUTTON', {isSending: false, title: '重新发送验证码'})
            clearInterval(timer)
            counter = 60
          }
        }, 1000)
        _this.toastMessage = {isShow: true, message: '短信发送成功!'}
      } else {
        _this.toastMessage = {isShow: true, message: res.data.data || '短信发送失败, 请稍后再试!'}
        _this.$store.dispatch('getImgCode')
      }
    }).catch(err => {
      _this.toastMessage = {isShow: true, message: '校验码错误'}
      _this.$store.dispatch('getImgCode')
      console.log('sendSmsCode--err-------->', err)
    })
  },
  /**
   * 更新发送短信验证码按钮的状态
   */
  updateSmsButton ({commit}, btn) {
    commit('UPDATE_SMS_BUTTON', btn)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
