import { CONSTANT_STRING } from '../../config/Constant'
import WKWebViewBridgeUtil from './WebViewBridgeUtil'

// 判断是否是在ios APP中打开该网页
const isiOSApp = navigator.userAgent.indexOf(CONSTANT_STRING.CUSTOM_USER_AGENT_iOS_APP) > -1

const iOS = {
  push (url) {
    return WKWebViewBridgeUtil.setupWebViewJavascriptBridge(bridge => {
      bridge.callHandler('pushToViewControllerWith', {url: url})
    })
  }
}
export default {
  isiOSApp,
  iOS
}
