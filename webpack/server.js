const path = require("path");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = env => {
  const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
  const enviromentConfig = isDevBuild => {
    if (isDevBuild)
      return {
        mode: "development",
        devtool: "inline-source-map"
      };

    return {
      mode: "production"
    };
  };
  const config = {
    name: "SSR",
    context: path.join(__dirname, "./dist/"),
    entry: {
      main: ["@babel/polyfill", path.join(__dirname, "../Server/index.js")]
    },
    output: {
      path: path.join(__dirname, "../build"),
      filename: "server.js",
      publicPath: "/dist/"
    },
    target: "node",

    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false
    },
    externals: nodeExternals({
      whitelist: /\.(sa|sc|c)ss$/
    }),
    plugins: [
      new FileManagerPlugin({
        onEnd: {
          copy: [
            {
              source: path.resolve(__dirname, "../package.json"),
              destination: path.resolve(__dirname, "../build/package.json")
            },
            {
              source: path.resolve(__dirname, "../favicon.ico"),
              destination: path.resolve(__dirname, "../build/favicon.ico")
            },
            {
              source: path.resolve(__dirname, "../Server/resources"),
              destination: path.resolve(__dirname, "../build/resources")
            },
            {
              source: path.resolve(__dirname, "../public"),
              destination: path.resolve(__dirname, "../build/public")
            }
          ]
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: ["pug-loader"]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: reStyle,
          rules: [
            {
              issuer: { not: [reStyle] },
              use: "isomorphic-style-loader"
            },
            {
              test: /\.(sa|sc|c)ss$/,
              use: [
                {
                  loader: "css-loader",
                  options: {
                    modules: false
                  }
                },
                "postcss-loader",
                "sass-loader",
                {
                  loader: "sass-resources-loader",
                  options: {
                    resources: [
                      path.resolve(
                        __dirname,
                        path.resolve(
                          __dirname,
                          "../Client/assets/variables.scss"
                        )
                      )
                    ]
                  }
                }
              ]
            }
          ]
        },
        {
          test: /\.(jpg|svg|jpeg|gif|png)$/,
          exclude: /node_modules/,
          loader: "file-loader",
          options: {
            fallback: "file-loader",
            limit: 1024,
            emitFile: false
          }
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: "file-loader?name=fonts/[name].[ext]",
          options: {
            emitFile: false
          }
        },
        {
          test: /\.(mov|mp4|cert|key)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                emitFile: false
              }
            }
          ]
        }
      ]
    }
  };

  return merge(enviromentConfig(), config);
};
