var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
   // API_SERVER: '"http://api.v2.yimi99.com/api"'
  API_SERVER: '"http://192.168.8.122:10088/api"'
})

