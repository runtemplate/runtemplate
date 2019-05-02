module.exports = api => {
  api.cache(true)
  return {
    presets: [
      ['@babel/preset-env', { modules: process.env.BABEL_ENV === 'esm' ? false : 'commonjs', useBuiltIns: 'usage', corejs: 3 }],
    ],
    plugins: ['lodash'],

    ignore: ['node_modules', 'build', 'index.js', 'babel.config.js', 'webpack.config.js'],
  }
}
