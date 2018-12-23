'use strict'

module.exports = {
  options: {
    isWebpack2: true
  },
  plugins: [
    {
      name: 'vux-ui'
    },
    {
      name: 'less-theme',
      path: 'src/styles/theme.less'
      // https://github.com/airyland/vux/blob/v2/src/styles/variable.less
    }
  ]
}

