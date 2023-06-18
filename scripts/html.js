//const fs = require("fs");
import fs from "fs";

/**
* This file just creates a developer directory and adds an index.html to it
*/

// check if the dev directory exists

if (!fs.existsSync("./dev/index.html")) {
	console.log(">building: Developer directory doesn't exist, making developer directory...");

	fs.mkdir("./dev", { recursive : true }, err => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(">success: Developer directory created, adding index file...");
	});

	fs.open("./dev/index.html", "as+", 0o666, err => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(">success: Index file created, building index.html...");
	});
}

// create the index.html and put content into it
const content = 
	`<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Archetype</title>
		<script src="./js/main.js" type="module" defer></script>
	</head>
	<body>
		<h1>Welcome!</h1>

		<p>Welcome to Archetype!</p>

		<p>
			Open the console and you should see ">Home" in the logs.
		</p>
	</body>
	</html>`;

fs.writeFile("./dev/index.html", content, err => {
	if (err) {
		console.log(err);

		return;
	}

	console.log(">success: Index HTML has been created!");
});
