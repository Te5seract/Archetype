import CommonConfig from "./CommonConfig.js";

/**
* @namespace Config
*
* author: <isaacastley@live.com>
*/
export default class ComponentConfig extends CommonConfig {
	constructor (component) {
		super();

		// static
		this.config = component.prototype.config_ ? component.prototype.config_ : component.config_;
		this.component = component;
		this.name = super.name(component);

		/**
		* this is required for the super class
		* method configInject()
		*/
		this.$inject = {
			name : this.name,
			type : "component"
		};

		// kickoff
		this.#hasConfig();
	}

	// -- protected methods

	/**
	* checks if the component has configuration
	*
	* @return {void}
	*/
	#hasConfig () {
		if (!this.config || !this.config()) {
			this.component.prototype.config_ = super.configInject.bind(this);
			this.config = this.component.prototype.config_;

			return;
		}
		// retain exsiting configuration
		this.component.prototype.config_ = super.configInject(this.config()).bind(this);
		this.config = this.component.prototype.config_;
	}


	// -- public methods

	/**
	* gets the configuration for the components
	*
	* @return {object}
	*/
	get () {
		if (this.config) return this.config();
	}
}
