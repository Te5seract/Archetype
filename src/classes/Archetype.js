export default class Archetype {
	constructor (callback) {
		this.callback = callback;

        this.useGlobal = [];

		this.callback ? this.callback() : null;
	}

	// private
	
	/**
	 * gets all methods associated with a class
	 * 
	 * @param {array} methods
	 * list of methods retrieved from the instantiated
	 * page class
	 * 
	 * @return {object}
	 */
	_getMethodTypes (methods) {
		const methodTypes = {
			// any method prefixed with $
			loud : [],

			// any methods prefixed with __
			decorators : [],

			// any methods with no symbolic prefix
			quiet : [],

			// sorts method types into the above categories and deletes itself
			sort : function () {
				methods.filter(method => {
					if (method.match(/\$([a-zA-Z]|\d+)/)) this.loud.push(method);
					else if (method.match(/__.*?/)) this.decorators.push(method);
					else this.quiet.push(method);
				});

				delete this.sort;

				return this;
			}
		};

		return methodTypes.sort();
	}

	/**
	 * calls the methods (based on type) of the
	 * instantiated page class
	 * 
	 * @param {object} instance 
	 * the instantiated page class
	 * 
	 * @param {array} methods 
	 * the methods that belong to the instantiated
	 * page class
	 * 
	 * @return {void}
	 */
	_callMethods (instance, methods) {
		const {loud, decorators} = methods;

		loud.forEach(method => {
			const decoratorsList = {};

			this._pushDecorator(decoratorsList, instance, method, decorators);

			instance[method](decoratorsList);
		});

		return;
	}

	/**
	 * 
	 * @param {object} list 
	 * an object defined to hold a list of decorator
	 * parameters
	 * 
	 * @param {object} instance 
	 * the instantiated page class
	 * 
	 * @param {string} method 
	 * the method in the current method caller loop
	 * check _callMethods() method
	 * 
	 * @param {array} decorators 
	 * the list of decorators for the instantiated
	 * page class
	 * 
	 * @return {void}
	 */
	_pushDecorator (list, instance, method, decorators) {
		method = method.replace(/\$/, "");

		decorators.forEach(decorator => {
			const decoratorNameFilter = this._decoratorName(decorator);

            list[decoratorNameFilter] = instance[decorator];
		});

		return;
	}

	/**
	 * cleans up the decorator name so that it
	 * can be added as a key to an object in the 
	 * _pushDecorator() method
	 * 
	 * @param {string} decorator
	 * the decorator method to filter
	 * 
	 * @return {string}
	 */
	_decoratorName (decorator) {
		const decoratorSplit = decorator.replace(/__/, "").split("_");

		decoratorSplit.forEach((name, i) => {
			if (i > 0) {
				const word = name.split(""),
					firstLetter = word.splice(0, 1);

					decoratorSplit[i] = firstLetter[0].toUpperCase() + word.join("");
			}
		});

		return decoratorSplit.join("");
	}

	/**
	 * checks the current route against the one passed
	 * into this method and validates it.
	 * 
	 * The return value contains the following info:
	 * 
	 * route : the route passed into this method
	 * 
	 * path : the current page path
	 * 
	 * params : any dynamic slugs in the route
	 * 
	 * routeProcessed : the passed in route value with
	 * the placeholder slugs replaced with the correct
	 * values
	 * 
	 * match : a boolean that states if the routes match
	 * 
	 * @param {string} route 
	 * the route to test against the current page
	 * route
	 * 
	 * @return {object}
	 */
	_routeParams (routes) {
        const info = {
            params : {}
        };

        if (!(routes instanceof Array)) routes = [routes];

        for (let i = 0; i < routes.length; i++) {
			if (routes[i]) {
				const path = window.location.pathname,
					pathSplit = path.split("/"),
					dynamicSlugs = routes[i].match(/{.*?}/g),
					routeSplit = routes[i].split("/");

				if (!routes[i].match(/{.*?}/g)) {
					const routeReg = new RegExp(`^${routes[i]}$`);

					//info.match = routes[i] === path;

					if (routes[i] === path) {
						info.match = true;
						return info;
					}
				} else {

					dynamicSlugs.forEach(slug => {
						const index = routeSplit.indexOf(slug),
							slugFiltered = slug.replace(/{|}/g, "");

						routeSplit[index] = pathSplit[index];

						info.params[slugFiltered] = pathSplit[index];
					});

					//info.routeProcessed = routeSplit.join("/");
					//info.match = path === routeSplit.join("/");

					if (path === routeSplit.join("/")) {
						info.match = true;
						info.routeProcessed = routeSplit.join("/");

						return info;
					}

					//route : route,
					//path : path,
				}
			}
        }

        return info;
	}

    /**
     * creates a property that will be stored in
     * the Archetype instance
     *
     * @param {string} key
     * the key to the property stored
     *
     * @param {any} value
     * the value to give the property
     *
     * @return {void}
    */
	_makeProps (key, value) {
		this[key] = value;

        return;
	}

    /**
     * adds properties to a stored property in the
     * Archetype instance
     *
     * @param {string} key
     * the key for the property to target
     *
     * @param {array} ...values
     * a structure of items to add to a stored property
     * the last item being the value, eg:
     *
     * "setProperty", "subProperty", "value"
     *
     * setProperty : {
     *     subProperty : "value"
     * }
     *
     * @return {void}
    */
	_setProps (key, ...values) {
		if (this[key]) {
			let prop = this[key];

			for (let i = 0; i < values.length; i++) {
				if (!prop[values[i]]) {
					if (i + 1 === values.length - 1) {
						prop[values[i]] = values[i + 1];

						break;
					}
					
					prop = prop[values[i]] = {};
				} else {
					prop = prop[values[i]];
				}
			}
		}

        return;
	}

    /**
     * gets a stored value within the Archetype instance
     *
     * @param {string} key
     * the stored value key
     *
     * @param {array} [...dir]
     * where to find the value you're looking for
     *
     * @return {any}
    */
    _getProps (key, ...dir) {
        if (!dir.length) return this[key];

        const start = this[key];

        let prop = this[key];

        dir.forEach(dir => {
            if (prop[dir]) prop = prop[dir];
            else {
                console.error(`_getProps error: ${dir.join(" > ")} in "${start.constructor.name}" was not found: ${start.constructor.name}`, start);
                return;
            }
        });

        return prop;
    }

    /**
     * this enables the ability to share globally used classes
     * with onanother:
     *
     * {
     *    helper : Helper, 
     *    shareWith : [ Helper1, Helper2 ]
     * }
     *
     * @return {void}
    */
    _shareWithInstance () {
        const global = this.useGlobal;

        global.forEach(item => {
            if (item.shareWith) {
                let keys = Object.keys(item);

                const key = keys.filter(key => !key.match(/shareWith/i))[0];

                item.shareWith.forEach(instance => {
                    instance.prototype[key] = item[key];
                });
            }
        });
    }

    /**
     * uses certain components or libraries, if the use_() method
     * within a class module returns some libraries or components
     * those libraries and or components will be merged into the
     * class module
     *
     * @param {object} instantiator
     * the instance of the class having props merged into it
     *
     * @param {object} option
     * the options for this class instance, looking for the "use" key
     *
     * @return {void}
    */
    _use (instantiator, option) {
        const methods = Object.getOwnPropertyNames(instantiator.prototype).join(","),
            method = this._getMethod(instantiator, "use_", "uses_"),
            globalUse = this.useGlobal,
            useInstances = {};

        if (option instanceof Function) {
            option = { scope : option };

            if (!option.use && globalUse.length) {
                option.use = globalUse;
            }
        }

        if (!option.use) {
            option.use = [];
        }

        if (!method) return;

        if (this.useGlobal.length) {
            this.useGlobal.forEach(item => {
                option.use.push(item);
            });
        }

        option.use.forEach(use => {
            for (let key in use) {
                useInstances[key] = use[key];
            }
        });

        const useMethod = instantiator.prototype[method](useInstances);

        if (!useMethod) return;

        useMethod.forEach(ext => {
            // merge all methods from a class
            if (ext.prototype) {
                const extMethods = Object.getOwnPropertyNames(ext.prototype);

                extMethods.forEach(method => {
                    instantiator.prototype[method] = ext.prototype[method];
                });
            } else {
                // merge only a select few methods into the class
                if (ext.methods && ext.scope) {
                    ext.methods.forEach(method => {
                        instantiator.prototype[method] = ext.scope.prototype[method];
                    });
                }
            }
        });

        return;
    }

    /**
     * checks if the instantiated class has a particular action
     * method
     *
     * @param {object} instantiator
     * the class instance to check methods for
     *
     * @param {array} ...methods
     * the methods to match from the class instance
     *
     * @return {boolean|string}
    */
    _getMethod (instantiator, ...methods) {
        const instanceMethods = Object.getOwnPropertyNames(instantiator.prototype),
            instanceMethodsString = instanceMethods.join(","),
            methodsString = methods.join("|"),
            methodReg = new RegExp(methodsString, "gi"),
            match = instanceMethodsString.match(methodReg);

        if (!match) return false;

        return match[0];
    }

    /**
     * sets Archetype methods for the page classes
     *
     * @param {object} instance
     * the page class instance
     *
     * @return {void}
    */
    _setAccessors () {
        this._setProps("instance_proto", "get", (...dir) => {
            return this._getProps("instance_proto", ...dir);
        });

        return;
    }

    /**
     * instantiates all global classes and binds them to the
     * currently instantiated page script
     *
     * @return {void}
    */
    _instantiate () {
        if (!this.instances) return;

        this.instances.forEach(item => {
            const instance = new item(),
                methods = this._getMethodTypes(Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));

            this._setProps("instance_proto", instance.constructor.name, instance);

            this._callMethods(instance, methods);
        });
    }

	// public

	/**
	 * instantiates all classes
	 * 
	 * @param {array} options 
	 * the list of classes to instantiate can contain
	 * objects or the un-instantiated class name:
	 * load([
	 * 	ClassOne,
	 * 	{scope : ClassTwo, require : ["libOne", "libTwo"]}
	 * ])
	 * 
	 * if the option is an object the params are:
	 * 
	 * @param {object} scope
	 * the class to instantiate
	 * 
	 * @param {array} require
	 * the libraries to require specifically for this
	 * page class instance
	 * 
	 * @return {self}
	 */
	load (options) {
		options.forEach(option => {
			const proto = Object.getOwnPropertyNames(option instanceof Function ? option.prototype : option.scope.prototype),
				instantiator = option instanceof Function ? option : option.scope;

			if (proto.indexOf("route_") !== -1) {
				const route = this._routeParams(instantiator.prototype.route_());

				if (route.match) {
					this._makeProps("instance_proto", instantiator.prototype);

					this._setProps("instance_proto", "route", route);

                    this._use(instantiator, option);

                    this._setAccessors(instantiator);

					const instance = new instantiator(),
						methods = this._getMethodTypes(Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));

                    this._instantiate();

					this._callMethods(instance, methods);
				}

			}
		});

		return this;
	}

    /**
     * auto instantiates classes
     *
     * @param array instances
     * the instances to instantiate
     *
     * @return {void}
    */
    instantiate (instances) {
        this._makeProps("instances", instances);
    }

    /**
     * globally applies libraries and components to all
     * page instances
     *
     * @param {array} options
     * what libraries and components to load within objects, eg:
     *
     * {key : name}
    */
    use (options) {
        if (!options.length) return;

        this.useGlobal = options;

        this._shareWithInstance();

        return this;
    }
}

window.Archetype = Archetype;
