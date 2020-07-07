import { src, dest } from 'gulp'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'
import strip from 'gulp-strip-comments'
import sourcemap from 'gulp-sourcemaps'
import { readFileSync } from 'graceful-fs'

const jsCore = () => {
	let vendors = JSON.parse(readFileSync('_vendors.json'))
	let jsVendors = vendors.js
	return src(jsVendors, {
		allowEmpty: true,
	})
		.pipe(sourcemap.init())
		.pipe(concat('core.min.js'))
		.pipe(strip())
		.pipe(uglify())
		.pipe(sourcemap.write('.'))
		.pipe(dest('_dist/js'))
}

module.exports = {
	jsCore,
}
