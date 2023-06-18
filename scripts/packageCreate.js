import fs from "fs";
import { createRequire } from "module";

/**
* copies the package.json file over
* to the build folder
*/

console.log(">copy: Copying package.json into build folder...");

fs.copyFile("./package.json", "./build/package.json", err => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(">success: Copy complete!");

	const require = createRequire(import.meta.url),
		data = require("../build/package.json");

	data.exports = "./archetype.min.js";

	fs.writeFile("./build/package.json", JSON.stringify(data, null, 4), err => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(">success: Package.json has been modified successfully in ./build!");
	});
});
