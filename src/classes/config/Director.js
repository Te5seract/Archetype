// config types
import PagesConfig from "./PagesConfig.js";

export default class Director {
	read (type, instance) {
		if (type.match(/page|pages/)) {
			this.#page(instance);
		}
	}

	#page (instance) {
		const pageConfig = new PagesConfig(instance);
	}
}
