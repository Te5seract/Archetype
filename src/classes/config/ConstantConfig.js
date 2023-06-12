import CommonConfig from "./CommonConfig.js";

export default class ConstantConfig extends CommonConfig {
	constructor (instance) {
		super();

		// static
		this.config = instance.prototype.config_ ? instance.prototype.config_ : instance.config_;
		this.constant = instance
		this.name = super.name(this.constant);

		this.$inject = {
			name : this.name,
			type : "constant"
		};

		// kickoff
		this.#hasConfig()
	}

	// -- private methods
	#hasConfig () {
		if (!this.config || !this.config()) {
			this.constant.prototype.config_ = super.configInject.bind(this);
			this.config = this.constant.prototype.config_;

			return;
		}

		// retain exsiting configuration
		this.constant.prototype.config_ = super.configInject(this.config()).bind(this);
		this.config = this.constant.prototype.config_;
	}

	// -- public methods
	get () {
		return this.config();
	}
}
