import { src, dest } from 'gulp'

const fakeAPITask = () => {
	return src(['src/api/**.html', 'src/api/**.json']).pipe(dest('_dist/api'))
}

module.exports = {
	fakeAPITask,
}
