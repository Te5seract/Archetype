import "../archetype.min.js";

// pages
import Home from "./pages/Home.js";
import About from "./pages/About.js";

export default class Main extends Archetype {
    pages (watch) {
        watch(Home);
        watch(About);
    }

    components (watch) {}
}

const main = new Main();
