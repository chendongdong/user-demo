import { Search } from '../../api'
const state = {
  keyword: '',
  suggestion: {},
  results: {
    doctor: [],
    department: [],
    hospital: []
  },
  searchType: 'all'
}

const getters = {
  suggestions: state => {
    return state.suggestion
  },
  keyword: state => {
    return state.keyword
  },
  results: state => {
    return state.results
  }
}

const mutations = {
  SUGGESTION (state, payload) {
    state.suggestion = payload
  },
  KEYWORD (state, keyword) {
    state.keyword = keyword
  },
  DO_SEARCH (state, results) {
    state.results = results
  },
  SEARCH_TYPE (state, searchType) {
    state.searchType = searchType
  }
}

const actions = {
  suggestion ({commit}, q) {
    Search.suggestion(q.q).then(res => {
      if (res.ok) {
        q.cb(res.data.data)
        commit('SUGGESTION', res.data.data)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  keyword ({commit}, keyword) {
    commit('KEYWORD', keyword)
  },
  doSearch ({commit}, payload) {
    // 保存历史搜索记录，最近10条
    if (payload.q) {
      let searchHis = window.localStorage.getItem('search-histroy')
      if (searchHis) {
        searchHis = JSON.parse(searchHis)
        if (searchHis.length >= 10) {
          searchHis.splice(0, 1)
        }
        let isExit = false
        for (let i = 0; i < searchHis.length; i++) {
          if (searchHis[i].value === payload.q) {
            isExit = true
            break
          }
        }
        if (!isExit) {
          searchHis.push({key: searchHis.length + '*', value: payload.q})
        }
      } else {
        searchHis = []
        searchHis.push({key: searchHis.length + '*', value: payload.q})
      }
      window.localStorage.setItem('search-histroy', JSON.stringify(searchHis))
    }
    Search.search(payload).then(res => {
      if (res.ok) {
        commit('DO_SEARCH', res.data.data)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  searchType ({commit}, searchType) {
    commit('SEARCH_TYPE', searchType)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
