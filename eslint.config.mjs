import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js(),
  // ...weitere Konfigurationen/Plugins wie z.B. React
  prettier, // ganz am Ende!
  {
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
