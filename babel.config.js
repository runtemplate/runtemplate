module.exports = api => {
  api.cache(true)
  const isBrowser = process.env.BABEL_ENV === 'browser'
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: isBrowser ? { browsers: '>1%' } : { node: 10 },
          modules: isBrowser ? false : 'commonjs',
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ],
    ],
    plugins: ['lodash'],

    ignore: ['node_modules', 'build', 'babel.config.js'],
  }
}
