/**
 * Created by Fussa on 2016/11/17 下午8:12
 */

import { Location } from '../../api'
import { RESULT_CODE } from '../../config/ResultCode'

const state = {
  provinceData: [],
  cityData: [],
  cityAreaData: [],
  chinaCityList: {},
  localData: [],
  allProvinceCities: [],
  isLoadingLoca: false
}
const getters = {
  isLoadingLoca: state => state.isLoadingLoca,
  localData: state => state.localData,
  provinceData: state => state.provinceData,
  cityData: state => state.cityData,
  cityAreaData: state => state.cityAreaData,
  chinaCityList: state => state.chinaCityList,
  allProvinceCities: state => state.allProvinceCities
}
const mutations = {
  GET_PROVICE (state, data) {
    state.provinceData = data
    state.localData.splice(0, 1, data)
  },
  GET_CITY (state, data) {
    state.cityData = data
    state.localData.splice(1, 1, data)
  },
  GET_CITYAREA (state, data) {
    state.cityAreaData = data
    state.localData.splice(2, 1, data)
  },
  GET_CHINA_CITY (state, data) {
    state.chinaCityList = data
  },
  GET_ALL_PROVINCE_CITY (state, data) {
    state.allProvinceCities = data
  },
  STATE_LOAD (state, data) {
    state.isLoadingLoca = data
  }
}
const actions = {

  /**
   * 获取全国省份城市数据
   */
  getAllProvinceCity ({ commit }) {
    Location.getAllProvinceCity().then(res => {
      if (res.data.code === 1 && res.data.status === 200) {
        commit('GET_ALL_PROVINCE_CITY', res.data.data.map(
          function (e) {
            return {
              name: e.name,
              value: e.id.toString(),
              parent: e.parent ? e.parent.toString() : 0
            }
          })
        )
      }
    }).catch(() => {
      // console.log("获取全国省份城市数据------->", err)
    })
  },

  // 获取全国省份数据
  getProvince ({ dispatch, commit }) {
    commit('STATE_LOAD', true)
    Location.getProvince().then(res => {
      if (res.data.code === 1 && res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_PROVICE', res.data.data)
        let temp = {
          res: res.data,
          type: 'province'
        }
        dispatch('rebuildData', temp)
      }
      commit('STATE_LOAD', false)
    }).catch(err => {
      commit('STATE_LOAD', false)
      console.log('获取省份数据发送数据失败------->', err)
    })
  },
  // 获取省份下所有城市数据
  getCity ({ dispatch, commit }, provinceID) {
    commit('STATE_LOAD', true)
    Location.getCity(provinceID).then(res => {
      if (res.data.code === 1 && res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_CITY', res.data.data)
        let temp = {
          res: res.data,
          type: 'city'
        }
        dispatch('rebuildData', temp)
      }
      commit('STATE_LOAD', false)
    }).catch(err => {
      commit('STATE_LOAD', false)
      console.log('获取城市数据发送数据失败------->', err)
    })
  },

  // 获取城市下所有区域数据(待完善)
  getArea ({ dispatch, commit }, cityID) {
    Location.getArea(cityID).then(res => {
      if (res.data.code === 1 && res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_CITYAREA', res.data.data)
        let temp = {
          res: res.data,
          type: 'area'
        }
        dispatch('rebuildData', temp)
      }
    }).catch(err => {
      console.log('获取区域数据发送数据失败------->', err)
    })
  },
  getChinaCity ({ commit }) {
    Location.getChinaCity().then(res => {
      if (res.data.code === 1 && res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_CHINA_CITY', res.data.data)
      }
    }).catch(err => {
      console.log('getChinaCity------->', err)
    })
  },
  // 抽取省份-城市-区域里面的计算逻辑
  rebuildData ({ commit }, result) {
    let newArray = []
    result.res.data.forEach(function (r) {
      newArray.push({
        name: r.name,
        value: r.id.toString(),
        parent: r.parent ? r.parent.toString() : 0
      })
    }, this)
    if (result.type === 'province') {
      commit('GET_PROVICE', newArray)
    } else if (result.type === 'city') {
      commit('GET_CITY', newArray)
    } else if (result.type === 'area') {
      commit('GET_CITYAREA', newArray)
    }
  },
  getHotCity ({ dispatch, commit }) {
    commit('STATE_LOAD', true)
    Location.getHotCity().then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_CITY', res.data.data)
        let temp = {
          res: res.data,
          type: 'city'
        }
        dispatch('rebuildData', temp)
      }
      commit('STATE_LOAD', false)
    }).catch(err => {
      commit('STATE_LOAD', false)
      console.log('getChinaCity------->', err)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}

