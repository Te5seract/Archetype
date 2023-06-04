import CommonProviders from "./CommonProviders.js";

/**
* @namepsace Provider
*
* this provider quietly handles components
* components are not explicity set in the 
* main configuration for Archetype
* so they need to be handled in the background
*
* author: Isaac Astley <isaacastley@live.com>
*/
export default class ComponentProvider extends CommonProviders {
	constructor ({ components }) {
		super();

		// static
		this.components = super.format(...components);

		// dynamic
		this.namedComponents = {}

		// kickoff
		//this.#getComponents();
		this.#share();
	}

	/**
	* gets the page class' components
	*
	* @return {void}
	*/
	#getComponents () {
		this.components.forEach(component => {
			const config = component.prototype.config_,
				constructName = component.constructor.name;

			if (!config) {
				this.namedComponents[constructName] = component.prototype;

				return;
			}
			
			let name = config() && config().name ? config().name : constructName;

			this.namedComponents[name] = component;
		});
	}

	/**
	* shares one class with others
	*
	* @return {void}
	*/
	#share () {
		const destinations = [],
			compNames = Object.keys(this.components);

		compNames.forEach(comp => {
			const component = this.components[comp],
				config = component.config_;

			if (!config) return;

			const shareTo = config().share,
				shareFrom = config().name ? config().name : component.name_;

			if (!shareTo) return;

			shareTo.forEach(share => {
				if (this.components[share]) {
					super.merge(this.components[share], component, shareFrom);
					//super.merge(this.components[share], component);
				}
			});
		});
	}

	get () {
		return this.namedComponents;
	}
}
