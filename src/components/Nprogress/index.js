import nprogress from 'nprogress'
const defaults = {
  latencyThreshold: 100,
  router: true,
  http: true
}
//  https://github.com/rstacruz/nprogress
function install (Vue, options = {}) {
  if (this.installed) return
  this.installed = true
  Object.defineProperty(Vue.prototype, '$nprogress', {
    get: function get () {
      return this.$root._nprogress
    }
  })
  options = Object.assign({}, defaults, options)
  Vue.mixin({
    beforeCreate () {
      let np = this.$options.nprogress
      if (np) {
        let requestsTotal = 0  // 请求的总长度
        let requestsCompleted = 0 // 已经完成的进度
        let { latencyThreshold, router: applyOnRouter, http: applyOnHttp } = options
        let confirmed = true
        // 加载完成的回调
        var setComplete = function () {
          requestsTotal = 0
          requestsCompleted = 0
          np.done()
        }
        // 加载开始
        var initProgress = function () {
          if (requestsTotal === 0) {
            setTimeout(() => np.start(), latencyThreshold)
          }
          requestsTotal++
          np.set(requestsCompleted / requestsTotal)
        }
        // 进度设置
        var increase = function () {
          // Finish progress bar 50 ms later
          setTimeout(() => {
            ++requestsCompleted
            if (requestsCompleted >= requestsTotal) {
              setComplete()
            } else {
              np.set((requestsCompleted / requestsTotal) - 0.1)
            }
          }, latencyThreshold + 50)
        }
        this._nprogress = np
        np.init(this)
        const http = applyOnHttp && Vue.http
        // http网络请求数据时，显示加载进度
        if (http) {
          http.interceptors.push((request, next) => {
            const showProgressBar = 'showProgressBar' in request ? request.showProgressBar : applyOnHttp
            if (showProgressBar) initProgress()

            next(response => {
              if (!showProgressBar) return response
              increase()
            })
          })
        }
        const router = applyOnRouter && this.$options.router
        // router跳转时，显示加载进度
        if (router) {
          router.beforeEach((route, from, next) => {
            const showProgressBar = 'showProgressBar' in route.meta ? route.meta.showProgressBar : applyOnRouter
            if (showProgressBar && confirmed) {
              initProgress()
              confirmed = false
            }
            next()
          })
          router.afterEach(route => {
            const showProgressBar = 'showProgressBar' in route.meta ? route.meta.showProgressBar : applyOnRouter
            if (showProgressBar) {
              increase()
              confirmed = true
            }
          })
        }
      }
    }
  })
}
function NProgress (options) {
  this.app = null
  this.configure(options || {})
}
NProgress.prototype.init = function (app) {
  this.app = app
}
NProgress.install = install
// if (typeof Object.setPrototypeOf === 'function') {
Object.setPrototypeOf(NProgress.prototype, nprogress)
// } else {
  // NProgress.prototype.__proto__ = nprogress
// }
export default NProgress
