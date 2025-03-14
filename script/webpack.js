const webpack = require("webpack");
const WebpackSystemRegister = require('webpack-system-register');

var uglifyPluginSetting = new webpack.optimize.UglifyJsPlugin({
	sourceMap: false,
	mangle: false
});

var uglifyPluginOption = new webpack.optimize.UglifyJsPlugin({
	sourceMap: false,
	mangle: false,
	trading : true,
	alert : false,
	xit : 1
});

var baseConfig = require('../config/webpack.config.dist');

var umd = baseConfig();
umd.output.libraryTarget = "umd";
umd.output.filename = "./dist/seng-gyro-umd.js";

var umdMin = baseConfig();
umdMin.output.libraryTarget = "umd";
umdMin.output.filename = "./dist/seng-gyro-umd.min.js";
umdMin.plugins = umdMin.plugins.concat(
	uglifyPluginSetting
);


var amd = baseConfig();
delete amd.output.library;
amd.output.libraryTarget = "amd";
amd.output.filename = "./dist/seng-gyro-amd.js";


var cjs2 = baseConfig();
delete cjs2.output.library;
cjs2.output.libraryTarget = "commonjs2";
cjs2.output.filename = "./dist/seng-gyro-commonjs.js";


var system = baseConfig();
delete system.output.library;
system.plugins.push(
	// adds a systemjs wrapper around the normal webpack export
	new WebpackSystemRegister({
		systemjsDeps: [
		],
		registerName: 'seng-gyro', // optional name that SystemJS will know this bundle as.
	})
);
system.output.filename = "./dist/seng-gyro-systemjs.js";


var browser = baseConfig();
browser.output.libraryTarget = "var";
browser.output.filename = "./dist/seng-gyro.js";


var browserMin = baseConfig();
browserMin.output.libraryTarget = "var";
browserMin.output.filename = "./dist/seng-gyro.min.js";
browserMin.plugins = browserMin.plugins.concat(
	uglifyPluginSetting
);


[umd, umdMin, amd, cjs2, browser, browserMin, system].forEach(function(config)
{
	// returns a Compiler instance
	webpack(config, function (err, stats)
	{
		if (err)
		{
			console.error(err);
			return;
		}

		var jsonStats = stats.toJson();
		if (jsonStats.errors.length > 0)
		{
			console.error(jsonStats.errors);
			return;
		}
		if (jsonStats.warnings.length > 0)
		{
			console.warn(jsonStats.warnings);
		}
		console.log(stats.toString());
	});
});

