import PageProvider from "./PageProvider.js";

export default class Provider {
    page (page, config) {
        const pageProvider = new PageProvider(page, config);
    }
}
