/**
* This class is for validation of the page
* class. Custom errors and requirements
* can be set here
*
* @namespace Config
*/
export default class PagesConfig {
	constructor (instance) {
		// static
		this.instance = instance;
		this.proto = instance.prototype;
		this.errors = {
			noconfig : `Archetype Error: A page must have a config_ method "${ this.proto.constructor.name }" is lacking this method.`,
			noroute : `Archetype Error: A page must include a route property in the config_ method's return value, ${ this.proto.constructor.name } is lacking this property.`
		};

		// kickoff
		this.#hasConfig();
	}

	/**
	* checks if the page has got a config
	*
	* if a config is found the #hasRoute() method is run
	* 
	* @return {void}
	 */
	#hasConfig () {
		if (!this.proto.config_) {
			throw this.errors.noconfig;
		}

		this.#hasRoute();
	}

	/**
	* checks if the page has a route set
	*
	* @return {void}
	 */
	#hasRoute () {
		if (!this.proto.config_().route) {
			throw this.errors.noroute;
		}
	}

	get () {
		return this.instance.config_();
	}
}
