import Vue from 'vue'
import {ApiVersion} from '../resources'
/**
 * 房间相关
 * */
const SearchUrl = {
  SuggestionRes: Vue.resource(ApiVersion + 'common/suggestion'),
  SearchRes: Vue.resource(ApiVersion + 'common/search')
}
/**
 * 房间管理
 * */
const SearchApi = {
  // 今日,明日,其他
  suggestion: function (q) {
    return SearchUrl.SuggestionRes.get({
      q: q
    })
  },
  search: (payload) => {
    return SearchUrl.SearchRes.get(payload)
  }
}
export default SearchApi
