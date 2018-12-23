import Vue from 'vue'
import {ApiVersion} from '../resources'
/**
 * 图片验证码
 * */
const ImgCodeUrl = {
  // 获取图片验证码
  GetImgCodeRes: Vue.resource(ApiVersion + 'common/image_code/generate'),
  // 校验图片验证码
  ValidateImgCodeRes: Vue.resource(ApiVersion + 'common/image_code/validate/{code}'),
  // 上传图片
  LoadImgRes: Vue.resource(ApiVersion + 'common/image', {}, {}, {emulateJSON: true}),
  // 上传base64压缩后的图片
  Base64ImgRes: Vue.resource(ApiVersion + 'common/base64image', {}, {}, {emulateJSON: true})
}
// 图片验证
const ImgCodeApi = {
  getImgCode: function () {
    return ImgCodeUrl.GetImgCodeRes.get({t: new Date().getTime()}) // 为了消除缓存影响, 加入时间戳
  },
  validateImgCode: function (code) {
    return ImgCodeUrl.ValidateImgCodeRes.get({code: code})
  },
  loadImage: function (imgFile) {
    return ImgCodeUrl.LoadImgRes.save(imgFile)
  },
  base64StrImage: function (base64str) {
    return ImgCodeUrl.Base64ImgRes.save(base64str)
  }
}
export default ImgCodeApi
