const envPresentOpts = {
  default: { targets: { browsers: '> 1%' }, modules: false },
  test: { targets: { node: 'current' } },
}

module.exports = ({ env }) => {
  const ENV = env && env()
  return {
    presets: [['@babel/preset-env', envPresentOpts[ENV] || envPresentOpts.default]],

    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-default-from',

      'lodash',
      // '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-pipeline-operator',
    ],
  }
}
