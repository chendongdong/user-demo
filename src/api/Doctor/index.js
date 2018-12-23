import Vue from 'vue'
import {ApiVersion} from '../resources'
/**
 * 医生相关
 * */
const DoctorsUrl = {
  // 完善个人资料
  ImproInfoRes: Vue.resource(ApiVersion + 'common/doctors/register/supplement'),
  // 获取所有的职称
  ProfessRes: Vue.resource(ApiVersion + 'common/doctors/positions'),
  // 医生个人详细信息
  DoctorInfoRes: Vue.resource(ApiVersion + 'doctors/{doctorId}/profile'),
  // 发送短信模板
  SendMsgCtmRes: Vue.resource(ApiVersion + 'api/doctors/msg/ctm/send')
}
/**
 * 医生简介
 * */
const DoctorsApi = {
  // 医生的职称
  getProfession: function () {
    return DoctorsUrl.ProfessRes.get()
  },
  improveInfo: function (datas) {
    return DoctorsUrl.ImproInfoRes.save(datas)
  },
  // 获取医生详细信息
  getDoctorInfo: function (id) {
    return DoctorsUrl.DoctorInfoRes.get({
      doctorId: id
    })
  },
  // 发送短信模板
  sendMsgCtm: function (payload) {
    return DoctorsUrl.SendMsgCtmRes.update(payload)
  }
}
export default DoctorsApi
