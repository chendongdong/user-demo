import Vue from 'vue'
import {ApiVersion} from '../resources'
/**
 * 文字，公告相关
 * */
export const ArticlesUrl = {
  // 文章分页
  ArticlesRes: Vue.resource(ApiVersion + 'common/articles'),
  // 发布文章
  AddArticlesRes: Vue.resource(ApiVersion + 'articles'),
  // 文章详情
  ArticlesInfoRes: Vue.resource(ApiVersion + 'common/articles/{id}'),
  // 意见反馈
  SuggestRes: Vue.resource(ApiVersion + 'common/suggest'),
  // 文章点赞
  ArticleFavorRes: Vue.resource(ApiVersion + 'common/articles/thumb/{id}'),
  // 通过文字编码获取id
  articleTypesByCodeRes: Vue.resource(ApiVersion + 'common/base_data/article_types_by_code/{code}')
}

/**
 * 文章
 * */
const ArticlesApi = {
  // 意见反馈
  suggest: function (suggest) {
    return ArticlesUrl.SuggestRes.save(suggest)
  },
  // 根据文章类型获取文章分页
  getArticles: function (articles) {
    return ArticlesUrl.ArticlesRes.get(articles)
  },
  addArticles: function (articles) {
    return ArticlesUrl.AddArticlesRes.save({articles})
  },
  deleteArticles: function (articles) {
    return ArticlesUrl.ArticlesInfoRes.delete({articles})
  },
  // 获取文章详细信息
  getArticleInfo: function (articles) {
    return ArticlesUrl.ArticlesInfoRes.get({id: articles})
  },
  getArticleDetail: function (artId) {
    return ArticlesUrl.ArticlesInfoRes.get({id: artId})
  },
  articleFavor: function (artId) {
    return ArticlesUrl.ArticleFavorRes.get({id: artId})
  },
  articleTypesByCode: function (data) {
    return ArticlesUrl.articleTypesByCodeRes.get(data)
  }
}
export default ArticlesApi
