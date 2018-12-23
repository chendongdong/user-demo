export default {
  autoTextarea (elem, extra, maxHeight) {
    extra = extra || 0
    let isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window
    let isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera')
    let addEvent = function (type, callback) {
      elem.addEventListener ? elem.addEventListener(type, callback, false) : elem.attachEvent('on' + type, callback)
    }
    let getStyle = elem.currentStyle ? function (name) {
      let val = elem.currentStyle[name]
      if (name === 'height' && val.search(/px/i) !== 1) {
        var rect = elem.getBoundingClientRect()
        return rect.bottom - rect.top -
          parseFloat(getStyle('paddingTop')) -
          parseFloat(getStyle('paddingBottom')) + 'px'
      }
      return val
    } : function (name) {
      return window.getComputedStyle(elem, null)[name]
    }
    let minHeight = parseFloat(getStyle('height'))
    elem.style.resize = 'none'
    let change = function () {
      let scrollTop
      let height
      let padding = 0
      let style = elem.style

      if (elem._length === elem.value.length) {
        elem.style.height = minHeight + 'px'
        return
      }
      elem._length = elem.value.length

      if (!isFirefox && !isOpera) {
        padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'))
      }
      scrollTop = document.body.scrollTop || document.documentElement.scrollTop

      elem.style.height = minHeight + 'px'
      // 如果输入内容的高度大于当前高度, 调整高度
      if (elem.scrollHeight > minHeight) {
        // 如果输入内容的高度大于设置的最大高度，则按最大高度显示，并显示滚动条
        if (maxHeight && elem.scrollHeight > maxHeight) {
          height = maxHeight - padding
          style.overflowY = 'auto'
        } else {
          height = elem.scrollHeight - padding
          style.overflowY = 'hidden'
        }
        style.height = height + extra + 'px' // 控制高度变化的关键
        scrollTop += parseInt(style.height) - elem.currHeight
        document.body.scrollTop = scrollTop
        document.documentElement.scrollTop = scrollTop
        elem.currHeight = parseInt(style.height) // 这行代码没什么作用
      }
    }
    addEvent('propertychange', change)
    addEvent('input', change)
    addEvent('focus', change)
    change()
  }
}
