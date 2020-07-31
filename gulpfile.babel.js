import { series, parallel } from 'gulp'

// Import tasks
import { cleanDist } from './_tasks/clean'
import { copyFavicon, copyFonts, copyAssets } from './_tasks/copy'
import { copyDownloads } from './_tasks/copy-downloads'
import { fakeAPITask } from './_tasks/api'
import { jsTask, jsTask2 } from './_tasks/script'
import { cssCore } from './_tasks/core-css'
import { jsCore } from './_tasks/core-js'
import { cssTask } from './_tasks/css'
import { htmlTask } from './_tasks/html'
import { server } from './_tasks/server'

exports.default = series(
	cleanDist,
	parallel(copyFavicon, copyFonts, copyAssets, fakeAPITask, copyDownloads),
	parallel(cssCore, jsCore),
	parallel(cssTask, jsTask, jsTask2),
	htmlTask,
	server
)
