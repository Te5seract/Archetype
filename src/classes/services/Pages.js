/**
* reads and executes a page
*
* @namespace Services
 */
export default class Pages {
	constructor ({ pages, config, provider }) {
		// instances
		this.config = config;
		this.provider = provider;

		// static
		this.pages = pages;
        this.currentRoute = window.location.pathname;

        //dynamic
        this.match = false;
        this.queries = {};

		// kickoff
		this.#pages();

        if (this.page && this.match) {
            this.provider.page(this.page, this.config.get());
        }
	}

	/**
	* gets the pages method from the extended
	* archetype class and sets the watch
	* method as a callback
	*
	* @return {void}
	 */
	#pages () {
		this.pages(this.#watch.bind(this));
	}

	/**
	* watches each page and its component pages
	*
	* @param {object} page
	* the page class to watch
	*
	* @return {void}
	 */
	#watch (page, components) {
        if (this.match) return;

		this.config.read("pages", page);

		this.#matchRoute(page);
	}

    /**
    * directs to the appropriate route 
    * matching methods 
    *
    * @param {object} page
    * the page class to perform a route match on
    *
    * @return {void}
     */
	#matchRoute (page) {
        const { route } = this.config.get();

        this.pageRoute = route;

        route.forEach(url => {
            // simple matches
            if (!url.match(/{.*}/g)) {
                this.#simpleMatch(page);

                return;
            }

            this.#complexMatch(page);
        });
	}

    /**
    * performs a simple route match for routes
    * that do not have placeholder slugs
    *
    * @param {object} page
    * the current watched page
    *
    * @return {void}
     */
    #simpleMatch (page) {
        if (this.pageRoute.indexOf(this.currentRoute) !== -1) {
            this.page = page;
            this.match = true;
        }
    }

    /**
    * performs a complex route match if there
    * are placeholder slugs in the url
    *
    * @param {object} page
    * the page class
    *
    * @return {void}
     */
    #complexMatch (page) {
        const current = this.currentRoute.split("/");

        this.pageRoute.forEach(route => {
            const pageRoute = route.split("/"),
                rebuild = [],
                queries = {};

            if (pageRoute.length !== current.length) return;

            pageRoute.forEach((slug, i) => {
                if (slug.match(/{.*}/)) {
                    rebuild.push(current[i]);

                    queries[slug.replace(/{|}/g, "")] = current[i];

                    return;
                }

                rebuild.push(slug);
            });

            if (rebuild.join("/") === this.currentRoute) {
                this.page = page;
                this.queries = queries;
                this.match = true;
            }
        });
    }
}
