import CommonServices from "./CommonServices.js"

export default class ConstantService extends CommonServices {
	constructor ({ constant, provider, config, reservoir }) {
		super();

		// static
		this.constant = constant;
		this.provider = provider;
		this.config = config;
		this.reservoir = reservoir;
		this.reservoir["constants"] = {};
		this.constants = [];

		// kickoff
		this.#constant();
	}

	// -- private methods

	/**
	* calls and sets the watch method on the
	* constant method
	*
	* @return {void}
	*/
	#constant () {
		this.constant(this.#watch.bind(this));
	}

	/**
	* watches for constant classes and prepares
	* them for instantiation
	*
	* @param {object} constant
	* the constant class
	*
	* @return {void}
	*/
	#watch (constant) {
		this.config.read("constant", constant);

		const config = this.config.get();

		if (config) {
			const constantProv = this.provider.constant({ 
				constant : constant,
				configProps : config
			});

			if (config.name) {
				this.reservoir.constants[config.name] = constant.prototype;
			} 

			super.setHook("init:constant:" + config.name, (callback) => {
				callback && callback({ 
					constantProv : constantProv,
					constant : constant
				});
			});

			this.#execute(constant);
			return;
		}

		this.reservoir.constants[constant.prototype.constructor.name] = constant.prototype;

		this.constants.push(constant);
		this.#execute(constant);
	}

	/**
	* executes the constant class
	*
	* @param {object} constant
	* the constant class to execute
	*
	* @return {void}
	*/
	#execute (constant) {
		const constantInstance = new constant();

		super.exec$(constantInstance);
	}

	// -- public methods

	/**
	* get the constant service
	*
	* @retunr {this}
	*/
	get () {
		return this;
	}

	attach (reservoire) {
		const constants = Object.keys(reservoire.constants);

		if (constants.length) {
			constants.forEach(constantName => {
				const init = super.getHook("init:constant:" + constantName);

				init(({ constantProv, constant }) => {
					constantProv.passRequired(reservoire, constant);
				});
			});
		}
	}
}
