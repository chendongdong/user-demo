/**
 * Created by Fussa on 2016/11/18 上午8:49
 */
import {Hospitals} from '../../api'
// import {SESSION_DATA} from '../../config/sessionStorage'
import {RESULT_CODE} from '../../config/ResultCode'

const state = {
  hospitalDataByArea: [],
  allDeptOfHos: [],
  searchHosResult: [],
  searchDept: [],
  selectHos: {department_id: 0, department_name: ''},
  selectDept: {hospId: 0, hosName: ''},
  hospitalsInfo: {
    base_info: {
      hos_name: ''
    },
    list: []
  },
  hosFindOpenApplyDept: null
}
const getters = {
  hospitalDataByArea: state => state.hospitalDataByArea,
  allDeptOfHos: state => state.allDeptOfHos,
  searchHosResult: state => state.searchHosResult,
  searchDept: state => state.searchDept,
  selectDept: state => state.selectDept,
  selectHos: state => state.selectHos,
  hospitalsInfo: state => state.hospitalsInfo,
  hosFindOpenApplyDept: state => state.hosFindOpenApplyDept
}
const mutations = {
  GET_HOSPITALS_BY_AREA (state, data) {
    state.hospitalDataByArea = data
  },
  GET_ALL_DEPT (state, data) {
    state.allDeptOfHos = data
  },
  SEARCH_HOS (state, data) {
    state.searchHosResult = data
  },
  SEARCH_DEPT (state, data) {
    state.searchDept = data
  },
  SELECT_HOS (state, data) {
    state.selectHos = data
  },
  SELECT_DEPT (state, data) {
    state.selectDept = data
  },
  GET_HOSPITALS_INFO (state, data) {
    state.hospitalsInfo = data
  },
  HOS_FIND_OPEN_APPLY_DEPT (state, data) {
    state.hosFindOpenApplyDept = data
  },
  CLEAN_HOSPITALS_OF_AREA (state, data) {
    state.hospitalDataByArea = []
  },
  CLEAN_ALL_DEPT_OF_HOS (state, data) {
    state.allDeptOfHos = []
  }
}
const actions = {
  getHospitalByArea ({commit}, areaID) {
    Hospitals.getHospitalByArea(areaID).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        let length = res.data.data.length
        let newArray = []
        for (let i = 0; i < length; i++) {
          let hos = res.data.data[i]
          let newHos = {}
          newHos.name = hos.hospital_name
          newHos.id = hos.hospital_id
          newArray.push(newHos)
        }
        commit('GET_HOSPITALS_BY_AREA', newArray)
      }
    }).catch(err => {
      console.log('区域获取医院失败------->', err)
    })
  },
  // 查询医院下面所有科室
  getAllDepartments ({commit}, hosID) {
    Hospitals.getAllDepartments(hosID).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        let length = res.data.data.length
        let newArray = []
        for (let i = 0; i < length; i++) {
          let dept = res.data.data[i]
          let newDept = {}
          newDept.name = dept.department_name
          newDept.id = dept.department_id
          newDept.parent = hosID
          newArray.push(newDept)
        }
        commit('GET_ALL_DEPT', newArray)
      }
    }).catch(err => {
      console.log('查询医院下面所有科室失败------->', err)
    })
  },
  // 搜索医院
  searchHospitals ({commit}, q) {
    Hospitals.searchHospitals(q).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('SEARCH_HOS', res.data.data)
      }
    }).catch(err => {
      console.log('查询医院下面所有科室失败------->', err)
    })
  },
  // 搜索医院
  searchDepart ({commit}, data) {
    Hospitals.searchDepart(data.hospId, data.q).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('SEARCH_DEPT', res.data.data)
      }
    }).catch(err => {
      console.log('查询医院下面所有科室失败------->', err)
    })
  },
  selectHos ({commit}, hosItem) {
    commit('SELECT_HOS', hosItem)
  },
  selectDept ({commit}, deptItem) {
    commit('SELECT_DEPT', deptItem)
  },
  /**
   * 获取医院详细信息
   */
  getHospitalInfo ({commit}, hosID) {
    Hospitals.getHospitalInfo(hosID).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_HOSPITALS_INFO', res.data.data)
      }
    }).catch(err => {
      console.log('getHospitalInfoL--err----->', err)
    })
  },
  // 查找医院下面全部能约床的科室
  hosFindOpenApplyDept ({commit}, hosID) {
    Hospitals.hosFindOpenApplyDept(hosID).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('HOS_FIND_OPEN_APPLY_DEPT', res.data.data)
      } else {
        console.log('getHospitalInfoL---else----->', res)
      }
    }).catch(err => {
      console.log('getHospitalInfoL--err----->', err)
    })
  },
  cleanAreaHospitals ({ commit }) {
    commit('CLEAN_HOSPITALS_OF_AREA')
  },
  cleanAllDeptOfHos ({ commit }) {
    commit('CLEAN_ALL_DEPT_OF_HOS')
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}

