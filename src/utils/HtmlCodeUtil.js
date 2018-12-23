export default {
  // 将标签转义码转换成html标签
  HTMLDecode (text) {
    let temp = document.createElement('div')
    temp.innerHTML = text
    let output = temp.innerText || temp.textContent
    temp = null
    return output
  }
}
