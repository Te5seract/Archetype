import CommonConfig from "./CommonConfig.js";

/**
* @namespace Config
*
* author
*/
export default class GlobalConfig extends CommonConfig {
	constructor (global) {
		super();

		this.global = global;
		this.config = this.global.prototype.config_ ? this.global.prototype.config_ : this.global.config_;
		this.name = super.name(this.global);

		/**
		* this is required for the super class
		* method configInject()
		*/
		this.$inject = {
			name : this.name,
			type : "global"
		};

		// kickoff
		this.#hasConfig();
	}

	// -- protected methods
	#hasConfig () {
		if (!this.config || !this.config()) {
			this.global.prototype.config_ = super.configInject.bind(this);
			this.config = this.global.prototype.config_;

			return;
		}

		// retain exsiting configuration
		this.global.prototype.config_ = super.configInject(this.config()).bind(this);
		this.config = this.global.prototype.config_;
	}

	// -- public methods
	get () {
		if (this.config) return this.config();
	}
}
