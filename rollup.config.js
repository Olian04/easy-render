import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

export default {
  input: './src/api.ts',
  output: {
    file: './cdn/easy-render.js',
    format: 'iife',
    name: 'easyRender'
  },
  plugins: [
      typescript(),
      resolve(),
      commonjs(),
      minify({
        comments: false,
      }),
  ]
}
