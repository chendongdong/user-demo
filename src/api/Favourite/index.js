import Vue from 'vue'
import { ApiVersion } from '../resources'

/**
 * 我的收藏
 */
const FavouriteUrl = {
  // 添加收藏医生
  addFavouriteDoctorRes: Vue.resource(ApiVersion + 'favourite/add_favourite_doctor/{id}'),
  // 添加收藏文章
  addFavouriteArticleRes: Vue.resource(ApiVersion + 'favourite/add_favourite_article'),
  // 删除收藏医生/收藏文章
  delFavouriteDoctorRes: Vue.resource(ApiVersion + 'favourite/del_favourite_doctor'),
  // 获取用户收藏的文章或者医生的id列表
  getFavouriteIdListRes: Vue.resource(ApiVersion + 'favourite/get_favourite'),
  // 获取用户收藏的文章或者医生列表
  getFavouriteListRes: Vue.resource(ApiVersion + 'favourite/get_favourite_list'),
  // 检查是否已收藏
  checkIsFavouriteRes: Vue.resource(ApiVersion + 'favourite/is_favourite_exist')
}

const FavouriteApi = {
  // 添加收藏医生
  addFavouriteDoctor: function (payload) {
    return FavouriteUrl.addFavouriteDoctorRes.save(payload)
  },
  // 添加收藏文章
  addFavouriteArticle: function (payload) {
    return FavouriteUrl.addFavouriteArticleRes.save(payload)
  },
  // 删除收藏医生/收藏文章
  delFavouriteDoctor: function (payload) {
    return FavouriteUrl.delFavouriteDoctorRes.remove(payload) // 收藏id
  },
  // 获取用户收藏的文章或者医生的id列表
  getFavouriteIdList: function (payload) {
    return FavouriteUrl.getFavouriteIdListRes.save(payload)
  },
  // 获取用户收藏的文章或者医生列表
  getFavouriteList: function (payload) {
    return FavouriteUrl.getFavouriteListRes.save(payload)
  },
  // 检查是否已收藏
  checkIsFavourite: function (payload) {
    return FavouriteUrl.checkIsFavouriteRes.save(payload)
  }
}

export default FavouriteApi

