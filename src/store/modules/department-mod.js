import {Department, Doctor} from '../../api'
import {RESULT_CODE} from '../../config/ResultCode'

const state = {
  deptInfos: {dept_list: [], doctor_list: [], dept_id: 0},
  saveDeptData: {},
  deptSetting: {
    form_controls: [],
    params: [],
    valid_time: 0
  },
  operateLog: [],
  manaGroup: [],
  oneDeptInfo: [],
  allDeptDocList: [],
  doctorList: [],
  // 医生列表页面的搜索条件
  doctorSearchFrom: {
    dep: '',
    positions: ''
  },
  editSettingMsg: '',
  alldeptOfHos: '',
  getRecommendDepartmentData: {}
}

const getters = {
  deptInfos: state => state.deptInfos,
  saveDeptData: state => state.saveDeptData,
  deptSetting: state => state.deptSetting,
  manaGroup: state => state.manaGroup,
  operateLog: state => state.operateLog,
  oneDeptInfo: state => state.oneDeptInfo,
  allDeptDocList: state => state.allDeptDocList,
  doctorList: state => state.doctorList,
  doctorSearchFrom: state => state.doctorSearchFrom,
  editSettingMsg: state => state.editSettingMsg,
  alldeptOfHos: state => state.alldeptOfHos,
  getRecommendDepartmentData: state => state.getRecommendDepartmentData
}

const mutations = {
  DEPT_INFO (state, data) {
    state.deptInfos = data
    if (state.doctorSearchFrom.positions) {
      let newList = []
      let i = data.doctor_list.length
      while (i--) {
        if (state.doctorSearchFrom.positions === data.doctor_list[i].position_id) {
          newList.push(data.doctor_list[i])
        }
      }
      state.doctorList = newList
    } else {
      state.doctorList = data.doctor_list
    }
  },
  SAVE_DEPT (state, payload) {
    state.saveDeptData = payload
  },
  GET_DEPT_SETTING (state, data) {
    state.deptSetting = data
  },
  GET_MANA_GROUP (state, data) {
    state.manaGroup = data
  },
  GET_ALL_DOCTOR (state, data) {
    if (state.doctorSearchFrom.positions) {
      let newList = []
      let i = data.length
      while (i--) {
        if (state.doctorSearchFrom.positions === data[i].position_id) {
          newList.push(data[i])
        }
      }
      state.doctorList = newList
    } else {
      state.doctorList = data
    }
  },
  EDIT_DEPT_SETTING (state, msg) {
    state.editSettingMsg = msg
  },
  GET_ALL_DEPT_OF_HOS (state, data) {
    state.alldeptOfHos = data
  },
  GET_RECOMMEND_DEPT (state, data) {
    state.getRecommendDepartmentData = data
  }
}

const actions = {
  getDeptInfo ({dispatch, commit}, deptId) {
    Department.getDeptInfo(deptId).then(res => {
      if (res.ok) {
        let deptInfos = res.data.data
        commit('DEPT_INFO', deptInfos)
        // 获取第一个一级类目的二级类目
        // if (deptInfos.category_id > 0) {
        //   dispatch('getDeptCategory2', deptInfos.category_id)
        // }
      }
    }).catch(err => {
      console.log('getDeptInfo------->err', err.toString())
    })
  },
  saveDeptInfo ({commit}, datas) {
    Department.saveDeptInfo(datas).then(res => {
      if (res.ok) {
        commit('SAVE_DEPT', res.data)
      }
    }).catch(err => {
      console.log('saveDeptInfo----action---err=' + err.toString())
    })
  },
  getDeptsSetting ({commit}, deptId) {
    Department.getDeptsSetting(deptId).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_DEPT_SETTING', res.data.data)
      }
    }).catch(err => {
      console.log('getDeptsSetting--err-------->', err)
    })
  },

  // 获取医生的分配管理组
  getManaGroup ({commit}) {
    Department.getManaGroup().then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_MANA_GROUP', res.data.data)
      }
    }).catch(err => {
      console.log('getManaGroup--err-------->', err)
    })
  },

  // 获取医生权限下的所有医生
  getAllDoctor ({commit}, doctor) {
    Doctor.getAllDoctor(doctor).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_ALL_DOCTOR', res.data.data.list)
      }
    }).catch(err => {
      console.log('getAllDoctor--err-------->', err)
    })
  },
  editDeptSetting ({commit}, datas) {
    Department.saveDeptsSetting(datas.deptId, datas.payload).then(res => {
      let msg = ''
      if (res.ok) {
        msg = res.data.data
      }
      commit('EDIT_DEPT_SETTING', msg)
    }).catch(err => {
      console.log('delOrder------->', err.toString())
    })
  },
  // 获取医院下面的所有科室(最详细)
  getAlldeptOfHos ({commit}, hosId) {
    Department.getAlldeptOfHos(hosId).then(res => {
      if (res.data.status === RESULT_CODE.STATUS_SUCCESS) {
        commit('GET_ALL_DEPT_OF_HOS', res.data.data)
      }
    }).catch(err => {
      console.log('delOrder------->', err.toString())
    })
  },
  getRecommendDepartment ({commit}, datas) {
    // window.sessionStorage.setItem(SESSION_DATA.BOOKING_QUEUE_PARAMS, JSON.stringify(datas))
    Department.getRecommendDepartment(datas.pageSize, datas.pageNumber).then(res => {
      if (res.ok) {
        commit('GET_RECOMMEND_DEPT', res.data.data)
      }
    }).catch(err => {
      console.log('action--err-------->', err.toString())
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
