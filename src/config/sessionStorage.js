/**
 * 保存在sessionStorage里面的数据属性
 * 获取sessionStorage对象解析成json：let datas =  JSON.parse(window.sessionStorage.getItem('baseInfo'))
 * 保存sessionStorage对象 ：window.sessionStorage.setItem('baseInfo',JSON.stringify(datas))
 * 删除sessionStorage数据：window.sessionStorage.removeItem('baseInfo')
 * 清除所有的key/value：window.sessionStorage.clear()
 */
export const SESSION_DATA = {
  SEARCH_VALUE: 'SEARCH_VALUE', // 搜索内容的保存
  LOCATION_CITY: 'LOCATION_CITY', // 定位城市信息
  SET_CITY: 'SET_CITY', // 设置城市信息,主界面
  SWITCH_CITY: 'SWITCH_CITY', // 切换城市，搜索结果
  BOOKING_QUEUE_PARAMS: 'BOOKING_QUEUE_PARAMS', // 预约队列提交的参数，操作订单列表后再按照原来的请求参数获取一遍数据
  WE_CHAT_CODE: 'WE_CHAT_CODE',
  REGISTER_STATIC: 'REGISTER_STATIC' // {type, deptId, docId}注册统计数据，type: 1 约床患者，2 科室二维码，
  // 3 微信公众号，4 医生推荐，5 购买保险自动注册，6 产检患者，7 PC，8 APP，9 医生二维码
  // QRCodeDept: 'QRCodeDept', // 扫科室二维码信息
  // DEPT_ENTER: 'DEPT_ENTER' // 保存检测科室主页进入方式
}

export const LOCATION_DATA = {
  QRCODE_DEPT: 'QRCodeDept'    // 扫码进入定制化科室主页 {deptId: '', enter: 'link'/'qrcode'}
}
