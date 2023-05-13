// main scripts
import ArchetypePages from "./ArchetypePages.js";
import ArchetypeGlobal from "./ArchetypeGlobal.js";
import ArchetypePersistent from "./ArchetypePersistent.js";

export default class Archetype {
    constructor () {
        // core object
        this.core = {};

		// instances
		this.persist = new ArchetypePersistent(this.persist);

		this.globals = new ArchetypeGlobal(this.gobal);

		this.pages = new ArchetypePages({ 
			pages : this.pages, 
			globals : this.globals.get(),
			root : this.root
		});
    }
}

window.Archetype = Archetype;
