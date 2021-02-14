import { src, dest, series } from 'gulp';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';

export const renderHTML = (glob) => {
	return src(glob)
		.pipe(
			plumber(function (err) {
				console.log(err);
				this.emit('end');
			}),
		)
		.pipe(
			pug({
				pretty: '\t',
			}),
		)
		.pipe(dest('_dist'));
};

export const html = () => {
	return renderHTML('./app/**.pug');
};

export const render = series(html);
