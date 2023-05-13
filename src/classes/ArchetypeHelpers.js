export default class ArchetypeHelpers {
	/**
	* executes all IIFE functions (prefixed with $) when
	* a page instance has been called
	*
	* @param {Function|object} instance
	* the instance to execute the IIFE methods from, this can
	* be an object {} or a class instance
	*
	* @return {void}
	 */
	static _executeIIFE (instance) {
		let methods = (instance instanceof Function) ? Object.getOwnPropertyNames(instance.prototype) : Object.getOwnPropertyNames(instance);

		methods = methods.filter(method => method.match(/\$[^_|$]\w+/g));

		methods.forEach(method => {
			if (instance instanceof Function) {
				instance.prototype[method]();

				return;
			} 

			instance[method]();
		});
	}
}
