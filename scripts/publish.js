import inquirer from "inquirer";
import { createRequire } from "module";
import fs from "fs";

const require = createRequire(import.meta.url),
	data = require("../build/package.json");

console.log(`Current Archetype version: ${ data.version }`);

const publish = [
	{
		name : "version",
		type : "input",
		message : "What version would you like to publish to? "
	}
];

inquirer.prompt(publish).then(publisher => {
	console.log(`Preparing to publish Archetype v${ publisher.version }`);

	data.version = publisher.version;

	fs.writeFile("./build/package.json", JSON.stringify(data, null, 4), err => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(">success: Package updated!");
	});
});
