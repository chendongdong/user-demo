/** 克隆数据的工具类 */
export default {

  /**
   * 克隆一个对象
   * @param myObj
   * @returns {*}
   */
  cloneObject (myObj) {
    if (typeof (myObj) !== 'object') {
      return myObj
    }
    if (myObj === null) {
      return myObj
    }
    var myNewObj = {}
    for (var i in myObj) {
      myNewObj[i] = this.cloneObject(myObj[i])
    }
    return myNewObj
  },

  getType (o) {
    var _t
    return ((_t = typeof (o)) === 'object' ? o === null && 'null' || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase()
  },
  /**
   * 克隆对象，数组，对象嵌套数组，数组嵌套对象都可以
   * @param destination  目的数据，要克隆给destination
   * @param source  数据源
   */
  extend (destination, source) {
    for (var p in source) {
      if (this.getType(source[p]) === 'array' || this.getType(source[p]) === 'object') {
        destination[p] = this.getType(source[p]) === 'array' ? [] : {}
        this.extend(destination[p], source[p])
      } else {
        destination[p] = source[p]
      }
    }
  }
}
