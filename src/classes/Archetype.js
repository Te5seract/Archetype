// services
import PageService from "./services/PageServices.js";
import ConstantService from "./services/ConstantService.js"

// config
import Director from "./config/Director.js";

// provider
import Provider from "./provider/Provider.js";

export default class Archetype {
	constructor () {
		this.reservoir = {};

		this.provider = new Provider();

		this.pages = this.#pages();

		this.globals = this.#globals();

		this.constant = this.#constant();

		this.#execute();
	}

	/**
	* prepare and execute the page classes
	*
	* @return {void}
	*/
	#pages () {
		if (!this.pages) return;

		const pages = new PageService({ 
			pages : this.pages,
			provider : this.provider,
			config : new Director()
		});

		this.reservoir["components"] = pages.getComponents();

		return pages;
	}

	#globals () {
	}

	#constant () {
		const constant = new ConstantService({
			constant : this.constant,
			provider : this.provider,
			config : new Director(),
			reservoir : this.reservoir
		});

		return constant.get();
	}

	#execute () {
		this.pages.attach(this.reservoir);
		this.constant.attach(this.reservoir);

		//this.pages.execute();
		//this.constant.execute();
		//this.constant.init();
	}
}

window.Archetype = Archetype;
