module.exports = () => {
	return new Promise((resolve, reject) => {
		let loading = document.getElementById("loading-container");
		let progressPercentage = loading.querySelector("#progress-percentage");
		let progressBar = loading.querySelector("#progress-bar");
		let images = document.images;
		let imagesLength = images.length;
		let counter = 0;

		const turnOffLoadingScreen = () => {
			if (loading) {
				loading.style.opacity = "0";
				setTimeout(function() {
					loading.parentNode.removeChild(loading);
					document.querySelector("body").classList.add("show-page");
					resolve();
				}, 1000);
			}
		};

		const progressing = () => {
			let n = Math.round(100 / imagesLength * (counter += 1));
			progressBar.style.width = `${n}%`;
			progressPercentage.innerHTML = `${n}`;
			if (counter === imagesLength) {
				return turnOffLoadingScreen();
			}
		};

		if (loading) {
			if (imagesLength === 0) {
				return turnOffLoadingScreen();
			} else {
				for (let i = 0; i < imagesLength; i++) {
					let img = new Image;
					img.onload = progressing;
					img.onerror = progressing;
					img.src = images[i].src;
				}
			}
		}
	});
};