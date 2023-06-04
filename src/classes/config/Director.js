/**
* reads the appropriate config for a particular 
* service.
*
* @namespace Config
*
* author: Isaac Astley <isaacastley@live.com>
*/

// config types
import PagesConfig from "./PagesConfig.js";
import ConstantConfig from "./ConstantConfig.js";

export default class Director {
	read (type, instance) {
		if (type.match(/page|pages/i)) {
			this.#page(instance);

			return;
		}
		else if (type.match(/constant|constants/i)) {
			this.#constants(instance);

			return;
		}
	}

    get () {
        return this.getter.get();
    }

	// -- private methods

	#page (instance) {
		const pageConfig = new PagesConfig(instance);

        this.getter = pageConfig;
	}

	#constants (instance) {
		const constantConfig = new ConstantConfig(instance);

		this.getter = constantConfig;
	}
}
