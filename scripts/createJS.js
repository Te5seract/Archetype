const fs = require("fs");

/**
* This file sets up the main.js for the developer environment
*/

if (!fs.existsSync("./dev/js")) {
	console.log("No js directory found, creating now...");

	fs.mkdir("./dev/js", { recursive : true }, err => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(">success: The js directory has been created! Setting up JS file system...");
	});

	fs.mkdir("./dev/js/pages", { recursive : true }, err => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(">created: dev/js/pages");
	});

	fs.mkdir("./dev/js/globals", { recursive : true }, err => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(">created: dev/js/globals");
	});

	fs.mkdir("./dev/js/constants", { recursive : true }, err => {
		if (err) {
			console.log(err);
			return;
		}
	
		console.log(">created: dev/js/constants");
	});

	fs.mkdir("./dev/js/env", { recursive : true }, err => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(">created: dev/js/env");
	});

	fs.open("./dev/js/main.js", "as+", 0o666, err => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(">created: main.js");
	});
}

const content = 
`import "/archetype.min.js";

// env

// pages

// globals

// constants

class Main extends Archetype {}

const main = new Main();`;

fs.writeFile("./dev/js/main.js", content, err => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(">success: Developer environment built successfully!");
});
