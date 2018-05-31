const autoprefixer = require('autoprefixer');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const paths = require('../paths');

const postcss = {
  loader: require.resolve('postcss-loader'),
  options: {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ],
        flexbox: 'no-2009',
      }),
    ],
  },
};

const loaders = {
  csv: {
    test: /\.(csv)$/,
    loader: 'csv-loader',
  },
  js: {
    test: /\.(js|jsx|mjs)$/,
    enforce: 'pre',
    use: [
      {
        options: {
          formatter: eslintFormatter,
          eslintPath: require.resolve('eslint'),

        },
        loader: require.resolve('eslint-loader'),
      },
    ],
    include: paths.appSrc,
  },
  img: {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },
  js_file: {
    test: /\.(js|jsx|mjs)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {

      compact: true,
    },
  },
  postcss,
  css: {
    test: /\.css$/,
    use: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
        },
      },
      postcss,
    ],
  },
  sass: {
    test: /\.scss$/,
    use: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          modules: true,
          localIdentName: '[path][name]__[local]--[hash:base64:5]'
        },
      },
      postcss,
      require.resolve('sass-loader'),
    ],
  },
  media: {
    exclude: [/\.(csv|txt|js|jsx|mjs)$/, /\.html$/, /\.json$/],
    loader: require.resolve('file-loader'),
    options: {
    name: 'static/media/[name].[hash:8].[ext]',
    },
  },
};

module.exports = loaders;
