const path = require('path');
const {compilerOptions} = require('../tsconfig.json');

const basedir = path.join(__dirname, '..');

module.exports = async ({ config, mode }) => {
  config.module.rules.push(
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      include: [
        path.join(basedir, 'src'),
        path.join(basedir, 'stories'),
      ],
      options: {
        transpileOnly: true, // use transpileOnly mode to speed-up compilation
        compilerOptions: {
          ...compilerOptions,
          declaration: false,
        },
      },
    },
  );

  config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx'];
  config.resolve.enforceExtension = false;

  // disable the hint about too big bundle
  config.performance.hints = false;

  return config;
};