module.exports = () => {
	const setCookie = (name, value, days) => {
		let expires = '';
		if (days) {
			let date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = '; expires=' + date.toUTCString();
		}
		document.cookie = name + '=' + (value || '') + expires + '; path=/';
	};
	const getCookie = (name) => {
		let nameEQ = name + '=';
		let ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0)
				return c.substring(nameEQ.length, c.length);
		}
		return null;
	};

	const getInfoFromUrl = () => {
		let urlString = window.location.href;
		let url = new URL(urlString);

		let Source = url.searchParams.get('utm_source');
		let Medium = url.searchParams.get('utm_medium');
		let Campaign = url.searchParams.get('utm_campaign');
		let Term = url.searchParams.get('utm_term');
		let UTMContent = url.searchParams.get('tm_content');
		let fbclid = url.searchParams.get('fbclid');
		let gclid = url.searchParams.get('gclid');
		let Social, SocialId;

		if (fbclid) {
			Social = 'fbclid';
			SocialId = fbclid;
		} else if (gclid) {
			Social = 'gclid';
			SocialId = gclid;
		} else {
			Social = null;
			SocialId = null;
		}
		if (
			Source ||
			Medium ||
			Campaign ||
			Term ||
			UTMContent ||
			fbclid ||
			gclid ||
			Social ||
			SocialId
		) {
			return {
				Source: Source,
				Medium: Medium,
				Campaign: Campaign,
				Term: Term,
				UTMContent: UTMContent,
				Social: Social,
				SocialId: SocialId,
			};
		} else {
			return false;
		}
	};

	const convertInformationToB64 = (param) => {
		return window.btoa(JSON.stringify(param));
	};

	if (!getCookie('utm') && getInfoFromUrl()) {
		setCookie('utm', convertInformationToB64(getInfoFromUrl()), 1);
	}
};
