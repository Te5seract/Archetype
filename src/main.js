// js auto-loader
import Archetype from "./classes/Workspace.js";

// helpers
import Helper from "./classes/Helper.js";

// pages
import Home from "./pages/Home.js";
import About from "./pages/About.js";

console.clear();

new Archetype(function () {
  	this.load([
		{scope : Home},
		About
	]).with({
		Helper : /helper|helpers/gi
	});
});