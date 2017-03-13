var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	entry: './src/start.js',
	output: {
		path: __dirname + "/app",
		filename: 'start.js'
	},
	devtool: 'source-map',
	target: 'atom',
	stats: {
		colors: true,
		modules: true,
		reasons: true
	},
	resolve: {
		alias: {},
		modules: [
			'node_modules', './src/components', './src/lib'
		],
	},
	module: {
		loaders: [
			{
				test: /\.(js|jsx)/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!sass-loader'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{ test: /\.node$/, loader: 'node-loader' }
		]
	},
	plugins: [
		new webpack.IgnorePlugin(/vertx/)
	]
};
