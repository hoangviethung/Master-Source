export const getSVGs = (selector) => {
	const images =
		Array.from(document.querySelectorAll(selector)) ||
		Array.from(document.querySelectorAll("img.svg"));
	for (let i = 0; i < images.length; i++) {
		const url =
			images[i].getAttribute("src") || images[i].getAttribute("data-src");
		const getImageRequest = new XMLHttpRequest();
		getImageRequest.open("GET", url, true);
		getImageRequest.onload = function (e) {
			images[i].outerHTML = e.target.response;
		};
		getImageRequest.send();
	}
};

export const Loading = () => {
	let loading = document.querySelector("#loading-container");
	let images = document.images;
	let imagesLength = images.length;
	let counter = 0;

	function turnOffLoadingScreen() {
		loading.style.opacity = "0";
		setTimeout(function () {
			loading.parentNode.removeChild(loading);
			document.querySelector("body").classList.add("show-page");
			if (typeof cb == "function") cb();
		}, 500);
	}

	function progressing() {
		counter += 1;
		let progressBar = loading.querySelector("#progress-bar");
		let progressPercentage = loading.querySelector("#progress-percentage");
		let n = Math.round((100 / imagesLength) * counter);

		if (progressBar) {
			progressBar.style.width = `${n}%`;
		}
		if (progressPercentage) {
			progressPercentage.innerHTML = `${n}`;
		}
		if (counter === imagesLength) {
			return turnOffLoadingScreen();
		}
	}
	if (loading) {
		if (imagesLength === 0) {
			return turnOffLoadingScreen();
		} else {
			for (let i = 0; i < imagesLength; i++) {
				let img = new Image();
				img.onload = progressing;
				img.onerror = progressing;
				img.src = images[i].src;
			}
		}
	}
};
