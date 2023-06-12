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
		this.all = [ ...this.constants, ...this.globals ];
		this.provider = provider;

		this.page && this.all.push([ "page", this.page ]);
		this.components && this.all.push(...this.components);

		// errros
		this.errors = {
			dirError : (conf, dir) => `Archetype Error: ${ dir } is lacking location slashes, expected formatting: ${ conf.type }/${ dir }.`,
			pageUseError : (pageConf, componentConf) => `Archetype Error: cannot use component "${ componentConf.name }" in page "${ pageConf.name }", component is already in use.`
		}

		console.log(this.all);

		// kickoff
		this.#init();
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
