// services
import EnvironmentService from "./services/EnvironmentService.js";
import PageService from "./services/PageService.js";
import ComponentService from "./services/ComponentService.js";
import ConstantService from "./services/ConstantService.js";
import GlobalService from "./services/GlobalService.js";

// config
import Config from "./config/Config.js";

// provider
import Provider from "./provider/Provider.js";

export default class Archetype {
	constructor () {
		// dynamic
		this.reservoir = new Map();

		// static
		this.reservoir.set("env", new Map());

		// functions
		this.env = this.#env();
		this.config = new Config(this.reservoir);
		this.page = this.#pages();
		this.globals = this.#globals();
		this.constant = this.#constant();

		this.#execute();
	}

	#env () {
		if (!this.env) return;

		return new EnvironmentService({
			env : this.env,
			reservoir : this.reservoir
		});
	}

	#pages () {
		if (!this.pages) return;

		return new PageService({
			pages : this.pages,
			reservoir : this.reservoir,
			config : this.config,
			componentService : ComponentService
		});
	}

	#globals () {
		if (!this.globals) return;

		return new GlobalService({
			globals : this.globals,
			reservoir : this.reservoir,
			config : this.config
		});
	}

	#constant () {
		if (!this.constant) return;

		return new ConstantService({
			constants : this.constant,
			reservoir : this.reservoir,
			config : this.config
		});
	}

	#execute () {
		const provider = new Provider({ 
			reservoir : this.reservoir,
			config : this.config
		});

		//console.log(this.reservoir);
	}
}

window.Archetype = Archetype;
