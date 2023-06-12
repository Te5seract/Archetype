/**
* @namespace Config
*
* this class provides commonly
* used methods for all config classes
*
* author: <isaacastley@live.com>
*/
export default class CommonConfig {
	/**
	* get the name from the instance's config
	*
	* @param {object} instance
	* the class inastance to get the name from
	*
	* @return {string}
	*/
	name (instance) {
		const config = instance.prototype.config_,
			constructor = instance.prototype.constructor.name;

		if (config && config() && config().name) {
			return config().name;
		}

		return constructor;
	}

	/**
	* builds configuration if none has
	* been set, if existing configuration is
	* there sans the name, the existing config
	* will be appended to the new config
	*
	* @param {object} append
	* existing config to append to the injected
	* configuratio
	*
	* @return {object}
	 */
	configInject (append) {
		// if no pre-existing configuration
		if (!append) {
			return { ...this.$inject };
		}

		/**
		* if existing config inject extra config
		* options set from the bound class' 
		* inject property
		*/
		const conf = {
			...append,
			...this.$inject
		}

		return () => {
			return conf;
		}
	}
}
