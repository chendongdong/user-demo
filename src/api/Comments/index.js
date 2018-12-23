import Vue from 'vue'
import {ApiVersion} from '../resources'

const CommentsUrl = {
  // 获取评论列表
  CommentsListRes: Vue.resource(ApiVersion + 'common/comments/list'),
  // 评论文章或者科室
  CommentsDoRes: Vue.resource(ApiVersion + 'common/comments/do'),
  // 评论点赞
  CommentsFavorRes: Vue.resource(ApiVersion + 'common/comments/thumb')
}

const CommentsApi = {
  getComments: function (data) {
    return CommentsUrl.CommentsListRes.save(data)
  },
  commentsFavor: function (data) {
    return CommentsUrl.CommentsFavorRes.save(data)
  },
  commentsDo: function (data) {
    return CommentsUrl.CommentsDoRes.save(data)
  }
}

export default CommentsApi
