import CommonProviders from "./CommonProviders.js";

/**
* provides actions to the page service
* based on the page's configuration
*
* @namespace Provider
*/

export default class PageProvider extends CommonProviders {
    constructor ({ page, configProps, components }) {
		super();

		// static
        this.page = page;
        this.configProps = configProps;
        this.configKeys = Object.keys(this.configProps).filter(key => key !== "route");
		this.componentList = components;

		this.components = super.format(...components);

		/**
		* kickoff
		* instantiate methods from the configKeys
		* set in the page's class config_() method
		*/
		//this.configKeys.forEach(key => {
			//if (this["set" + key]) this["set" + key]();
		//});
		this.setComponents();
    }

	/**
	* sets components to the selected page
	*
	* @return {void}
	*/
	setComponents () {
		super.merge(this.page, this.components);
	}

	/**
	* gets merged components
	*
	* @return {object}
	*/
	getComponents () {
		return this.components;
	}

	/**
	* require in classes from the
	* reservoir if required classes exist
	*
	* @param {object} reservoir
	* the reservoir object
	*
	* @return {void}
	*/
	passRequired (reservoir) {
		if (!this.configProps.require) return;

		super.require(this.page, this.configProps.require, reservoir);
	}
}
