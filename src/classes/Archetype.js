export default class Archetype {
	constructor (callback) {
		this.callback = callback;

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

			list[decoratorNameFilter] = instance[decorator]();
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
	_routeParams (route) {
		if (!route.match(/{.*?}/g)) return route;

		const path = window.location.pathname,
			pathSplit = path.split("/"),
			dynamicSlugs = route.match(/{.*?}/g),
			routeSplit = route.split("/"),
			info = {
				route : route,
				path : path,
				params : {}
			};

		dynamicSlugs.forEach(slug => {
			const index = routeSplit.indexOf(slug),
				slugFiltered = slug.replace(/{|}/g, "");

			routeSplit[index] = pathSplit[index];

			info.params[slugFiltered] = pathSplit[index];
		});

		info.routeProcessed = routeSplit.join("/");
		info.match = path === routeSplit.join("/");

		return info;
	}

	_makeProps (key, value) {
		this[key] = value;
	}

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

					const instance = new instantiator(),
						methods = this._getMethodTypes(Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));

					this._callMethods(instance, methods);
				}

			}
		});

		return this;
	}

	with () {}
}
