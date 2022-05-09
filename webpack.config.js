const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'development',
  entry: {
    app: require.resolve('./dist/05.swagger/01.petstore/index'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.yaml$/,
        use: [
          { loader: 'json-loader' },
          { loader: 'yaml-loader' }
        ]
      },
      {
        test: /\.json$/,
        use: [
          { loader: 'json-loader' }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template/index.html'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve("./dist/05.swagger/01.petstore/"),
  }
};
