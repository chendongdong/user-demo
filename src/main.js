import Vue from 'vue'
import Resource from 'vue-resource'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import Auth from './au/index.es5'
import { AlertPlugin, ToastPlugin, ConfirmPlugin, ConfigPlugin, LoadingPlugin } from 'vux'

// const Auth = require('./au/index')
const FastClick = require('fastclick')
FastClick.attach(document.body)
const infiniteScroll = require('vue-infinite-scroll')

import NProgress from 'components/Nprogress'

Vue.use(Resource)
Vue.use(NProgress)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(infiniteScroll)
Vue.use(LoadingPlugin)

Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX'
})
sync(store, router)
const nprogress = new NProgress({parent: '.nprogress-container'})
// router.beforeEach((route, redirect, next) => {
//   next()
// })

// console.log(process.env.API_SERVER)
Vue.http.options.root = process.env.API_SERVER
Vue.http.options.crossOrigin = true  // 跨域 访问不同域，不同ip地址都是不同的域

Vue.router = router
Vue.use(Auth, {
  auth: require('./au/drivers/auth/bearer.es5'),
  http: require('./au/drivers/http/vue-resource.1.x.es5'),
  router: require('./au/drivers/router/vue-router.2.x.es5'),
  rolesVar: 'roles'
})

const userApp = new Vue({
  router,
  store,
  nprogress,
  ...App
})

export { userApp, router, store }
