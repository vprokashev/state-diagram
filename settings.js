const path = require('path');

module.exports = {
  STATIC_RESOURCE_PATH: path.join(__dirname, './static'),
  WEBPACK_PUBLIC_PATH: '/',
  WEBPACK_PATH: path.join(__dirname, './tmp/'),
  WEBPACK_CONTEXT: path.join(__dirname, './src'),
  WEBPACK_BUNDLE_ENTRY: './index.ts',
  TS_CONFIG_PATH: path.join(__dirname, './tsconfig.json'),
  DEV_PORT: '2023',
  REPORT_TARGET: path.join(__dirname, './tmp/report.html'),
  THEME_CORE: null,
  stub: null,
  public: {}
};
