// services
import Pages from "./services/Pages.js";

// config
import Director from "./config/Director.js";

// provider
import Provider from "./provider/Provider.js";

export default class Archetype {
	constructor () {
		this.provider = new Provider();

		this.#pages();
	}

	#pages () {
		if (!this.pages) return;

		const pages = new Pages({ 
			pages : this.pages,
			config : new Director(),
			provider : this.provider
		});
	}
}

window.Archetype = Archetype;
