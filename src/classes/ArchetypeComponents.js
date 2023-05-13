export default class ArchetypeComponents {
	constructor (...components) {
		// static
		this.components = components;

		// dynamic
		this.setComponents = {};

		// functions
		this.#set();
		this.#sharing();
	}

	#set () {
		this.components.forEach(component => {
			const config = component.prototype.config_;

			if (config && config().name) {
				const sharing = config().shareWith,
					methods = Object.getOwnPropertyNames(component.prototype).filter(prop => !prop.match(/constructor|config_/));

				this.setComponents[config().name] = {};

				methods.forEach(method => {
					this.setComponents[config().name][method] = component.prototype[method];

					if (sharing) this.setComponents[config().name]["shareWith"] = sharing;
				});
			}
		});
	}

	#sharing () {
		const components = Object.keys(this.setComponents);

		components.forEach(subject => {
			if (this.setComponents[subject].shareWith) {
				this.setComponents[subject].shareWith.forEach(destination => {
					const subjectMethods = Object.keys(this.setComponents[subject]).filter(method => !method.match(/shareWith/));

					subjectMethods.forEach(method => {
						this.setComponents[destination][subject] = this.setComponents[subject];
					});
				});

				delete this.setComponents[subject].shareWith;
			}
		});
	}

	get () {
		return this.setComponents;
	}
}
