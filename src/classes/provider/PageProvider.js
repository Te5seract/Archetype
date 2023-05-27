export default class PageProvider {
    constructor (page, config) {
        this.page = page;
        this.config = config;
        this.configKeys = Object.keys(this.config).filter(key => key !== "route");

        console.log(this.configKeys);
    }
}
