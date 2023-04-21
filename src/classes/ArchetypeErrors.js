export default class ArchetypeErrors {
    constructor () {
        this.errors = {
            page : {
                noconfig : (name) => {
                    if (!name) throw Error(`A noconfig error must include a name param of the scope the error occurs in, eg: errors.get("page", "noconfig", scope.prototype.constructor.name)`);
                    return `The page scope "${ name }" does not have a config_ method. A config_ method is used to return the page's route as a property.`;
                },
                noroute : (name) => {
                    if (!name) throw Error(`A noconfig error must include a name param of the scope the error occurs in, eg: errors.get("page", "noroute", scope.prototype.constructor.name)`);
                    return `The page "${ name }" config_ method does not have a route param. A route param is required for page classes.`;
                }
            }
        };
    }

    get (type, prop, ...dynamic) {
        if (!this.errors[type]) throw Error(`${ type } does not exist, error types include the following: ${ Object.keys(this.errors) }`);
        if (!this.errors[type][prop]) throw Error(`${ type } does not include ${ prop }, ${ type } includes the following: ${ Object.keys(this.errors[type][prop]) }`);

        return this.errors[type][prop](...dynamic);
    }
}
