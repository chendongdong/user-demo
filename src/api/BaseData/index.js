import Vue from 'vue'
import { ApiVersion } from '../resources'
/**
 * 基础数据类
 * */
const BaseDataUrl = {
  // 约床申请房间类型
  ApplyBedTypesRes: Vue.resource(ApiVersion + 'common/base_data/apply_bed_types'),
  // 性别
  GenderRes: Vue.resource(ApiVersion + 'common/base_data/gender'),
  // 约床申请房间类型(科室)
  ApplyBedTypeByDeptRes: Vue.resource(ApiVersion + 'common/base_data/apply_bed_types_by_dept/{id}'),
  // 身份证号码校验
  CheckVerifyIdRes: Vue.resource(ApiVersion + 'common/base_data/verify_id'),
  // 获取微信配置参数
  WeChatConfigRes: Vue.resource(ApiVersion + 'common/wechat_user_config'),
  // 广告banner
  HomeBannerRes: Vue.resource(ApiVersion + 'common/base_data/banner'),
  FindDataDictRes: Vue.resource(ApiVersion + 'common/base_data/find_data_dict/{code}'),
  // 网站统计
  pageStatisRes: Vue.resource(ApiVersion + 'common/base_data/web_site_stat')
}
/**
 * 基础数据类
 * */
const BaseDateApi = {
  getApplyBedTypes: function () {
    return BaseDataUrl.ApplyBedTypesRes.get()
  },
  getGender: function () {
    return BaseDataUrl.GenderRes.get()
  },
  getArticles: function (articleId) {
    return BaseDataUrl.ArticlesRes.get({
      id: articleId
    })
  },
  // 约床申请房间类型(科室)
  getApplyBedTypeByDept: function (deptId) {
    return BaseDataUrl.ApplyBedTypeByDeptRes.get({id: deptId})
  },
  // 身份证号码校验
  checkVerifyId: function (deptId) {
    return BaseDataUrl.CheckVerifyIdRes.get({id: deptId})
  },
  getWxConfig: function (url) {
    return BaseDataUrl.WeChatConfigRes.get({url: url})
  },
  getHomeBanner: function () {
    return BaseDataUrl.HomeBannerRes.get({type: 2})
  },
  findDataDict: function (code) {
    return BaseDataUrl.FindDataDictRes.get({code: code})
  },
  pageStatis: function (data) {
    return BaseDataUrl.pageStatisRes.save(data)
  }
}

export default BaseDateApi
