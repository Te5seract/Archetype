import ArchetypeErrors from "./ArchetypeErrors.js";
import ArchetypeDOM from "./ArchetypeDOM.js";

// main scripts
import ArchetypeComponents from "./ArchetypeComponents.js";

// helpers
import ArchetypeHelpers from "./ArchetypeHelpers.js";

export default class ArchetypePages extends ArchetypeHelpers {
	constructor ({ pages, globals, root }) {
		super();

		// static
		this.globals = globals;
		this.root = root;

		// dynamic
        this.import = {};
        this.page = null;
		this.pages = pages;

		// functions
		this._pages();

        if (this.page) {
            this._imports();

            ArchetypePages._execute(this.page, this.root);
        }
	}

    /**
    * gets the correct page script and prepares
    * it for instantiation
    *
    * @return {void}
    */
    _pages () {
        const page = this.pages(ArchetypePages._watchPage).filter(Boolean)[0];

        if (!page) return;

        this.page = page;
    }

    /**
    * this method is only visible to the "page" method
    *
    * @param {object} page
    * the page class to evaluate
    *
    * @return {void}
    */
    static _watchPage (page, ...components) {
        if (!ArchetypePages.prototype._matchRoute(page)) return false;

		const comp = new ArchetypeComponents(...components),
			componentObj = comp.get(),
			componentList = Object.keys(comp.get());

		componentList.forEach(component => {
			page.prototype[component] = componentObj[component];
		});


		ArchetypePages.prototype["components"] = componentObj;

        return page;
    }

    /**
    * finds a match for the page class' route
    *
    * @param {object} page
    * the page to check the route(s) for
    *
    * @return {bool}
    */
    _matchRoute (page) {
        const errors = new ArchetypeErrors(),
            name = page.prototype.constructor.name;

        if (!page.prototype["config_"]) throw Error(errors.get("page", "noconfig", name));
        if (!page.prototype.config_().route) throw Error(errors.get("page", "noroute", name));

		const location = window.location.pathname,
            { routes, params } = ArchetypePages._routeInfo(page, location);

        if (routes.indexOf(location) !== -1) {
            page.prototype.route_ = () => params;
            return true;
        }

        return false;
    }

    /**
    * builds the route strings by putting
    * together placeholders from the main
    * URL and including query place holder
    * key value pairs
    *
    * @param {object} page
    * the page class itself
    *
    * @paraam {string} location
    * the URL's current location
    *
    * @return {object}
    */
    static _routeInfo (page, location) {
        const routes = page.prototype.config_().route,
            locationSplit = location.split(/\//g).filter(Boolean),
			locationFullSplit = location.split(""),
			locationEnd = locationFullSplit[locationFullSplit.length - 1],
            builtQueries = [],
            params = {},
			end = locationEnd.match(/\//) ? "/" : "";

        routes.forEach(route => {
            const slugs = route.split(/\//g).filter(Boolean);

            let query = [];

            slugs.forEach((slug, i) => {
                if (slug.match(/{\w+}/)) {
                    query.push(locationSplit[i]);
                    params[slug.replace(/({|})/g, "")] = locationSplit[i - 1];

                    return;
                }

                query.push(slug);
            });

			const queryBuilt = query.join("/");

			if (!queryBuilt || queryBuilt.match(/.*\.[a-zA-Z]/)) {
				builtQueries.push("/" + queryBuilt);
			} 
			else if (queryBuilt && !queryBuilt.match(/.*\.[a-zA-Z]/)) {
				builtQueries.push("/" + queryBuilt + end);
			}
        });

        return {
            routes : builtQueries,
            params : params
        };
    }

    /**
    * binds imports to the matched page class
    *
    * @return {void}
    */
    _imports () {
        const imports = this.page.prototype.config_().import;

        if (!this.page.prototype.config_().import) return;

        imports.forEach(imp => {
            if (this.globals[imp]) this.page.prototype[imp] = this.globals[imp];
        });
    }

	/**
	* executes the current page route
	*
	* @param {object} page
	* the page class to execute
	*
	* @param {function} root
	* the root function defined in the entrypoint script file,
	* eg: root () {}
	*
	* @return {void}
	*/
    static _execute (page, root) {
        const methods = Object.getOwnPropertyNames(page.prototype).filter(method => method.match(/\$[^_|$]\w+/g)),
			components = Object.keys(ArchetypePages.prototype.components),
            instance = new page();

		if (components.length) {
			components.forEach(component => {
				const componentObj = ArchetypePages.prototype.components,
					methods = Object.getOwnPropertyNames(componentObj[component]).filter(method => method.match(/\$[^_|$]\w+/g));

				ArchetypePages._executeIIFE(componentObj[component]);
			});
		}

		ArchetypePages._executeIIFE(page);

		const dom = new ArchetypeDOM(instance);

		dom.root(root);
    }
}
