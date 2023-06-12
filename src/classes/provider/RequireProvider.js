/**
* @namespace Provider
*
* author: <isaacastley@live.com>
*/
export default class RequireProvider {
	constructor ({ reservoir, config, provider }) {
		// static
		this.config = config;
		this.page = reservoir.get("page");
		this.components = reservoir.get("components");
		this.constants = reservoir.get("constants");
		this.globals = reservoir.get("globals");
		this.all = [ ...this.constants, ...this.globals ];
		this.provider = provider;

		this.page && this.all.concat([ "page", this.page ]);
		this.components && this.all.concat(...this.components);

		// errros
		this.errors = {
			dirError : (conf, dir) => `Archetype Error: ${ dir } is lacking location slashes, expected formatting: ${ conf.type }/${ dir }.`,
			pageUseError : (pageConf, componentConf) => `Archetype Error: cannot use component "${ componentConf.name }" in page "${ pageConf.name }", component is already in use.`
		}

		// kickoff
		this.#init();
	}

	// -- private methods

	#init () {
		this.all.forEach(item => {
			const instance = item[1],
				type = instance.prototype.config_().type;

			this.config.read(type, instance);

			const config = this.config.get();

			this.currentConfig = config;
			this.currentInstance = instance;

			if (config.require) {
				this.#require();
				return;
			}

			this.currentConfig = null;
			this.currentInstance = null;
		});
	}

	#require () {
		const require = this.currentConfig.require;

		require.forEach(dir => {
			if (!dir.match(/\//g)) throw this.errors.dirError(this.currentConfig, dir); 

			const { config, instance } = this.provider.getDir(dir),
				{ type, name } = config;


			if (this.currentConfig.type === "page" && type === "component") throw this.errors.pageUseError(this.currentConfig, config);

			this.currentInstance.prototype[config.name] = instance.prototype;
		});
	}
}
