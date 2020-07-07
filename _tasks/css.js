import { src, dest } from 'gulp'
import sass from 'gulp-sass'
import rename from 'gulp-rename'
import Fiber from 'fibers'
import postcss from 'gulp-postcss'
import clean from 'gulp-clean-css'
import autoprefixer from 'autoprefixer'
import sourcemap from 'gulp-sourcemaps'
import cssSort from 'css-declaration-sorter'

const cssTask = () => {
	return src(['src/scss/**.scss', '!src/scss/_*.scss'])
		.pipe(sourcemap.init())
		.pipe(
			sass({
				sync: true,
				fiber: Fiber,
			}).on('error', sass.logError)
		)
		.pipe(
			postcss([
				autoprefixer({
					cascade: false,
				}),
				cssSort({
					order: 'smacss',
				}),
			])
		)
		.pipe(
			clean({
				compatibility: 'ie8',
			})
		)
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(sourcemap.write('.'))
		.pipe(dest('_dist/css'))
}

module.exports = {
	cssTask,
}
