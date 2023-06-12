// services
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
		// static
		this.config = new Config();

		// dynamic
		//this.reservoir = {};
		this.reservoir = new Map();

		// functions
		this.page = this.#pages();
		this.globals = this.#globals();
		this.constant = this.#constant();

		this.#execute();
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
		return new GlobalService({
			globals : this.globals,
			reservoir : this.reservoir,
			config : this.config
		});
	}

	#constant () {
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
