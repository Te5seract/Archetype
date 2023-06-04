export default class ConstantConfig {
	constructor (instance) {
		// static
		this.instance = instance;
		this.proto = instance.prototype;
	}

	get () {
		if (!this.proto.config_) return;

		return this.proto.config_();
	}
}
