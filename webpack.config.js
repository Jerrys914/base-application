const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './client/index.js'],
  output: {
    path: path.resolve(__dirname, 'client/public'),
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
