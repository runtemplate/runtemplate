import babel from 'rollup-plugin-babel'

export default [
  {
    input: 'src/server.js',
    output: [{ file: 'server/index.js', format: 'cjs' }, { file: 'server/es.js', format: 'es' }],
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: [[require.resolve('./babel-preset'), { targets: { node: 'current' }, modules: false }]],
      }),
    ],
  },

  {
    input: 'src/browser.js',
    output: [{ file: 'browser/index.js', format: 'es' }],
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: [[require.resolve('./babel-preset'), { targets: { browsers: '> 1%' }, modules: false }]],
      }),
    ],
  },
]
