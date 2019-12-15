import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: 'temp/js/worker/wdtt-worker.js',
    output: {
      file: 'dist/js/worker/wdtt-worker.js',
      format: 'iife',
    },
    plugins: [ resolve() ]
  },
  {
    input: 'temp/js/worker/wdtt-train-hour-calc.js',
    output: {
      file: 'dist/js/worker/wdtt-train-hour-calc.js',
      format: 'es',
    },
    plugins: [ resolve() ]
  },
];