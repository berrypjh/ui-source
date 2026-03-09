const url = require('@rollup/plugin-url');
const svg = require('@svgr/rollup');

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
  );

  return config;
};
