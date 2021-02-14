import { src, dest } from 'gulp';
import { readVendors } from '../utils/vendors';

export const copyFavicon = () => {
	return src('public/favicon.ico').pipe(dest('_dist'));
};

export const copyImages = () => {
	return src('public/images/**.{jpg,png,svg,gif,jpeg,webp,ico}').pipe(
		dest('_dist'),
	);
};

export const copyFonts = () => {
	return new Promise((resolve, reject) => {
		const fonts = JSON.parse(readVendors('./vendors.json')).fonts;
		if (fonts.length > 0) {
			src(fonts, {
				allowEmpty: true,
			}).pipe(dest('_dist/fonts'));
		} else {
			console.log('Không có đường dẫn fonts để copy');
		}
		resolve();
	});
};

export const copyPublic = () => {
	return src('public/**', {
		allowEmpty: true,
	}).pipe(dest('_dist'));
};
