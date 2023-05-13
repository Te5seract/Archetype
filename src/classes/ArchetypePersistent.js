import ArchetypeHelpers from "./ArchetypeHelpers.js";

/**
* this class handles persistently active classes
* that are constantly running in the background
*
* author: Isaac Astley (isaacastley@live.com)
*/
export default class ArchetypePersistent extends ArchetypeHelpers {
	constructor (persist) {
		super();

		// static
		this.persist = persist;

		// dynamic
		this.imports = {};
		this.test = {};

		if (this.persist) {
			this._persist();
		}
	}

	/**
	* collects information from the persist() method
	* and merges dependencies if there are any
	*
	* @return {void}
	*/
	_persist () {
		const instances = this.persist(ArchetypePersistent._provide).filter(Boolean);

		if (!instances.length) return;

		instances.forEach(instance => {
			const IIFEmethods = Object.getOwnPropertyNames(instance.prototype).filter(method => method.match(/\$[^_|$]\w+/g)),
				persistentInstance = new instance();

			ArchetypePersistent._executeIIFE(instance);
		});
	}

	/**
	* provides services for the persistent class
	*
	* @param object instance
	* the class to provide imports to
	*
	* @param array ...imports
	* the imports to provide to the instance
	*
	* @return {void}
	*/
	static _provide (instance, ...imports) {
		imports.forEach(imp => {
			const methods = Object.getOwnPropertyNames(imp.prototype).filter(key => !key.match(/constructor/i)),
				name = imp.prototype.config_ ? imp.prototype.config_().name : imp.prototype.constructor.name;

			instance.prototype[name] = {};

			methods.forEach(method => {
				instance.prototype[name][method] = imp.prototype[method];
			});
		});

		const persistentInstance = new instance();

		ArchetypePersistent._executeIIFE(instance);

		return;
	}
}
