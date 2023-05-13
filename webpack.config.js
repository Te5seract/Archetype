const path = require("path"),
	TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode : "production",
    entry : "./src/main.js",
    devServer : {
        static : {
            directory : __dirname
        }
    },
    output : {
        filename : "archetype.min.js",
        path : path.resolve(__dirname, "build")
    },
	optimization : {
		minimize : true,
		minimizer : [ 
			new TerserPlugin() 
		]
	}
};
