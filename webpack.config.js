import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import loaderUtils from 'loader-utils'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getCSSModuleLocalIdent = (loaderContext, localIdentName, localName) => {
  const base = path.parse(loaderContext.resourcePath).name.replace(/\.m$/, '')
  const stringForHash = path.posix.relative(loaderContext.rootContext, loaderContext.resourcePath) + localName
  const hash = loaderUtils.getHashDigest(stringForHash, 'md5', 'base64', 5)

  return `${base}_${localName}__${hash}`
}

export default (env) => {
  const isProduction = env.mode === 'production'
  const isDevelopment = env.mode === 'development'

  return {
    entry: './src/app/index.tsx',
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
      assetModuleFilename: isProduction ? 'assets/[name].[hash][ext]' : 'assets/[name][ext]',
    },
    mode: env.mode ?? 'development',
    devServer: {
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:3001',
          pathRewrite: { '^/api': '' },
          changeOrigin: true,
        },
      ],
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    plugins: [
      new HTMLWebpackPlugin({ template: './public/index.html' }),
      isProduction && new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' }),
      new Dotenv(),
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            to: '.',
            globOptions: {
              ignore: ['**/index.html'],
            },
            noErrorOnMissing: true,
          },
        ],
      }),
      new ForkTsCheckerWebpackPlugin(),
      isDevelopment && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                ['@babel/preset-react', { runtime: 'automatic' }],
              ],
              plugins: isDevelopment ? ['react-refresh/babel'] : [],
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: /\.m\.scss$/,
                  namedExport: false,
                  exportLocalsConvention: 'as-is',
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          type: 'asset/resource',
          generator: {
            filename: isProduction ? 'assets/fonts/[name].[hash][ext]' : 'assets/fonts/[name][ext]',
          },
        },
        { test: /\.(jpe?g|png|gif|webp)$/, type: 'asset/resource' },
        { test: /\.svg$/, type: 'asset/resource', resourceQuery: /url/ },
        {
          test: /\.svg$/,
          issuer: /\.tsx?$/,
          use: '@svgr/webpack',
          resourceQuery: { not: [/url/] },
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
      extensions: ['.tsx', '.ts', '.js'],
    },
  }
}
