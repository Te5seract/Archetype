import "../archetype.min.js";

// pages
import Home from "./pages/Home.js";
import About from "./pages/About.js";

// components
import Banner from "./components/Banner.js";
import Cards from "./components/Cards.js";

// constants
import Navigation from "./constants/Navigation.js";
import Observer from "./constants/Observer.js";

export default class Main extends Archetype {
	constant (watch) {
		watch(Navigation);
		watch(Observer);
	}

	globals () {}

    pages (watch) {
        watch(Home, Banner, Cards);
        watch(About);
    }
}

const main = new Main();
