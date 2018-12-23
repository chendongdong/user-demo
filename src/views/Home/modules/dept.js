import HomeApi from '../HomeApi'
const state = {
  dept: {
    department: {open_apply: 0},
    diseases: [],
    doctorDetails: []
  },
  deptGruidData: null
}
const getters = {
  dept: state => {
    return state.dept
  },
  dept_department: state => {
    return state.dept.department
  },
  dept_diseases: (state) => {
    let dises = state.dept.diseases
    let disNames = []
    for (let i = 0, l = dises.length; i < l; i++) {
      let dis = dises[i]
      disNames.push(dis.name)
    }
    return disNames.join(' ')
  },
  dept_doctorDetails: state => {
    return state.dept.doctorDetails
  },
  deptGruidData: state => state.deptGruidData
}
const mutations = {
  GET_DEPT (state, payload) {
    state.dept = payload
  },
  GET_DEPT_DUIDE (state, data) {
    state.deptGruidData = data
  }
}
const actions = {
  getDepartment ({commit}, id) {
    HomeApi.getDepartment(id).then(res => {
      if (res.ok) {
        // let config = res.data.data.department.obstetricsConfig
        // if (config) {
        //   let selectMenu = []
        //   for (let i = 0; i < config.menus.length; i++) {
        //     if (config.menus[i].isSelect) {
        //       selectMenu.push(config.menus[i])
        //     }
        //   }
        //   res.data.data.department.obstetricsConfig.menus = selectMenu
        // }
        commit('GET_DEPT', res.data.data)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  getDeptGuide ({commit}, data) {
    HomeApi.getDeptGuide(data).then(res => {
      if (res.ok) {
        commit('GET_DEPT_DUIDE', res.data.data)
      }
    }).catch(err => {
      console.log('getDeptGuide---err=', err)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
