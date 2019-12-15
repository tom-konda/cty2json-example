import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    external: [
      'react',
      'react-dom',
      'react-tabs',
      '@emotion/styled',
    ],
    input: 'temp/js/react-component/app-root.js',
    output: {
      file: 'dist/js/react-app.js',
      format: 'iife',
      globals: {
        'react' : 'React',
        'react-dom': 'ReactDOM',
        'react-tabs': 'ReactTabs',
        '@emotion/styled': 'emotionStyled',
        // 'styled-components': 'styled'
      }
    },
    plugins: [
      resolve(),
      commonjs(
        {
          namedExports: {
            '@tom-konda/cty2json': [ 'analyze' ]
          }
        }
      ),
    ]
  },
];