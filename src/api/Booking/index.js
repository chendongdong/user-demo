/**
 * Created by Fussa on 2016/11/17 上午9:55
 */
import Vue from 'vue'
import { ApiVersion } from '../resources'
/**
 * 订单相关
 **/
const BookingUrl = {
  // 预约住院
  BookingRes: Vue.resource(ApiVersion + 'common/orders'),
  // 获取医生信息(ID加密)
  GetEncryptionDoctorDetailRes: Vue.resource(ApiVersion + 'common/departments/one/encryption/doctor/{Id}'),
  // 获取科室信息(ID加密)
  GetEncryptionDeptDetailRes: Vue.resource(ApiVersion + 'common/departments/one/encryption/dept/{Id}')
}
const BookingApi = {
  // 预约住院
  newBooking: function (bookingDate) {
    return BookingUrl.BookingRes.update(bookingDate)
  },
  // 获取医生信息(ID加密)
  getEncryptionDoctorDetail: function (docId) {
    return BookingUrl.GetEncryptionDoctorDetailRes.get({Id: docId})
  },
  // 获取科室信息(ID加密)
  getEncryptionDeptDetail: function (deptId) {
    return BookingUrl.GetEncryptionDeptDetailRes.get({Id: deptId})
  }
}
export default BookingApi
