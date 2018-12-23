import Vue from 'vue'
import {ApiVersion} from '../resources'

const TransUrl = {
  // 转诊列表
  TransferListRes: Vue.resource(ApiVersion + 'transfer/get_applies'),
  // 转诊详情
  TransferDetailRes: Vue.resource(ApiVersion + 'transfer/detail/{id}'),
  // 取消
  TransferCancelRes: Vue.resource(ApiVersion + 'transfer/cancel/patient/{id}'),
  // 添加转诊订单图片
  TransferImgRes: Vue.resource(ApiVersion + 'transfer/increase_pic/{id}')
}

const TransApi = {
  getTransList: function (datas) {
    return TransUrl.TransferListRes.save(datas)
  },
  // 订单详情
  getTransDetail: function (data) {
    return TransUrl.TransferDetailRes.get(data)
  },
  transCancel: function (data) {
    return TransUrl.TransferCancelRes.get(data)
  },
  addTranImg: function (data) {
    return TransUrl.TransferImgRes.save({id: data.id, type: data.type}, data.images)
  }
}

export default TransApi
