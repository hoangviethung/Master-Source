import {
	src,
	dest
} from 'gulp'

const copyDownloads = () => {
	return src(['src/downloads/**.pdf']).pipe(dest('_dist/downloads'))
}

module.exports = {
	copyDownloads,
}