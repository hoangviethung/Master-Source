import { readVendors } from '../utils/vendors';
import { src, dest, series } from 'gulp';
import concat from 'gulp-concat';
import cleanCss from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import strip from 'gulp-strip-comments';

export const cssCore = () => {
	return new Promise((resolve, reject) => {
		const css = JSON.parse(readVendors('./vendors.json')).css;
		if (css.length > 0) {
			console.log(css);
			src(css, {
				allowEmpty: true,
			})
				.pipe(concat('core.min.css'))
				.pipe(
					cleanCss({
						level: {
							1: {
								all: true,
								normalizeUrls: false,
								specialComments: false,
							},
						},
					}),
				)
				.pipe(dest('./_dist/css'));
		} else {
			console.log('Không có đường dẫn thư viện css để copy');
		}
		resolve();
	});
};

export const jsCore = () => {
	return new Promise((resolve, reject) => {
		const js = JSON.parse(readVendors('./vendors.json')).js;
		if (js.length > 0) {
			console.log(js);
			src(js, {
				allowEmpty: true,
			})
				.pipe(concat('core.min.js'))
				.pipe(strip())
				.pipe(uglify())
				.pipe(dest('./_dist/js'));
		} else {
			console.log('Không có đường dẫn thư viện js để copy');
		}
		resolve();
	});
};

export const core = series(cssCore, jsCore);
