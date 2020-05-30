const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// require("@babel/polyfill");
module.exports = env => {
	const isDevBuild = !(env && env.prod);
	const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
	const SharedConfig = () => ({
		output: {
			filename: '[name].js',
			chunkFilename: '[name].[hash].js',
			path: path.resolve(__dirname, './Published/Client/dist/'),
			publicPath: '/dist/',
		},
		entry: {
			login: ["@babel/polyfill", './Client/pages/login/index.js'],
			register: ["@babel/polyfill", './Client/pages/register/index.js'],
			portfolio: ["@babel/polyfill", './Client/pages/portfolio/index.js'],
			home2: ["@babel/polyfill", './Client/pages/home2/index.js'],
			blog: ["@babel/polyfill", './Client/pages/blog/index.js'],
			admin2: ['./Client/pages/admin2/index.js'],
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
					use: {
						loader: 'babel-loader'
					}
				},
				{
					test: /\.(jpg|svg|jpeg|gif|png)$/,
					exclude: /node_modules/,
					loader: 'file-loader',
					options: {
						fallback: 'file-loader',
						limit: 1024
					}
				},
				{ test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
				{
					test: /\.mp4$/,
					use: 'file-loader?name=videos/[name].[ext]',
				}
			]
		},
		plugins: [
			new webpack.ProvidePlugin({
				"React": "react",
				'window.Quill': 'quill'
			}),
			// new CheckerPlugin(),
			new CleanWebpackPlugin({
				verbose: true,
				dry: false
			}),
			new CopyPlugin([
				{
					from: 'Client/common-resources/material-design-icons/*',
					to: '../material-design-icons/',
					toType: 'dir',
					flatten: true,
				}
			]),
		],
		resolve: {
			extensions: ['.js', '.jsx'],
			alias: {
				modules: path.join(__dirname, "node_modules"),
			}
		}
	});
	const devConfig = () => ({
		mode: 'development',
		devtool: 'inline-source-map',
		watch: true,
		plugins: [
			// new UglifyJsPlugin({
			// 	sourceMap: true,
			// 	cache: true,
			// 	extractComments: false
			// }),
			// new BundleAnalyzerPlugin({ analyzerPort: 9999 }),
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: '[name].css',
				chunkFilename: '[id].css',
			}),
			// OccurrenceOrderPlugin is needed for webpack 1.x only
			// new webpack.HotModuleReplacementPlugin(),
			// Use NoErrorsPlugin for webpack 1.x
			// new webpack.NoEmitOnErrorsPlugin()
		],
		module: {
			rules: [
				{
					test: reStyle,
					rules: [
						// Convert CSS into JS module
						{
							issuer: { not: [reStyle] },
							use: 'isomorphic-style-loader',
						},
						{
							test: /\.(sa|sc|c)ss$/,
							use: [
								'style-loader',
								{
									loader: 'css-loader',
									options: {
										modules: false,
									}
								},
								'postcss-loader',
								'sass-loader',
								{
									loader: 'sass-resources-loader',
									options: {
										resources: [
											'./Client/common-resources/variables.scss'
										]
									},
								},
							],
						}
					]
				},
			]
		}
	});
	const prodConfig = () => ({
		mode: 'production',
		optimization: {
			minimizer: [new OptimizeCSSAssetsPlugin({})],
		},
		plugins: [
			new UglifyJsPlugin({
				sourceMap: false
			}),
			//new BundleAnalyzerPlugin({ analyzerPort: 9999 }),
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: '[name].[hash].css',
				chunkFilename: '[id].[hash].css'
			})
		],
		module: {
			rules: [
				{
					test: reStyle,
					rules: [
						// Convert CSS into JS module
						{
							issuer: { not: [reStyle] },
							use: 'isomorphic-style-loader',
						},
						{
							test: /\.(sa|sc|c)ss$/,
							use: [
								'style-loader',
								{
									loader: 'css-loader',
									options: {
										modules: false,
									}
								},
								'postcss-loader',
								'sass-loader',
								{
									loader: 'sass-resources-loader',
									options: {
										resources: [
											'./Client/common-resources/variables.scss'
										]
									},
								},
							],
						}
					]
				},
			]
		}
	});
	return merge(isDevBuild ? devConfig() : prodConfig(), SharedConfig());
};
