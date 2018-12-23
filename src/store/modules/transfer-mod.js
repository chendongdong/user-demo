import {Transfer} from '../../api'
const state = {
  transList: [],
  transDetail: {},
  transMsg: '',
  isLoadTran: false
}

const getters = {
  transMsg: state => state.transMsg,
  transList: state => state.transList,
  transDetail: state => state.transDetail,
  isLoadTran: state => state.isLoadTran
}

const mutations = {
  TRANSFER_LIST (state, datas) {
    state.transList = datas
  },
  TRANS_DETAIL (state, datas) {
    state.transDetail = datas
  },
  USER_TRANS_MSG (state, msg) {
    state.transMsg = msg
  },
  CLEAR_TRANS_MSG (state) {
    state.transMsg = ''
  },
  LOAD_STATE (state, data) {
    state.isLoadTran = data
  }
}

const actions = {
  clearTransMsg ({commit}) {
    commit('CLEAR_TRANS_MSG')
  },
  /**
   * 转诊列表
   * @param dispatch
   * @param data
   */
  getTransList ({commit}, data) {
    commit('LOAD_STATE', true)
    Transfer.getTransList(data).then(res => {
      if (res.ok) {
        let genStr = ['女', '男']
        let stateStr = ['已撤销', '待接收', '已接收', '已拒绝', '已取消']
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].patient_grow_age != null && res.data.data[i].patient_grow_age.indexOf('岁') > 0) {
            res.data.data[i].patient_grow_age = res.data.data[i].patient_grow_age.split('岁')[0] + '岁'
          } else {
            res.data.data[i].patient_grow_age = '0岁'
          }
          res.data.data[i].transfer_state = stateStr[res.data.data[i].transfer_state + 1]
          res.data.data[i].patient_gender = genStr[res.data.data[i].patient_gender]
        }
        commit('TRANSFER_LIST', res.data.data)
      }
      commit('LOAD_STATE', false)
    }).catch(err => {
      commit('LOAD_STATE', false)
      console.log('getTransList------->', err.toString())
    })
  },
  /**
   * 获取转诊详情
   */
  getTransDetail ({commit}, data) {
    window.sessionStorage.setItem('trans-detail', JSON.stringify(data))
    Transfer.getTransDetail(data).then(res => {
      if (res.ok) {
        let transType = ['住院', '检查', '诊断']
        let genStr = ['女', '男']
        let stateStr = ['已撤销', '待处理', '已处理', '已取消']
        res.data.data.transfer_type = transType[res.data.data.transfer_type]
        res.data.data.patient_gender = genStr[res.data.data.patient_gender]
        res.data.data.transfer_state = stateStr[res.data.data.transfer_state + 1]
        if (res.data.data.patient_grow_age != null && res.data.data.patient_grow_age.indexOf('岁') > 0) {
          res.data.data.patient_grow_age = res.data.data.patient_grow_age.split('岁')[0] + '岁'
        } else {
          res.data.data.patient_grow_age = '0岁'
        }
        let tempPro = ''
        if (res.data.data.priorities) {
          for (let j = 0; j < res.data.data.priorities.length; j++) {
            tempPro = tempPro + res.data.data.priorities[j].param_name
            if (j < res.data.data.priorities.length - 1) {
              tempPro = tempPro + ','
            }
          }
        }
        res.data.data.priorities = tempPro
        commit('TRANS_DETAIL', res.data.data)
      }
    }).catch(err => {
      console.log('getTransDetail------->', err.toString())
    })
  },
  userTransCanel ({dispatch, commit}, data) {
    Transfer.transCancel(data).then(res => {
      if (res.ok) {
        commit('USER_TRANS_MSG', res.data.data)
        let params = JSON.parse(window.sessionStorage.getItem('trans-detail'))
        dispatch('getTransDetail', params)
      }
    }).catch(err => {
      console.log('transCancel------->', err.toString())
    })
  },
  addTranImg ({commit}, data) {
    Transfer.addTranImg(data).then(res => {
      if (res.ok) {
        commit('USER_TRANS_MSG', res.data.data)
        clearTimeout(timer)
        var timer = setTimeout(() => {
          window.history.back()
        }, 2000)
      } else {
        commit('USER_TRANS_MSG', '上传失败')
      }
    }).catch(err => {
      console.log('addTranImg------->', err.toString())
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
