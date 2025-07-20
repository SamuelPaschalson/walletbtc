// webpack.prod.js
module.exports = {
  ...require('./webpack.config.js'),
  mode: 'production',
  devServer: undefined // Remove devServer config for production
}
