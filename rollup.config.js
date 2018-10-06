import requireContext from 'rollup-plugin-require-context';
 
export default {
  input: './SYSTEM/bin/js/IMPORT.js',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'iife'
    }
  ],
  plugins: [
    requireContext()
  ]
};