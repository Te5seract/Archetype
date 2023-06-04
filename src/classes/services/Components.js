export default class Components {
	constructor ({ components, config, provider }) {
		// instances
		this.config = config;
		this.provider = provider;

		// static
		this.components = components;

		// kickoff
		this.#components();
	}

	#components () {
		this.components();
	}
}
