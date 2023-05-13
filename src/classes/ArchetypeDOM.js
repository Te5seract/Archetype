export default class ArchetypeDOM {
	constructor (page) {
		this.page = page;
	}

	root (root) {
		if (!root) return;
		if (!this.page._render) return;

		const domRoot = document.querySelector(root());

		domRoot.innerHTML = this.page._render();
	}
}
