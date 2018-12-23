export default {
  /**
   *  高危测评列表分组
   * @param riskList 原数组
   * @returns {Array} 分好的组
   */
  subjectRecordsSortRisk (riskList) {
    let arr = []
    if (riskList.length) {
      riskList.forEach(risk => {
        let isContain = false
        let keyIndex = 0
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].key === risk.name) {
            keyIndex = i
            isContain = true
            break
          }
        }
        if (isContain) {
          arr[keyIndex].list.push(risk)
        } else {
          arr.push({
            key: risk.name,
            list: [risk]
          })
        }
      })
    }
    return arr
  },
  /**
   * 转换高危测评列表,  递归无限级分组
   * @param rows 测评列表
   * @returns {Array} 转换好的列表
   */
  subjectRecordsConvert (rows) {
    // 判断传入的父类ID是否在数组里面
    function exists (rows, parentId) {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].row_number === parentId) {
          return true
        }
      }
      return false
    }

    let nodes = []
    // 获取所有一级分类
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      if (!exists(rows, row.p_id)) {
        row.children = []
        nodes.push(row)
      }
    }

    // 将一级分类放入待处理数组中
    let toDo = []
    for (let i = 0; i < nodes.length; i++) {
      toDo.push(nodes[i])
    }
    while (toDo.length) {
      // 逐个弹出
      let node = toDo.shift()
      // 查找它的下级分类
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        // 如果是它的下级分类则放入 children 数组中
        if (row.p_id === node.row_number) {
          row.children = []
          if (node.children) {
            node.children.push(row)
          } else {
            node.children = [row]
          }
          // 将当前分类放入待处理数组中
          toDo.push(row)
        }
      }
    }
    return nodes
  }
}
