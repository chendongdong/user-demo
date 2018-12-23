'use strict'
import Vue from 'vue'
import VueResource from 'vue-resource'

export const ApiVersion = ''

Vue.use(VueResource)

Vue.http.options.root = process.env.API_SERVER
Vue.http.options.crossOrigin = true  // 跨域 访问不同域，不同ip地址都是不同的域
//   emulateHTTP 为true表示支持get post以为的

// 注释掉之后，默认都以payload的形式提交
//  Vue.http.options.emulateJSON = true
//  默认以from data 形式提交 application/x-www-form-urlencoded
//  Vue.http.headers.common['Content-type'] = 'application/json; charset=utf-8'

/**
 *
 * 提交方式：
 * 1.form data,提交参数在body中
 * 2.path ,提交参数在地址栏
 * 3.payload,提交数据以json对象形式提交
 * 注：本项目中默认是以payload形式提交，如果不是该提交方式，则要单独写
 * form data：要添加emulateJSON:true，见MoveOrderRes
 * */
