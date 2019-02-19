export default {
  entry: ['./browser.js'],
  output: {
    path: `${__dirname}/build`,
    filename: 'browser.js',
    libraryTarget: 'commonjs2',
  },
  target: 'web',
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  module: {
    rules: [{ test: /\.js$/, loader: 'babel-loader', options: { envName: 'browser' }, exclude: /node_modules/ }],
  },
}
