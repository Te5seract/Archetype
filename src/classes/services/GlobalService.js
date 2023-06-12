import Services from "./Services.js";

/**
* @namespace Service
*
* author: <isaacastley@live.com>
*/
export default class GlobalService extends Services {
	constructor ({ globals, reservoir, config }) {
		super();

		// static
		this.globals = globals;
		this.reservoir = reservoir;
		this.config = config;
		//this.reservoir.globals = {};
		this.reservoir.set("globals", new Map());

		// kickoff
		this.#globals();
	}

	#watch (instance) {
		this.config.read("globals", instance);

		this.#add(instance);
	}

	#globals () {
		this.globals(this.#watch.bind(this));
	}

	#add (instance) {
		const { name } = this.config.get();

		this.reservoir.get("globals").set(name, instance);
		//this.reservoir.globals[name] = instance;
	}
}
