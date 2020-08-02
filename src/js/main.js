import { getSVGs, Loading } from "./utilities/util";
import Fullpage from "./libraries/Fullpage";

document.addEventListener("DOMContentLoaded", () => {
	getSVGs();
	Loading();
	// create instance fullpage
	const fp = new Fullpage(".fp-container", {
		prevEl: ".fp-prev",
		nextEl: ".fp-next",
		speed: 800,
		slideClass: ".fp-slide",
		navigation: true,
		on: {
			// event is fired before slide start transition
			beforeSlideChange: function (currentSlide, nextSlide, currentIndex, nextIndex) {
				console.log(currentSlide, nextSlide, currentIndex, nextIndex);
			},
			// event is fired after slide end transition
			afterSlideChange: function (currentSlide, currentIndex) {
				console.log(currentSlide, currentIndex);
			},
		},
	});

	// method get current index of fullpage
	fp.getIndex();
	// method allow or not allow scroll to slide fullpage: true = allow, false = not allow
	fp.scroll(true);
});
