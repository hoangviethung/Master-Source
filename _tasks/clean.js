import del from 'del'

const cleanDist = () => {
	return del('_dist')
}

const cleanAssets = () => {
	return del('_dist/Content/resources/assets')
}

module.exports = {
	cleanDist,
	cleanAssets,
}
