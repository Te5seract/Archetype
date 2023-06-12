import Services from "./Services.js";

/**
* @namespace Services
*
* author: <isaacastley@live.com>
*/
export default class ComponentService extends Services {
	constructor ({ components, reservoir, config }) {
		super();

		// static
		this.components = components;
		this.reservoir = reservoir;
		this.config = config;

		// kickoff
		this.#add();
	}

	/**
	* adds content to the reservoir
	*
	* @return {void}
	*/
	#add () {
		//this.reservoir.components = {};
		this.reservoir.set("components", new Map());

		this.components.forEach(component => {
			this.config.read("component", component);

			const config = this.config.get(),
				name = config.name;

			this.reservoir.get("components").set(name, component);
			//this.reservoir.components[name] = component.prototype;
		});
	}
}
