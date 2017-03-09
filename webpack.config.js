var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	entry: './src/main.js',
	output: {
		path: __dirname + "/build",
		filename: 'main.js'
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
				loader: 'style!css!sass'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: require.resolve('snapsvg'),
				loader: 'imports-loader?this=>window,fix=>module.exports=0'
			}
		]
	},
	plugins: [
		new webpack.IgnorePlugin(/vertx/),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 9999,
			open: false,
			files: ['index.html','index.css', 'build/main.js'],
			server: {
				baseDir: ['.']
			}
		})
	]
};
