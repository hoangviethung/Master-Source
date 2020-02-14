module.exports = class Tab {
	options = {};

	constructor(selector, obj) {
		this.selector = document.querySelector(selector);
		if (this.selector) {
			this.navigationItems = Array.from(this.selector.querySelectorAll("[toggle-for]"));
			this.contentList = Array.from(this.selector.querySelectorAll("[tab-id]"));
			// this.navigationList = this.selector.querySelector(obj.navigationList);
			// this.breakpoint = obj.responsive.breakpoint;
			// this.isResponsive = obj.responsive.isResponsive;
			this.init();
		}
	}

	changeTabWhenClicked() {
		this.navigationItems.forEach((element, index) => {
			element.addEventListener("click", e => {
				e.preventDefault();
				const tabTarget = element.attributes["toggle-for"].value;
				const targetDOM = Array.from(this.selector.querySelectorAll(`[tab-id='${tabTarget}']`));
				this.navigationItems.forEach((eleClicked, eleClickedIndex) => {
					if (eleClickedIndex != index) {
						eleClicked.classList.remove("active")
					}
				});
				this.contentList.forEach(tabContentElement => {
					if (tabContentElement.attributes["tab-id"].value != tabTarget) {
						tabContentElement.style.display = "none"
						tabContentElement.classList.remove("show")
					}
				});
				element.classList.add("active");
				targetDOM.forEach(item => {
					item.style.display = "block";
				})
				setTimeout(() => {
					targetDOM.forEach(item => {
						item.classList.add("show");
					})
				}, 50);
			})
		})
	}

	activeFirstTab() {
		try {
			this.navigationItems[0].click();
		} catch (error) {
			throw error
		}
	}

	init() {
		this.changeTabWhenClicked();
		this.activeFirstTab();
	}
}