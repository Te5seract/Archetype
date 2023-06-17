import UseProvider from "./UseProvider.js";
import RequireProvider from "./RequireProvider.js";
import MergeProvider from "./MergeProvider.js";

/**
* @namespace Provider
*
* author: <isaacastley@live.com>
*/
export default class Provider {
	constructor ({ reservoir, config }) {
		// static
		this.reservoir = reservoir;
		this.config = config;

		this.#use();
		this.#require();
		this.#merge();
		this.#execute();
	}

	// -- protected methods

	/**
	* includes other classes that can
	* be instantiated with the new keyword
	* these classes will either be aliased
	* with a new name or if no name is provided
	* the class name will be the constructor name
	*/
	#use () {
		const useProv = new UseProvider({
			reservoir : this.reservoir,
			config : this.config,
			provider : this
		});
	}

	/**
	* requires in the class prototype, no instantiation
	* namespacing is still done via the class' alias
	* or the constructor name
	*/
	#require () {
		const requireProv = new RequireProvider({
			reservoir : this.reservoir,
			config : this.config,
			provider : this
		});
	}

	/**
	* merges a class prototype into another
	* class, no instantiation or namespacing
	* happens in this case
	*/
	#merge () {
		const mergeProv = new MergeProvider({
			reservoir : this.reservoir,
			config : this.config,
			provider : this
		});
	}

	/**
	* executes all methods prefixed with $
	*
	* @param {object} instance
	* the executed class instance
	*
	* @param {array} methods
	* the methods that belong to the 
	* prototype of the non-executed
	* version of the instance
	*
	* @return {void}
	*/
	#$exec (instance, methods) {
		const $methods = methods.filter(method => method.match(/^\$\w+/g));

		$methods.forEach(method => {
			instance[method]();
		});
	}

	/**
	* executes constant classes and a page class
	*
	* @return {void}
	*/
	#execute () {
		const page = this.reservoir.get("page"),
			constants = this.reservoir.get("constants"),
			components = this.reservoir.get("components"),
			globals = this.reservoir.get("globals");

		if (constants) {
			constants.forEach(constant => {
				const methods = Object.getOwnPropertyNames(constant.prototype),
					constInstance = new constant();

				this.#$exec(constInstance, methods);
			});
		}

		if (!page) return;

		const pageMethods = Object.getOwnPropertyNames(page.prototype),
			pageInstance = new page();

		this.#$exec(pageInstance, pageMethods);

		components.forEach(component => {
			const componentMethods = Object.getOwnPropertyNames(component.prototype),
				componentInstance = new component();

			this.#$exec(componentInstance, componentMethods);
		});
	}

	// -- public methods

	/**
	* gets the instance from a use or merge directory
	*
	* @param {string} use
	* the directory string
	*
	* @return {object|null}
	*/
	getDir (use) {
		const split = use.split("/");

		let last;

		split.forEach(dir => {
			last = last ? last.get(dir) : this.reservoir.get(dir);
		});

		return last ? { 
			instance : last,
			config : last.prototype.config_()
		} : null;
	}

	/**
	* escapes regular expression sensitive characters
	*
	* @param {string} value
	* the string to escape
	*
	* @return {void|string}
	*/
	regEsc (value) {
		if (!value) return;

		value = value.replace(/\$/g, "\\$");
		value = value.replace(/\./g, "\\.");
		value = value.replace(/\^/g, "\\^");
		value = value.replace(/\//g, "\/");

		return value;
	}
}
