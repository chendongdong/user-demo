import {Image} from '../../api'
const state = {
  imgUrl: '',
  imgCode: ''
}

const getters = {
  imgUrl: state => state.imgUrl,
  imgCode: state => state.imgCode
}

const mutations = {
  LOAD_IMAGE (state, datas) {
    state.imgUrl = datas
  },
  CLEAR_IMG (state) {
    state.imgUrl = ''
  },
  GET_IMAGE_CODE (state, datas) {
    state.imgCode = datas
  }
}

const actions = {
  loadImg ({commit}, image) {
    Image.loadImage(image).then(res => {
      if (res.ok) {
        commit('LOAD_IMAGE', res.data.url)
      }
    }).catch(err => {
      console.error('action---loadImg----err=>', err.toString())
    })
  },
  base64StrImage ({commit}, image) {
    Image.base64StrImage(image).then(res => {
      if (res.ok) {
        if (res.data.state === 1) {
          commit('LOAD_IMAGE', res.data.url)
        }
      }
    }).catch(err => {
      console.log(err.toString())
    })
  },
  getImgCode ({commit}) {
    Image.getImgCode().then(res => {
      if (res.ok) {
        commit('GET_IMAGE_CODE', res.url)
      }
    }).catch(err => {
      console.log('action---getImgCode----err=>', err.toString())
    })
  },
  clearImg ({commit}) {
    commit('CLEAR_IMG')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
