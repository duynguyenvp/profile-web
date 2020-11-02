const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const entries = {
  login: ["@babel/polyfill", "./Client/pages/login/index.js"],
  register: ["@babel/polyfill", "./Client/pages/register/index.js"],
  resume: ["@babel/polyfill", "./Client/pages/resume-v2/index.js"],
  home: ["@babel/polyfill", "./Client/pages/home/index.js"],
  blog: ["@babel/polyfill", "./Client/pages/blog/index.js"],
  admin: ["./Client/pages/admin/index.js"],
};

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);
  const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
  const SharedConfig = () => ({
    output: {
      filename: "[name].[contenthash].js",
      chunkFilename: "[id].[contenthash].js",
      path: path.resolve(__dirname, "./build/dist/"),
      publicPath: "/dist/",
    },
    entry: entries,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.(jpg|svg|jpeg|gif|png)$/,
          exclude: /node_modules/,
          loader: "file-loader",
          options: {
            fallback: "file-loader",
            limit: 1024,
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          loader: "url-loader?limit=100000",
        },
        {
          test: /\.mp4$/,
          use: "file-loader?name=videos/[name].[ext]",
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: "react",
        "window.Quill": "quill",
      }),
      // new CheckerPlugin(),
      new CleanWebpackPlugin({
        verbose: true,
        dry: false,
      }),
      new WebpackAssetsManifest({
        output: "assets.json",
        entrypoints: true,
        entrypointsKey: "entryPoints",
      }),
      new WorkboxPlugin.GenerateSW({
        swDest: "../sw.js",
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 5000000,
        runtimeCaching: [
          {
            urlPattern: new RegExp(
              "^(http|https)://(somethingaboutme.info|localhost)/video"
            ),
            handler: "NetworkOnly",
          },
          {
            urlPattern: new RegExp("^https://(.*).fbcdn.net/(.*)"),
            handler: "CacheFirst",
          },
          {
            urlPattern: new RegExp(
              "^https://fonts.(?:googleapis|gstatic).com/(.*)"
            ),
            handler: "CacheFirst",
          },
          {
            urlPattern: new RegExp(
              "^(http|https)://(somethingaboutme.info|localhost)/workbox(.*).js"
            ),
            handler: "CacheFirst",
          },
          {
            urlPattern: new RegExp(
              "^(http|https)://(somethingaboutme.info|localhost)/#(.*)"
            ),
            handler: "NetworkFirst",
          },
          {
            urlPattern: new RegExp(
              "^(http|https)://(somethingaboutme.info|localhost)(.*)"
            ),
            handler: "NetworkFirst",
          },
        ],
      }),
      new FileManagerPlugin({
        onStart: {
          delete: [path.resolve(__dirname, "build/workbox*")],
        },
        onEnd: {
          copy: [
            {
              source: path.resolve(
                __dirname,
                "Client/common-resources/material-design-icons/"
              ),
              destination: path.resolve(
                __dirname,
                "build/material-design-icons/"
              ),
            },
            {
              source: path.resolve(__dirname, "Client/common-resources/images"),
              destination: path.resolve(__dirname, "build/dist/images"),
            },
            {
              source: path.resolve(__dirname, "build/dist/assets.json"),
              destination: path.resolve(__dirname, "Server/views/assets.json"),
            },
            {
              source: path.resolve(
                __dirname,
                "Client/common-resources/lazysizes.min.js"
              ),
              destination: path.resolve(
                __dirname,
                "build/dist/lazysizes.min.js"
              ),
            },
            {
              source: path.resolve(
                __dirname,
                "Client/common-resources/ls.unveilhooks.min.js"
              ),
              destination: path.resolve(
                __dirname,
                "build/dist/ls.unveilhooks.min.js"
              ),
            },
          ],
        },
      }),
    ],
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        modules: path.join(__dirname, "node_modules"),
      },
    },
    optimization: {
      usedExports: true,
      moduleIds: "hashed",
      runtimeChunk: "single",
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: false,
            },
          },
          parallel: true,
          cache: true,
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            // can be used in chunks array of HtmlWebpackPlugin
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            maxSize: 256 * 1000,
          },
          common: {
            test: /[\\/]src[\\/]components[\\/]/,
            chunks: "all",
            minSize: 0,
          },
        },
      },
    },
  });
  const devConfig = () => ({
    mode: "development",
    devtool: "inline-source-map",
    watch: true,
    plugins: [
      // new BundleAnalyzerPlugin({ analyzerPort: 9999 }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
    ],
    module: {
      rules: [
        {
          test: reStyle,
          rules: [
            {
              issuer: { not: [reStyle] },
              use: "isomorphic-style-loader",
              sideEffects: true,
            },
            {
              test: reStyle,
              use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                "postcss-loader",
                "sass-loader",
                {
                  loader: "sass-resources-loader",
                  options: {
                    resources: ["./Client/common-resources/variables.scss"],
                  },
                },
              ],
              sideEffects: true,
            },
          ],
        },
      ],
    },
  });
  const prodConfig = () => ({
    mode: "production",
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].[contenthash].css",
      }),
    ],
    module: {
      rules: [
        {
          test: reStyle,
          rules: [
            {
              issuer: { not: [reStyle] },
              use: "isomorphic-style-loader",
              sideEffects: true,
            },
            {
              test: reStyle,
              use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                "postcss-loader",
                "sass-loader",
                {
                  loader: "sass-resources-loader",
                  options: {
                    resources: ["./Client/common-resources/variables.scss"],
                  },
                },
              ],
              sideEffects: true,
            },
          ],
        },
      ],
    },
  });
  return merge(isDevBuild ? devConfig() : prodConfig(), SharedConfig());
};
