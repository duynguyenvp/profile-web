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
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest')
const FileManagerPlugin = require('filemanager-webpack-plugin');
const entries = {
	login: ["@babel/polyfill", './Client/pages/login/index.js'],
	register: ["@babel/polyfill", './Client/pages/register/index.js'],
	resume: ["@babel/polyfill", './Client/pages/resume/index.js'],
	home: ["@babel/polyfill", './Client/pages/home/index.js'],
	blog: ["@babel/polyfill", './Client/pages/blog/index.js'],
	admin: ['./Client/pages/admin/index.js'],
}

module.exports = env => {
	const isDevBuild = !(env && env.prod);
	const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
	const SharedConfig = () => ({
		output: {
			filename: (pathData) => {
				if (Object.keys(entries).includes(pathData.chunk.name) || pathData.chunk.name.indexOf('runtime') != -1) return '[name].js'
				return '[name].[contenthash].js';
			},
			chunkFilename: '[id].[contenthash].js',
			path: path.resolve(__dirname, './build/dist/'),
			publicPath: '/dist/',
		},
		entry: entries,
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
			new WebpackAssetsManifest({
				output: 'assets.json',
				entrypoints: true,
				entrypointsKey: 'entryPoints',
			}),
			new CopyPlugin([
				{
					from: 'Client/common-resources/material-design-icons/*',
					to: '../material-design-icons/',
					toType: 'dir',
					flatten: true,
				}
			]),
			new WorkboxPlugin.GenerateSW({
				swDest: '../sw.js',
				clientsClaim: true,
				skipWaiting: true,
				maximumFileSizeToCacheInBytes: 5000000,
				runtimeCaching: [
					{
						urlPattern: new RegExp('^https:\/\/(.*).fbcdn.net\/(.*)'),
						handler: 'CacheFirst'
					},
					{
						urlPattern: new RegExp('^https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)'),
						handler: 'CacheFirst'
					},
					{
						urlPattern: new RegExp('^(http|https):\/\/(somethingaboutme.info|localhost)\/workbox(.*).js'),
						handler: 'CacheFirst'
					},
					{
						urlPattern: new RegExp('^(http|https):\/\/(somethingaboutme.info|localhost)\/\#(.*)'),
						handler: 'NetworkFirst'
					},
					{
						urlPattern: new RegExp('^(http|https):\/\/(somethingaboutme.info|localhost)(.*)'),
						handler: 'NetworkFirst'
					}
				]
			}),
			new FileManagerPlugin({
				onStart: {
					delete: [
						path.resolve(__dirname, 'build/workbox*')
					]
				},
				onEnd: {
					copy: [
						{ source: path.resolve(__dirname, 'build/dist/assets.json'), destination: path.resolve(__dirname, 'Server/views/assets.json') }
					]
				}
			})
		],
		resolve: {
			extensions: ['.js', '.jsx'],
			alias: {
				modules: path.join(__dirname, "node_modules"),
			}
		},
		optimization: {
			moduleIds: 'hashed',
			runtimeChunk: 'single',
			splitChunks: {
				cacheGroups: {
					vendor: {
						// can be used in chunks array of HtmlWebpackPlugin
						test: /[\\/]node_modules[\\/]/,
						chunks: "all",
						maxSize: 300 * 1000,
					},
					common: {
						test: /[\\/]src[\\/]components[\\/]/,
						chunks: "all",
						minSize: 0,
					},
				},
			}
		},
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
			new BundleAnalyzerPlugin({ analyzerPort: 9999 }),
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
