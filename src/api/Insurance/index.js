import Vue from 'vue'
import { ApiVersion } from '../resources'

const InsuranceUrl = {
  // 保险种类
  InsurCateRes: Vue.resource(ApiVersion + 'common/isrc/query_category'),
  // 查询保险公司
  QueryCpnyRes: Vue.resource(ApiVersion + 'common/isrc/query_cpny'),
  // 获取保单列表
  InsurOrdersRes: Vue.resource(ApiVersion + 'isrc/query_insurance_orders'),
  // （新建保）更新保单列表
  UpdateInsurDataRes: Vue.resource(ApiVersion + 'common/isrc/sync_order_xjb'),
  // 提交保单
  SubInsurOrderRes: Vue.resource(ApiVersion + 'common/isrc/pingan/surgical_order')
}
const InsuranceApi = {
  // 获取保险种类
  getInsurCate: function (data) {
    return InsuranceUrl.InsurCateRes.save(data)
  },
  // 查询保险公司
  queryCpny: function (data) {
    return InsuranceUrl.QueryCpnyRes.save(data)
  },
  getInsurOrders: function (data) {
    return InsuranceUrl.InsurOrdersRes.save(data)
  },
  updateInsurData: function () {
    return InsuranceUrl.UpdateInsurDataRes.get()
  },
  subInsurOrder: function (data) {
    return InsuranceUrl.SubInsurOrderRes.save(data)
  }
}

export default InsuranceApi

