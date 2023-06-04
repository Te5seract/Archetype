import PageProvider from "./PageProvider.js";
import ConstantProvider from "./ConstantProvider.js";
import ComponentProvider from "./ComponentProvider.js";

/**
* @namespace Provider
*
* provides special provider classes to handle
* the configuration requirements of a class
*
* author: Isaac Astley <isaacastley@live.com>
*/
export default class Provider {
	/**
	* instantiates the PageProvider with options
	* and returns the page provider
	*
	* @param {object} options.page
	* the page class to send to the provider
	*
	* @param {object} options.configProps
	* the page classes configuration props
	*
	* @param {object} options.components
	* the components to pass to the provider 
	* which will then be merged to the page
	*
	* @return {object}
	*/
    page (options) {
        const componentProvider = this.#component(options),
			pageProvider = new PageProvider(options);

		pageProvider["namedComponents"] = componentProvider.get();

		return pageProvider;
    }

	/**
	* instantiates the ConstantProvider with the
	* constant instance and returns the constant provider
	*
	* @param {object} constant
	* a constant class
	*
	* @return {object}
	*/
	constant (constant) {
		return new ConstantProvider(constant);
	}

	// -- private methods

	/**
	* calls the component service for pages
	* and returns it
	*
	* @return {object}
	*/
	#component (options) {
		return new ComponentProvider(options);
	}
}
