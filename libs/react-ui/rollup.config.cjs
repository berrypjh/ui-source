const url = require('@rollup/plugin-url');
const svg = require('@svgr/rollup');
const postcss = require('rollup-plugin-postcss');

module.exports = (config) => {
  config.plugins = config.plugins ?? [];

  config.plugins.push(
    svg({
      svgo: false,
      titleProp: true,
      ref: true,
    }),
    url({
      limit: 10000,
    }),
    postcss({
      extract: 'index.css',
      sourceMap: true,
      minimize: false,
      extensions: ['.css', '.scss'],
      use: [['sass']],
    }),
  );

  return config;
};
