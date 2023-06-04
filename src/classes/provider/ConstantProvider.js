import CommonProviders from "./CommonProviders.js";

export default class ConstantProvider extends CommonProviders {
	constructor ({ constant, configProps }) {
		super();

		// static
		this.constant = constant;
		this.configProps = configProps;
	}

	passRequired (reservoire, constant) {
		if (this.configProps.require) {
			super.require(this.constant, this.configProps.require, reservoire);
		}
	}
}
