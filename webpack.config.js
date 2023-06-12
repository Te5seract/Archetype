const path = require("path"),
	TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    //mode : "development",
	mode : "production",
    entry : "./src/main.js",
    devServer : {
        static : [
            { directory : __dirname + "/dev" },
            { directory : __dirname + "/build" }
        ],
        liveReload : true,
        port : 3000,
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
