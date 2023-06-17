import Services from "./Services.js";

/**
* @namespace Services
*
* author: <isaacastley@live.com>
*/
export default class EnvironmentService extends Services {
	constructor ({ env, reservoir }) {
		super();

		this.env = env;
		this.reservoir = reservoir;

		this.#env();
	}

	/**
	* passes a setter to the environment 
	* method in the entry point file
	*
	* @return {void}
	*/
	#env () {
		this.env(this.#set.bind(this));
	}

	/**
	* sets the environment variable
	*
	* @param {string} name
	* the name of the environment variable
	*
	* @param {object} json
	* the JSON object value for the environment name
	*
	* @return {void}
	*/
	#set (name, json) {
		this.reservoir.get("env").set(name, json);
	}
}
