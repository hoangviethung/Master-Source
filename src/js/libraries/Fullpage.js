export default class Fullpage {
	slidesLength;
	container;
	prevEl;
	nextEl;
	navigationsWrapper;
	slides = [];
	titles = [];
	opts = {};
	afterChangeSlide;
	beforeSlideChange;
	state = {
		currentIndex: 0,
		nextIndex: 0,
		canScroll: true,
		scrollDirection: "down",
	};

	constructor(container, opts) {
		this.container = document.querySelector(container);
		this.opts = [].concat(opts)[0];
		this.prevEl = document.querySelector(this.opts.prevEl);
		this.nextEl = document.querySelector(this.opts.nextEl);
		this.slides = Array.from(
			this.container.querySelectorAll(this.opts.slideClass)
		);
		// this.afterChangeSlide = opts.on.afterChangeSlide();
		if (typeof opts.on.afterSlideChange == "function") {
			this.afterSlideChange = opts.on.afterSlideChange;
		}
		if (typeof opts.on.beforeSlideChange == "function") {
			this.beforeSlideChange = opts.on.beforeSlideChange;
		}
		this.slides.forEach((slide) => {
			this.titles.push(slide.getAttribute("fp-title"));
		});
		this.slidesLength = this.slides.length;
		this.init();
	}

	init() {
		for (let i = 0; i < this.slidesLength; i++) {
			this.slides[i].setAttribute("fp-index", i.toString());
			if (i === 0) {
				this.slides[i].classList.add("active");
			}
		}
		this.generateNavigation();
		this.setStateForButtons();
		this.mouseOnScroll();
		this.buttonsOnClick();
		this.autoChangeNavigationOnSlide();
	}

	generateNavigation() {
		if (this.opts.navigation) {
			this.navigationsWrapper = document.createElement("div");
			this.navigationsWrapper.classList.add("fp-navigation");
			let navigationItemsString = "";
			for (let i = 0; i < this.slidesLength; i++) {
				navigationItemsString += `<div class="fp-nav-item" fp-target=${i}><span class="fp-number">${
					i + 1
				}</span><span class="fp-title">${this.titles[i]}</span></div>`;
			}
			this.navigationsWrapper.innerHTML = navigationItemsString;
			this.container.append(this.navigationsWrapper);

			this.navigationsOnClick();
		}
	}

	setStateForButtons() {
		if (this.state.currentIndex >= this.slidesLength - 1) {
			this.nextEl.classList.add("disabled");
		} else {
			this.nextEl.classList.remove("disabled");
		}

		if (this.state.currentIndex <= 0) {
			this.prevEl.classList.add("disabled");
		} else {
			this.prevEl.classList.remove("disabled");
		}
	}

	mouseOnScroll() {
		document.addEventListener("wheel", (e) => {
			if (this.state.canScroll) {
				this.state.canScroll = false;
				if (e.deltaY > 0) {
					if (this.state.nextIndex < this.slidesLength - 1) {
						this.state.nextIndex += 1;
						this.state.scrollDirection = "down";
					}
				} else {
					if (this.state.nextIndex > 0) {
						this.state.nextIndex -= 1;
						this.state.scrollDirection = "up";
					}
				}
				this.changeSlide();
				setTimeout(() => {
					this.state.canScroll = true;
				}, this.opts.speed + 400);
			}
		});
	}

	buttonsOnClick() {
		this.prevEl.addEventListener("click", () => {
			if (this.state.canScroll) {
				this.state.canScroll = false;
				if (this.state.nextIndex > 0) {
					this.state.nextIndex -= 1;
				}
				this.changeSlide();
				setTimeout(() => {
					this.state.canScroll = true;
				}, this.opts.speed + 400);
			}
		});
		this.nextEl.addEventListener("click", () => {
			if (this.state.canScroll) {
				this.state.canScroll = false;
				if (this.state.nextIndex < this.slidesLength - 1) {
					this.state.nextIndex += 1;
				}
				this.changeSlide();
				setTimeout(() => {
					this.state.canScroll = true;
				}, this.opts.speed + 400);
			}
		});
	}

	navigationsOnClick() {
		const navigationItems = Array.from(
			this.navigationsWrapper.querySelectorAll(".fp-nav-item")
		);
		navigationItems.forEach((navItem) => {
			navItem.addEventListener("click", () => {
				if (this.state.canScroll) {
					this.state.canScroll = false;
					const target = navItem.getAttribute("fp-target");
					this.state.nextIndex = Number(target);
					if (this.state.nextIndex > this.state.currentIndex) {
						this.state.scrollDirection = "down";
					} else {
						this.state.scrollDirection = "up";
					}
					this.changeSlide();
					setTimeout(() => {
						this.state.canScroll = true;
					}, this.opts.speed + 400);
				}
			});
		});
	}

	autoChangeNavigationOnSlide() {
		const currentIndex = this.state.currentIndex;
		const navigationItems = Array.from(
			this.navigationsWrapper.querySelectorAll(".fp-nav-item")
		);
		navigationItems.forEach((navItem, navItemIndex) => {
			if (navItemIndex == currentIndex) {
				navItem.classList.add("active");
			} else {
				navItem.classList.remove("active");
			}
		});
	}

	changeSlide() {
		if (this.state.currentIndex != this.state.nextIndex) {
			if (typeof this.beforeSlideChange == "function") {
				this.beforeSlideChange(
					this.slides[this.state.currentIndex],
					this.slides[this.state.nextIndex],
					this.state.currentIndex,
					this.state.nextIndex
				);
			}
			const element = this.slides[this.state.nextIndex];
			const prevElement = this.slides[this.state.currentIndex];
			let start;
			element.classList.add("changing");
			const slide = (timestamp) => {
				if (start === undefined) {
					start = timestamp;
				}
				const elapsed = timestamp - start;

				// `Math.min()` is used here to make sure that the element stops at exactly 200px.
				if (this.state.scrollDirection == "down")
					// slideUp when scroll down
					element.style.transform = `translateY(${
						window.innerHeight -
						Math.min(
							(window.innerHeight / this.opts.speed) * elapsed,
							window.innerHeight
						)
					}px)`;
				else {
					// slideUp down scroll up
					element.style.transform = `translateY(${
						Math.min(
							(window.innerHeight / this.opts.speed) * elapsed,
							window.innerHeight
						) - window.innerHeight
					}px)`;
				}

				if (elapsed < this.opts.speed) {
					window.requestAnimationFrame(slide);
				} else {
					// Stop the animation after 1 seconds
					element.classList.remove("changing");
					element.classList.add("active");
					prevElement.classList.remove("active");
					this.state.currentIndex = this.state.nextIndex;
					this.setStateForButtons();
					this.autoChangeNavigationOnSlide();

					if (typeof this.afterSlideChange == "function") {
						this.afterSlideChange(
							this.slides[this.state.currentIndex],
							this.state.currentIndex
						);
					}
				}
			};
			window.requestAnimationFrame(slide);
		}
	}

	// method
	slideTo(i) {
		this.state.nextIndex = Number(i);
		this.changeSlide();
	}

	getIndex() {
		return this.state.currentIndex;
	}

	scroll(canScroll) {
		this.state.canScroll = canScroll;
	}
}
