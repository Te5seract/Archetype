import ArchetypeErrors from "./ArchetypeErrors.js";

export default class Archetype {
    constructor () {
        // core object
        this.core = {};

        // dynamic
        this.routes = {};
        this.globals = {};
        this.import = {};
        this.page = null;
        
        // functions
        this._pages();
        this._global();

        if (this.page) {
            this._imports();

            Archetype._execute(this.page);
        }
    }

    /**
    * gets the correct page script and prepares
    * it for instantiation
    *
    * @return {void}
    */
    _pages () {
        const page = this.pages(Archetype._watchPage.bind(this)).filter(Boolean)[0];

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
    static _watchPage (page) {
        if (!this._matchRoute(page)) return false;

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

        //const location = window.location.pathname,
        const location = "/home/123",
            { routes, params } = Archetype._routeInfo(page, location);

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
            builtQueries = [],
            params = {};

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

            builtQueries.push("/" + query.join("/"));
        });

        return {
            routes : builtQueries,
            params : params
        };
    }

    /**
    * gets all globally required scopes and extracts
    * their methods to be injected into the main 
    * page scope
    *
    * @return {void}
    */
    _global () {
        const globals = this.global();

        globals.forEach(global => {
            const hasConfig = global.prototype.config_(),
                name = hasConfig ? hasConfig.name : global.prototype.constructor.name,
                methods = Object.getOwnPropertyNames(global.prototype).filter(method => !method.match(/config_|constructor/i));

            this.globals[name] = {};

            methods.forEach(method => {
                this.globals[name][method] = global.prototype[method];
            });
        });
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

    static _execute (page) {
        const methods = Object.getOwnPropertyNames(page.prototype).filter(method => method.match(/\$[^_|$]\w+/g)),
            instance = new page();

        methods.forEach(method => {
            instance[method]();
        });
    }
}
