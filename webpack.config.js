const path = require("path"),
    webpack = require("webpack"),
    TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry : "./src/index.js",
    mode : "production",
    output : {
        filename : "archetype.min.js",
        path : path.resolve(__dirname, "dist")
    },
    optimization : {
        minimize : true,
        minimizer : [
            new TerserPlugin()
        ]
    }
}
