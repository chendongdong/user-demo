/** 计算日期的工具类 */
export default {

  /***
   * 获取addDay天后的日期
   * @param addDay ： 0表示今天 1表示明天 依次类推
   * @returns {string}
   */
  getDate (addDay) {
    var dd = new Date()
    dd.setDate(dd.getDate() + addDay) //  获取AddDayCount天后的日期
    var y = dd.getFullYear()
    var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1) //  获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() //  获取当前几号，不足10补0
    return y + '-' + m + '-' + d
  },
  /**
   * 获取date后addDay天的日期
   * @param date
   * @param addDay
   * @returns {string}
   */
  getAssignDate (date, addDay) {
    var dd = new Date(date)
    dd.setDate(dd.getDate() + addDay) //  获取AddDayCount天后的日期
    var y = dd.getFullYear()
    var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1) //  获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() //  获取当前几号，不足10补0
    return y + '-' + m + '-' + d
  },

  //  获取两个日期相差的天数
  daysBetween (DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'))
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1)
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'))

    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'))
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1)
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'))

    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000)
    return cha
  },

  //  获得某月的最后一天
  getLastDay (year, month) {
    var newYear = year // 取当前的年份
    var newMonth = month++// 取下一个月的第一天，方便计算（最后一天不固定）
    if (month > 12) {
      newMonth -= 12 // 月份减
      newYear++ // 年份增
    }
    var newDate = new Date(newYear, newMonth, 1) // 取当年当月中的第一天
    return (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate()// 获取当月最后一天日期
  }
}
