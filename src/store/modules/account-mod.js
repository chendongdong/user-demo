/**
 * Created by Fussa on 2017/2/13 下午4:56
 */
import { Account } from '../../api'
// import {SESSION_DATA} from '../../config/sessionStorage'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  suggestData: '',
  isRegisterSuccess: false,
  isResetPwdOfForgetSuccess: false,
  isChangePwdSuccess: false,
  checkPhoneRet: '',
  autoRegisterMsg: null,
  checkYM99: null
}

const getters = {
  checkYM99: state => state.checkYM99,
  autoRegisterMsg: state => state.autoRegisterMsg,
  checkPhoneRet: state => state.checkPhoneRet,
  isRegisterSuccess: state => state.isRegisterSuccess,
  isResetPwdOfForgetSuccess: state => state.isResetPwdOfForgetSuccess,
  isChangePwdSuccess: state => state.isChangePwdSuccess
}
const mutations = {
  REGISTER_SUCCESS (state, isSuccess) {
    state.isRegisterSuccess = isSuccess
  },
  RESET_PWD_SUCCESS_OF_FORGET (state, isSuccess) {
    state.isResetPwdOfForgetSuccess = isSuccess
  },
  CHANGE_PWD_SUCCESS (state, isSuccess) {
    state.isChangePwdSuccess = isSuccess
  },
  CHECK_PHONE (state, data) {
    state.checkPhoneRet = data
  },
  AUTO_REGISTER (state, data) {
    state.autoRegisterMsg = data
  },
  CHECK_ATTENT_YM99 (state, data) {
    state.checkYM99 = data
  }
}
const actions = {
  clearAutoRegister ({commit}) {
    commit('AUTO_REGISTER', '')
  },
  clearCheckRet ({commit}) {
    commit('CHECK_PHONE', '')
  },
  checkAttentYM99 ({commit}) {
    Account.checkAttentYM99().then(res => {
      if (res.ok) {
        commit('CHECK_ATTENT_YM99', res.data.data)
      }
    }).catch(err => {
      console.log('checkAttentYM99---err', err)
    })
  },
  checkPhone ({commit}, data) {
    Account.checkPhone(data).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('CHECK_PHONE', res.data.data)
      }
    }).catch(err => {
      console.log('checkPhone---err=', err)
    })
  },
  autoRegister ({commit}, data) {
    Account.autoRegister(data).then(res => {
      if (res.ok) {
        commit('AUTO_REGISTER', '成功')
      }
    }).catch(err => {
      console.log('autoRegister---err=', err)
    })
  },
  /**
   * 注册
   * @param data form: 提交服务器的注册数据
   */
  register ({commit}, data) {
    let _this = data._this
    Account.register(data.form).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        // 注册成功, 跳转到登录
        commit('REGISTER_SUCCESS', true)
        _this.showAlert('注册成功!')
      } else {
        _this.showAlert(res.data.data || '注册失败, 请稍后再试!')
      }
    }).catch(err => {
      _this.showAlert('注册失败, 请稍后再试!')
      console.log('register--err-------->', err)
    })
  },

  /**
   * 忘记登录密码
   */
  forgetLoginPassword ({commit}, data) {
    let _this = data._this
    Account.forgetLoginPassword(data.form).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('RESET_PWD_SUCCESS_OF_FORGET', true)
        _this.showAlert('密码重置成功!')
      } else {
        _this.showAlert(res.data.data || '找回密码失败, 请稍后再试!')
      }
    }).catch(err => {
      _this.showAlert('连接服务器出错, 请稍后再试!')
      console.log('forgetLoginPassword--err-------->', err)
    })
  },

  /**
   * 更改登录密码
   */
  changePassword ({commit}, data) {
    let _this = data._this
    Account.changePassword(data.form).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('CHANGE_PWD_SUCCESS', true)
        _this.showAlert('密码修改成功, 请重新登录!')
      } else {
        _this.showAlert(res.data.data || '密码修改失败, 请稍后再试!')
      }
    }).catch(err => {
      console.log('updatePassword--err-------->', err)
    })
  },
  /**
   * 设置支付密码
   */
  setPayPassword ({commit}, data) {
    let _this = data._this
    Account.setPayPassword(data.form).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        _this.$vux.alert.show({
          title: '提示',
          content: '支付密码设置成功',
          onHide () {
            _this.$router.push({name: 'Wallet'})
          }
        })
      } else {
        _this.$vux.alert.show({
          title: '提示',
          content: res.data.data || '密码设置失败, 请稍后再试!'
        })
      }
    }).catch(err => {
      console.log('updatePassword--err-------->', err)
    })
  },

  /**
   * 修改支付密码
   */
  changePayPassword ({commit}, data) {
    let _this = data._this
    Account.changePayPassword(data.form).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        _this.$vux.alert.show({
          title: '提示',
          content: '支付密码修改成功',
          onHide () {
            _this.$router.go(-1)
          }
        })
      } else {
        _this.$vux.alert.show({
          title: '提示',
          content: res.data.data || '密码修改失败, 请稍后再试!'
        })
      }
    }).catch(err => {
      console.log('updatePassword--err-------->', err)
    })
  }

}
export default {
  state,
  getters,
  mutations,
  actions
}
