const path = require("path");

module.exports = {
    mode : "production",
    entry : "./src/main.js",
    devServer : {
        static : {
            directory : __dirname
        },
        port : 9000
    },
    output : {
        filename : "incantation.min.js",
        path : path.resolve(__dirname, "build")
    }
};
