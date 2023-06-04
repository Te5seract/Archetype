/**
* this class provides commonly used
* services to the service classes
*
* @namespace Services
*
* author: Isaac Astley <isaacastley@live.com>
*/
export default class CommonServices {
	constructor () {
		this.hooks = new Map();
	}

	/**
	* executes IIFE methods
	* proto = object such as {}
	* before = before instantiation 
	* after = after instantiation
	*/
	exec$ (subject) {
		if (!subject) return;

		const after = subject.constructor.prototype;

		const methods = Object.getOwnPropertyNames(after).filter(method => method.match(/^\$\w+/));

		methods.forEach(method => {
			subject[method]();
		});
	}

	/**
	* sets a hook to the current service
	*
	* @param {string} name
	* the name of the hook
	*
	* @param {any} value
	* the value to provide to the hook
	*
	* @return {void}
	*/
	setHook (name, value) {
		if (!value) return;

		this.hooks.set(name, value);
	}

	getHook (name) {
		if (!this.hooks.get(name)) return;

		return this.hooks.get(name);
	}
}
