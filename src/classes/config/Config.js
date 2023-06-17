import PageConfig from "./PageConfig.js";
import ComponentConfig from "./ComponentConfig.js";
import ConstantConfig from "./ConstantConfig.js";
import GlobalConfig from "./GlobalConfig.js";

/**
* @namespace Config
*
* author: <isaacastley@live.com>
*/
export default class Config {
	constructor (reservoir) {
		this.reservoir = reservoir;
	}

	// -- public methods

	read (type, instance) {
		if (type.match(/page|pages/i)) {
			const conf = new PageConfig({ 
				instance : instance, 
				env : this.reservoir.get("env") 
			});

			this.conf = conf.get();
		}
		else if (type.match(/component|components/i))  {
			const conf = new ComponentConfig(instance);

			this.conf = conf.get();
		}
		else if (type.match(/constant|const|constants/i))  {
			const conf = new ConstantConfig(instance);

			this.conf = conf.get();
		}
		else if (type.match(/globals|global/i))  {
			const conf = new GlobalConfig(instance);

			this.conf = conf.get();
		}
	}

	get () {
		return this.conf;
	}
}
