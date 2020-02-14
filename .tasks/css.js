import {
	src,
	dest,
} from 'gulp';
import sass from 'gulp-sass';
import rename from 'gulp-rename';
import wait from "gulp-wait";
import Fiber from "fibers";
import postcss from 'gulp-postcss';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'autoprefixer';
import sourcemap from 'gulp-sourcemaps';
import cssSort from 'css-declaration-sorter';

const cssTask = () => {
	return src([
			'src/scss/**.scss',
			'!src/scss/\_*.scss'
		])
		.pipe(wait(400))
		.pipe(sourcemap.init())
		.pipe(sass({
			sync: true,
			fiber: Fiber,
		}).on('error', sass.logError))
		.pipe(postcss([
			autoprefixer({
				cascade: false,
			}),
			cssSort({
				order: 'concentric-css',
			}),
		]))
		.pipe(cleanCSS({
			compatibility: 'ie9'
		}))
		.pipe(rename({
			suffix: '.min',
		}))
		.pipe(sourcemap.write('.'))
		.pipe(dest('_dist/css'))
};

module.exports = {
	cssTask
};