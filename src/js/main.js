import { getSVGs, Loading } from "./utilities/util";
import Fullpage from "./libraries/Fullpage";

document.addEventListener("DOMContentLoaded", () => {
	getSVGs();
	Loading();

	new Fullpage(".fp-container", {
		prevEl: ".fp-prev",
		nextEl: ".fp-next",
		speed: 5000,
		slideClass: ".fp-slide",
		navigation: true,
		on: {
			afterSlideChange: function (currentSlide, index) {
				console.log(currentSlide, index);
			},
		},
	});
});
