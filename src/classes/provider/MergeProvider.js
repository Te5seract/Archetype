/**
* @namespace Provider
*
* author <isaacastley@live.com>
*/
export default class MergeProvider {
	constructor ({ reservoir, config, provider }) {
		// static
		this.config = config;
		this.page = reservoir.get("page");
		this.components = reservoir.get("components");
		this.constants = reservoir.get("constants");
		this.globals = reservoir.get("globals");
		this.all = [];
		this.provider = provider;

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

	#init () {
		this.all.forEach(item => {
			const instance = item[1],
				type = instance.prototype.config_().type;

			this.config.read(type, instance);

			const config = this.config.get();

			this.currentConfig = config;
			this.currentInstance = instance;

			if (config.merge) {
				this.#merge();
				return;
			}

			this.currentConfig = null;
			this.currentInstance = null;
		});
	}

	/**
	* perform merging
	*
	* @return {void}
	*/
	#merge () {
		const merge = this.currentConfig.merge;

		merge.forEach(item => {
			// if object
			if (typeof item !== "string") {
				this.#mergeObject(item);

				return;
			}

			if (!item.match(/\//g)) throw this.errors.dirError(this.currentConfig, item); 

			// not object
			this.#stringMerge(item);
		});
	}

	/**
	* performs a string based merge
	*
	* @param {string} item
	* the merge item, will follow this type
	* of structure:
	*
	* merge : [ "components/header" ]
	*
	* @return {void}
	*/
	#stringMerge (item) {
		const mrgDir = this.provider.getDir(item);

		if (!mrgDir) return;

		const { config, instance } = mrgDir,
			{ name, type } = config,
			methods = Object.getOwnPropertyNames(instance.prototype).filter(item => !item.match(/constructor|config_/));

		this.#execMerge(instance, methods);
	}

	/**
	* performs object based merging
	*
	* @param {object} item
	* the merge item, will follow this type
	* of data structure:
	*
	* merge : {
	*     "components/header" : {
	*         methods : [ "methodA", "methodB" ]
	*     }
	* }
	*
	* @return {void}
	*/
	#mergeObject (item) {
		const location = Object.keys(item)[0],
			mergeSubject = this.provider.getDir(location);

		if (!mergeSubject) return;

		const { config, instance } = mergeSubject,
			{ name, type } = config,
			ignore = item[location].ignore ? item[location].ignore.join("|") : null,
			overwrite = item[location].overwrite === undefined ? true : item[location].overwrite;

		if (!location.match(/\//g)) throw this.errors.dirError(this.currentConfig, location); 

		if (item[location].methods) {
			/**
			* this scope is used when the 
			* "methods" property is being used
			*/
			this.#execMerge(instance, item[location].methods, overwrite);

			return
		}

		/**
		* this scope is for when the 
		* "methods" property is being used
		* in which the "ignore" property will
		* be used
		*/
		const methodNames = Object.getOwnPropertyNames(instance.prototype),
			methodReg = new RegExp(`${ this.provider.regEsc(ignore) }|constructor|config_`, "ig"),
			methods = ignore ? methodNames.filter(method => !method.match(methodReg)) : methodNames.filter(method => !method.match(methodReg));

		this.#execMerge(instance, methods, overwrite);
	}

	/**
	* this performs the merge
	*
	* @param {object} instance
	* the instance to pull methods out of to place
	* into the currentInstance
	*
	* @param {array} methods
	* the methods to pull out of the instance
	* param to place into the currentInstance
	*
	* @param {bool} overwrite
	* should the methods from the instance 
	* overwrite the methods possibly existing
	* in the currentInstance
	*
	* @return {void}
	*/
	#execMerge (instance, methods, overwrite) {
		methods.forEach(method => {
			if (!overwrite && !this.currentInstance.prototype[method]) {
				this.currentInstance.prototype[method] = instance.prototype[method];

				return;
			}

			this.currentInstance.prototype[method] = instance.prototype[method];
		});
	}
}
