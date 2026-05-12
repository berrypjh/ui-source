import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    ignores: ['public', '.cache', 'node_modules'],
  },
];
