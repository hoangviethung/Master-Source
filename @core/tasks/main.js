import { isProduction } from '../utils/helpers';
import { src, dest, series } from 'gulp';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import Fiber from 'fibers';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import plumber from 'gulp-plumber';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
const terser = require('gulp-terser');

export const cssTask = () => {
	return new Promise((resolve, reject) => {
		src(['./app/styles/**.scss', '!app/styles/_*.scss'])
			.pipe(gulpif(!isProduction(), sourcemaps.init()))
			.pipe(sass({ fiber: Fiber }).on('error', sass.logError))
			.pipe(
				gulpif(
					isProduction(),
					cleanCss({
						level: {
							1: {
								all: true,
								normalizeUrls: false,
								specialComments: false,
							},
							2: {
								restructureRules: true,
							},
						},
					}),
				),
			)
			.pipe(postcss([autoprefixer({ cascade: false })]))
			.pipe(gulpif(isProduction(), postcss([cssnano()])))
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulpif(!isProduction(), sourcemaps.write('.')))
			.pipe(dest('./_dist/css'));
		resolve();
	});
};

export const jsTask = () => {
	return browserify({
		basedir: '.',
		entries: ['./app/scripts/main.js'],
		debug: true,
		sourceMaps: true,
	})
		.transform(
			babelify.configure({
				presets: ['@babel/preset-env'],
				plugins: [
					'@babel/plugin-proposal-class-properties',
					'@babel/plugin-transform-async-to-generator',
				],
				extensions: ['.js'],
			}),
		)
		.bundle()
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(
			plumber(function (err) {
				console.log(err);
				this.emit('end');
			}),
		)
		.pipe(gulpif(!isProduction(), sourcemaps.init({ loadMaps: true })))
		.pipe(gulpif(isProduction(), terser()))
		.pipe(
			rename({
				suffix: '.min',
			}),
		)
		.pipe(gulpif(!isProduction(), sourcemaps.write('./')))
		.pipe(dest('_dist/js'));
};

export const main = series(cssTask, jsTask);
