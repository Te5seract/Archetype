import path from "path";
import TerserPlugin from "terser-webpack-plugin";

	//TerserPlugin = require("terser-webpack-plugin");

export default {
    //mode : "development",
	mode : "production",
    entry : "./src/main.js",
    devServer : {
        static : [
            //{ directory : __dirname + "/dev" },
            //{ directory : __dirname + "/build" }
            { directory : "./dev" },
            { directory : "./build" }
        ],
        liveReload : true,
        port : 3000,
		open : [ "http://localhost:3000/" ]
    },

    output : {
        filename : "archetype.min.js",
        //path : path.resolve(__dirname, "build")
        path : path.resolve("./", "build")
    },

	optimization : {
		minimize : true,
		minimizer : [ 
			new TerserPlugin() 
		]
	}
};
