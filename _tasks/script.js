import { src, dest } from 'gulp';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import uglifyES from 'gulp-uglify-es';
import browserify from 'browserify';
import sourcemap from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';

const jsTask = () => {
	return browserify({
		basedir: '.',
		entries: ['src/js/main.js'],
		debug: true,
		sourceMaps: true,
	})
		.transform(
			babelify.configure({
				presets: ['@babel/preset-env'],
				plugins: [
					'@babel/plugin-proposal-class-properties',
					'@babel/plugin-transform-classes',
					'@babel/plugin-transform-async-to-generator',
				],
				extensions: ['.js'],
			})
		)
		.bundle()
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(sourcemap.init({ loadMaps: true }))
		.pipe(
			plumber(function (err) {
				console.log(err);
				this.emit('end');
			})
		)
		.pipe(uglifyES())
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(sourcemap.write('.'))
		.pipe(dest('_dist/js'));
};

const jsTask2 = () => {
	return src(['src/js/**.js', '!src/js/main.js'])
		.pipe(
			plumber(function (err) {
				console.log(err);
				this.emit('end');
			})
		)
		.pipe(sourcemap.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(sourcemap.write('.'))
		.pipe(dest('_dist/js'));
};

module.exports = {
	jsTask,
	jsTask2,
};
