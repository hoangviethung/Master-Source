import {
	series,
	parallel
} from "gulp";

// Import tasks
import {
	server
} from "./_tasks/server";
import {
	jsTask,
	jsTask2
} from "./_tasks/script";
import {
	pugTask
} from "./_tasks/html";
import {
	cssTask
} from "./_tasks/css";
import {
	jsCore
} from "./_tasks/core-js";
import {
	cssCore
} from "./_tasks/core-css";
import {
	cleanDist
} from "./_tasks/clean";
import {
	copyFavicon,
	copyFonts,
	copyAssets
} from "./_tasks/copy";


exports.default = series(
	cleanDist,
	parallel(
		copyFavicon,
		copyFonts,
		copyAssets,
	),
	parallel(
		cssCore,
		jsCore,
	),
	parallel(
		cssTask,
		jsTask,
		jsTask2,
	),
	pugTask,
	server,
);