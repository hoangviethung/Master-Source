module.exports = class Fullpage {

	opts = {
		section: '.section',
		speed: 1000,
		sectionClass: null,
	}

	constructor(selector, opts) {
		Object.keys(opts).map(key => {
			this.opts[key] = opts[key]
		});
		this.$el = document.querySelector(selector);
		this.$section = document.querySelectorAll(this.$el, this.opts.section);
	}

	renderHTML() {
		let fpWrapperHTML = '';
		let fpNavigationHTML = '';

		this.$section.forEach(section => {
			newHTML += `<div class="fp-section">${section.outerHTML}</div>`
		});
		this.$el.innerHTML = `<div class="fp-wrapper">${newHTML}</div><div class="fp-navigation"></div>`;
	}

	init() {
		this.renderHTML();
	}
}