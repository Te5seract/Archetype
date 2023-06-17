import CommonConfig from "./CommonConfig.js";

/**
* @namespace Config
*
* author: <isaacastley@live.com>
*/

export default class PageConfig extends CommonConfig {
	constructor ({ instance : page, env }) {
		super();

		// static
		this.page = page;
		this.name = this.page.prototype.constructor.name;
		this.config = this.page.prototype.config_ ? this.page.prototype.config_ : this.page.config_;
		this.errors = {
			noconfig : `Archetype Error: "${ this.name }" does not have a config_() method.`,
			noroute : `Archetype Error: "${ this.name }" does not have a route property in the config_() method`
		}

		this.environment = env;

		/**
		* this is required for the super class
		* method configInject()
		*/
		this.$inject = {
			name : this.name,
			type : "page"
		};

		this.#hasConfig();
	}

	// -- protected methods

	/**
	* checks if the page has configuration
	*
	* @return {void}
	*/
	#hasConfig () {
		if (!this.config) throw this.errors.noconfig;

		this.#hasRoute();
	}

	/**
	* checks if the page has a route
	*
	* @return {void}
	*/
	#hasRoute () {
		if (!this.config().route) throw this.errors.noroute;

		this.#config();
	}

	#config () {
		if (!this.config || !this.config()) {
			this.page.prototype.config_ = super.configInject.bind(this);
			this.config = this.page.prototype.config_;

			return;
		}

		// retain exsiting configuration
		this.page.prototype.config_ = super.configInject(this.config()).bind(this);
		this.config = this.page.prototype.config_;
	}
	
	// -- public methods

	/**
	* gets the config for the current page class
	*
	* @return {object}
	*/
	get () {
		return this.config();
	}

	env (name) {
		const env = this.environment.get(name);
		if (env) {
			return env;
		}
	}
}
