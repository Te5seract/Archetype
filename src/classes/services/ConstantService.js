import Services from "./Services.js";

export default class ConstantService extends Services {
	constructor ({ constants, reservoir, config }) {
		super();

		// static
		this.constants = constants;
		this.reservoir = reservoir;
		this.config = config;
		//this.reservoir.constants = {};
		this.reservoir.set("constants", new Map());

		//kickoff
		this.#constants();
	}

	#watch (instance) {
		this.config.read("constant", instance);
		this.#add(instance);
	}
	
	#constants () {
		this.constants(this.#watch.bind(this))
	}

	#add (instance) {
		const { name } = this.config.get();

		//this.reservoir.constants[name] = instance;
		this.reservoir.get("constants").set(name, instance);
	}
}
