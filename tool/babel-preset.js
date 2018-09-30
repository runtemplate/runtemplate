const envPresentOpts = {
  default: { targets: { node: 'current' }, modules: false },
  cjs: { targets: { browsers: '> 1%' } },
  // test: { targets: { node: 'current' } },
}

module.exports = ({ env }) => {
  const BABEL_ENV = env && env()
  return {
    presets: [['@babel/preset-env', envPresentOpts[BABEL_ENV] || envPresentOpts.default]],

    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-default-from',

      'lodash',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    ],
  }
}
