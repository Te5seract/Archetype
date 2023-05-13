export default class ArchetypeGlobal {
	constructor (global) {
        this.globals = {};
		this.global = global;

        // functions
        this._global();
	}

    /**
    * gets all globally required scopes and extracts
    * their methods to be injected into the main 
    * page scope
    *
    * @return {void}
    */
    _global () {
		if (!this.global) return;

        const globals = this.global();

        globals.forEach(global => {
            const hasConfig = global.prototype.config_,
                name = hasConfig ? hasConfig().name : global.prototype.constructor.name,
                methods = Object.getOwnPropertyNames(global.prototype).filter(method => !method.match(/config_|constructor/i));

            this.globals[name] = {};

            methods.forEach(method => {
                this.globals[name][method] = global.prototype[method];
            });
        });
    }

	get () {
		return this.globals;
	}
}
