import { src, dest } from 'gulp'
import { readFileSync } from 'graceful-fs'

const copyFavicon = () => {
	return src('favicon.ico').pipe(dest('_dist'))
}

const copyAssets = () => {
	return src('src/assets/**/**.{svg,png,jpg,jpeg,gif,mp4}').pipe(
		dest('_dist/assets')
	)
}

const copyFonts = () => {
	let vendors = JSON.parse(readFileSync('_vendors.json'))
	let fonts = vendors.fonts
	return src(fonts, {
		allowEmpty: true,
	}).pipe(dest('_dist/fonts'))
}

module.exports = {
	copyFavicon,
	copyAssets,
	copyFonts,
}
