import { BaseData } from '../../api'
// import {SESSION_DATA} from '../../config/sessionStorage'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  applyStatus: [],
  applyBedTypes: [],
  gender: [],
  orderSources: [],
  deptShowName: [],
  deptCategory1: [],
  deptCategory2: [],
  deptLevel: [],
  deptMatchType: [],
  ApplyBedTypeByDeptData: {},
  wxConfigParam: null,
  homeBanner: [],
  dataDict: []
}

const getters = {
  homeBanner: state => state.homeBanner,
  wxConfigParam: state => state.wxConfigParam,
  applyStatus: state => state.applyStatus,
  applyBedTypes: state => state.applyBedTypes,
  gender: state => state.gender,
  orderSources: state => state.orderSources,
  deptShowName: state => state.deptShowName,
  deptCategory1: state => state.deptCategory1,
  deptCategory2: state => state.deptCategory2,
  deptLevel: state => state.deptLevel,
  deptMatchType: state => state.deptMatchType,
  ApplyBedTypeByDeptData: state => state.ApplyBedTypeByDeptData,
  dataDict: state => state.dataDict
}
const mutations = {
  GET_APPLY_STATUS (state, data) {
    state.applyStatus = data
  },
  GET_APPLY_BED_TYPES (state, data) {
    state.applyBedTypes = data
  },
  GET_GENDER (state, data) {
    state.gender = data
  },
  GET_ORDER_SOURCES (state, data) {
    state.orderSources = data
  },
  DEPT_SHOW_NAME (state, data) {
    state.deptShowName = data
  },
  DEPT_CATEGORY1 (state, data) {
    state.deptCategory1 = data
  },
  DEPT_CATEGORY2 (state, data) {
    state.deptCategory2 = data
  },
  DEPT_LEVEL (state, data) {
    state.deptLevel = data
  },
  DEPT_MATCH_TYPE (state, data) {
    state.deptMatchType = data
  },
  GET_APPLY_BED_TYPE_BY_DEPT (state, data) {
    state.ApplyBedTypeByDeptData = data
  },
  GET_WECHAT_CONFIG (state, data) {
    state.wxConfigParam = data
  },
  GET_HOME_BANNER (state, data) {
    state.homeBanner = data
  },
  FIND_DATA_DICT (state, data) {
    state.dataDict = data
  }
}
const actions = {
  clearBaseData ({commit}) {
    commit('GET_WECHAT_CONFIG', null)
  },
  pageStatis ({commit}, data) {
    BaseData.pageStatis(data).then(res => {
      if (res.ok) {

      }
    }).catch(err => {
      console.log('pageStatis---err=', err)
    })
  },
  getHomeBanner ({commit}) {
    BaseData.getHomeBanner().then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_HOME_BANNER', res.data.data)
      }
    }).catch(err => {
      console.log('getHomeBanner--err-------->', err)
    })
  },
  getApplyStatus ({commit}) {
    BaseData.getApplyStatus().then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_APPLY_STATUS', res.data.data)
      }
    }).catch(err => {
      console.log('getApplyState--err-------->', err)
    })
  },
  getApplyBedTypes ({commit}) {
    BaseData.getApplyBedTypes().then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_APPLY_BED_TYPES', res.data.data)
      }
    }).catch(err => {
      console.log('getApplyBedTypes--err-------->', err)
    })
  },

  getGender ({commit}) {
    BaseData.getGender().then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].key = res.data.data[i].key.toString()
        }
        commit('GET_GENDER', res.data.data)
      }
    }).catch(err => {
      console.log('getGender--err-------->', err)
    })
  },
  getOrderSource ({commit}) {
    BaseData.getOrderSource().then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_ORDER_SOURCES', res.data.data)
      }
    }).catch(err => {
      console.log('getApplyState--err-------->', err)
    })
  },
  getDeptShowName ({commit}) {
    BaseData.getDeptShow().then(res => {
      if (res.ok) {
        commit('DEPT_SHOW_NAME', res.data.data)
      }
    }).catch(err => {
      console.log('getDeptShowName---->err=', err.toString())
    })
  },
  getDeptCategory1 ({commit}) {
    BaseData.getDeptCategory1().then(res => {
      if (res.ok) {
        commit('DEPT_CATEGORY1', res.data.data)
      }
    }).catch(err => {
      console.log('getDeptCategory1---->err=', err.toString())
    })
  },
  getDeptCategory2 ({commit}, id) {
    BaseData.getDeptCategory2(id).then(res => {
      if (res.ok) {
        commit('DEPT_CATEGORY2', res.data.data)
      }
    }).catch(err => {
      console.log('getDeptCategory2---->err=', err.toString())
    })
  },
  getDeptLevel ({commit}) {
    BaseData.getDeptLevel().then(res => {
      if (res.ok) {
        commit('DEPT_LEVEL', res.data.data)
      }
    }).catch(err => {
      console.log('getDeptLevel---->err=', err.toString())
    })
  },
  getDeptMatchType ({commit}) {
    BaseData.getDeptMatchType().then(res => {
      if (res.ok) {
        commit('DEPT_MATCH_TYPE', res.data.data)
      }
    }).catch(err => {
      console.log('getDeptMatchType---->err=', err.toString())
    })
  },
  /**
   * 约床申请房间类型(科室)
   */
  getApplyBedTypeByDept ({commit}, deptId) {
    BaseData.getApplyBedTypeByDept(deptId).then(res => {
      if (res.ok) {
        commit('GET_APPLY_BED_TYPE_BY_DEPT', res.data.data)
      }
    }).catch(err => {
      console.error('getDeptMatchType---->err=', err.toString())
    })
  },
  /**
   * 身份证号码校验
   */
  checkVerifyId ({commit}, payload) {
    const _this = payload._this
    BaseData.checkVerifyId(payload.id).then(res => {
      // res.data.data只为true或者false
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        _this.isIdentityTrue = res.data.data
        // 身份证号码不正确, 服务器返回了false
        if (!res.data.data) {
          _this.$vux.alert.show({
            title: '提示',
            content: '身份证号码不正确',
            onHide () {}
          })
        }
      }
    }).catch(err => {
      console.error('checkVerifyId---->err=', err.toString())
    })
  },
  getWxConfig ({commit}, url) {
    BaseData.getWxConfig(url).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_WECHAT_CONFIG', res.data.data)
      }
    }).catch(err => {
      console.log('getWxConfig--err-------->', err)
    })
  },
  /**
   * 查找数字字典
   * @param code
   */
  findDataDict ({commit}, code) {
    BaseData.findDataDict(code).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('FIND_DATA_DICT', res.data.data)
      }
    }).catch(err => {
      console.log('FindDataDict--err-------->', err)
    })
  }

}
export default {
  state,
  getters,
  mutations,
  actions
}
