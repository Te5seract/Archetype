/**
* @namespace Provider
*
* this class is extended from specific
* class providers, it provides a bunch of 
* methods that can be reused throughout other
* provider classes
*
* author: Isaac Astley <isaacastley@live.com>
*/
export default class CommonProviders {
	/**
	* removes a method from a prototype
	*
	* @param {object} subject
	* the instance to remove methods from
	*
	* @param {array} ...remove
	* the methods to remove from the instnace
	*
	* @return {void}
	*/
	remove (subject, ...remove) {
		remove.forEach(method => {
			delete subject.prototype[method];
		});
	}

	/**
	* merges one or more classes into another class
	*
	* @param {object} subject
	* the subject class to merge other
	* classes into
	*
	* @param {array} ...items
	* an array of classes to merge into
	* the subject class
	*
	* @return {void}
	*/
	merge (subject, items, objectName) {
		let names = Object.keys(items);

		if (!subject.prototype) {
			subject[objectName] = items;

			return;
		}

		names.forEach(name => {
			subject.prototype[name] = items[name];
		});
	}

	/**
	* formats classes into only their 
	* prototype methods object and 
	* returns them
	*
	* @param {array} ...items
	* the classes to convert to objects
	*
	* @return {object}
	*/
	format (...items) {
		const formatted = {};

		items.forEach(item => {
			const config = item.prototype.config_,
			//const config = item.prototype.config_ ? item.prototype.config : item.config_,
				constructorName = item.prototype.constructor.name;

			let name = config && config() && config().name ? config().name : constructorName;

			name = !name ? constructorName : name;

			formatted[name] = item.prototype;

			if (!config || !config().name) {
				item.prototype.name_ = name;
			}
		});

		return formatted;
	}

	/**
	* requires in other classes into
	* a subject class using the reservoir
	*
	* @param {object} subject
	* the subject class to add other
	* classes into
	*
	* @param {object} config
	* the configuration for the subject
	* mainly just the require object
	*
	* @param {object} reservoir
	* all classes that may or may not
	* be required into the subject
	*
	* @return {void}
	*/
	require (subject, config, reservoir) {
		const types = Object.keys(config);

		types.forEach(type => {
			if (CommonProviders[type]) {
				this.requireSubject = subject;
				CommonProviders[type](this, config[type], reservoir[type]);
			}
		});
	}

	// -- protected

	/**
	* called from the require method
	*
	* @param {object} provider
	* the CommonProviders class
	*
	* @param {object} configuration for
	* the subject (in the provider)
	*
	* @param {object} constants
	* constantly running classes to be 
	* required into the subject class
	*
	* @return {void}
	*/
	static constants (provider, config, constants) {
		const subject = provider.requireSubject;

		config.forEach(item => {
			subject.prototype[item] = constants[item]
		});
	}

	/**
	* called from the require method
	*
	* @param {object} provider
	* the CommonProviders class
	*
	* @param {object} configuration for
	* the subject (in the provider)
	*
	* @param {object} constants
	* constantly running classes to be 
	* required into the subject class
	*
	* @return {void}
	*/
	static components (provider, config, components) {
		const subject = provider.requireSubject;

		config.forEach(item => {
			subject.prototype[item] = components[item];
		});
	}
}
