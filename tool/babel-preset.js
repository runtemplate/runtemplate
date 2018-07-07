module.exports = (api, option) => {
  // const ENV = api.getEnv()
  // const envPresentOpt = ENV in envPresentOpts ? envPresentOpts[ENV] : envPresentOpts.default
  const envPresentOpt = { targets: { node: 'current' }, ...option }
  // console.log('>>>', envPresentOpt)
  return {
    presets: [['@babel/preset-env', envPresentOpt]],

    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-default-from',

      'lodash',
      // '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    ],
  }
}
