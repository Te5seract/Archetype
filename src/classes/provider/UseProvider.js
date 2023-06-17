import Provider from "./Provider.js";

/**
* @namespace Provider
*
* author: <isaacastley@live.com>
*/
export default class UseProvider {
	constructor ({ reservoir, config, provider }) {
		// static
		this.config = config;
		this.page = reservoir.get("page");
		this.components = reservoir.get("components");
		this.constants = reservoir.get("constants");
		this.globals = reservoir.get("globals");
		this.all = [];
		this.provider = provider;
		this.reservoir = reservoir;

		this.page && this.all.push([ "page", this.page ]);
		this.components && this.all.push(...this.components);
		this.constants && this.all.push(...this.constants);
		this.globals && this.all.push(...this.globals);

		// errros
		this.errors = {
			dirError : (conf, dir) => `Archetype Error: ${ dir } is lacking location slashes, expected formatting: ${ conf.type }/${ dir }.`,
			pageUseError : (pageConf, componentConf) => `Archetype Error: cannot use component "${ componentConf.name }" in page "${ pageConf.name }", component is already in use.`
		}

		// kickoff
		this.#init();
	}

	/**
	* sets methods on the current class
	*/
	#setMethods (instance) {
		instance.prototype.route_ = this.#route.bind(this);
		instance.prototype.source_ = this.#source.bind(this);
	}

	/**
	* gets the route's dynamic slug values
	*/
	#route () {
		return this.reservoir.get("route");
	}

	/**
	* returns the reservoir to show what is available 
	* in the current page's context
	*/
	#source () {
		return this.reservoir;
	}

	/**
	* initializes the use provider
	*
	* @return {void}
	*/
	#init () {
		this.all.forEach(item => {
			const instance = item[1],
				type = instance.prototype.config_().type;

			this.#setMethods(instance);
			this.config.read(type, instance);

			const config = this.config.get();

			this.currentConfig = config;
			this.currentInstance = instance;

			if (config.use) {
				this.#use();
				return;
			}

			this.currentConfig = null;
			this.currentInstance = null;
		});
	}

	/**
	* merging the required classes into 
	* other classes
	*
	* @return {void}
	*/
	#use () {
		this.currentConfig.use.forEach(use => {
			if (!use.match(/\//g)) throw this.errors.dirError(this.currentConfig, use); 

			const using = this.provider.getDir(use);

			if (using) {
				const { config, instance } = using,
					{ name, type } = config;

				if (this.currentConfig.type === "page" && type === "component") throw this.errors.pageUseError(this.currentConfig, config);

				this.currentInstance.prototype[name] = instance;
			}
		});
	}
}
