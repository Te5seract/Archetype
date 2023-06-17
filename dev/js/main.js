import "../archetype.min.js";

// env
import env from "./templates/dialogues.json" assert { type : "json" };

// pages
import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Documentation from "./pages/Documentation.js";

// components
import Banner from "./components/Banner.js";
import Cards from "./components/Cards.js";

// constants
import Navigation from "./constants/Navigation.js";
import Observer from "./constants/Observer.js";

// globals
import Helper from "./helpers/Helper.js";

export default class Main extends Archetype {
	//constant (watch) {
		//watch(Navigation);
		//watch(Observer);
	//}

	//globals (watch) {
		//watch(Helper);
	//}

    pages (watch) {
        watch(Home, Banner, Cards);
        watch(About);
		watch(Documentation);
    }

	env (set) {
		set("config", env);
	}
}

const main = new Main();
