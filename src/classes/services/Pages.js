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
		this.route = window.location.pathname;

		// kickoff
		this.#pages();
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
		this.config.read("pages", page);

		this.#matchRoute(page);
	}

	#matchRoute (page) {
		//
	}
}
