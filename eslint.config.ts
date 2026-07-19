import base from '@blinkorb/eslint-config/base';
import react from '@blinkorb/eslint-config/react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  base,
  react,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
]);
