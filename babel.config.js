module.exports = api => {
  // console.log('babel.config api.env() >>', api.env())
  const isBrowser = api.env('browser')
  return {
    presets: [
      [
        '@babel/preset-env',
        isBrowser ? { targets: { browsers: '>1%' }, modules: false, useBuiltIns: 'usage' } : { targets: { node: 'current' } },
      ],
    ],
    plugins: ['lodash'],
  }
}
