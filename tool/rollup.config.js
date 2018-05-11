import babel from 'rollup-plugin-babel'

export default ['index', 'browser-offline', 'server-offline'].map(entry => {
  let preset
  if (entry === 'server-offline') {
    preset = { targets: { node: 'current' }, modules: false }
  } else {
    preset = { targets: { browsers: '> 1%' }, modules: false }
  }

  return {
    input: `src/${entry}.js`,
    output: [
      { file: `${entry}.js`, format: 'cjs' },
      // { file: `${entry}-es.js`, format: 'es' }
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: [[require.resolve('./babel-preset'), preset]],
      }),
    ],
  }
})
