import { watch, series, parallel, src, dest } from "gulp";
import del from "del";
import pug from "gulp-pug";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import bSync from "browser-sync";
import plumber from "gulp-plumber";
import sourcemap from "gulp-sourcemaps";
import { fakeAPITask } from "./api";
import { jsCore } from "./core-js";
import { jsTask } from "./script";
import { htmlTask } from "./html";
import { cssCore } from "./core-css";
import { cssTask } from "./css";

const imageChangeTask = (path, stats) => {
	const filePathnameGlob = path.replace(/[\/\\]/g, "/");
	const destPathname = filePathnameGlob
		.replace("src", "_dist")
		.replace(
			filePathnameGlob.split("/")[filePathnameGlob.split("/").length - 1],
			""
		);
	del(filePathnameGlob.replace("src", "_dist"));
	console.log(`Copy: "${filePathnameGlob}"   =====>   "${destPathname}"`);
	return src(filePathnameGlob).pipe(dest(destPathname));
};

const imageRemoveTask = (path, stats) => {
	const filePathnameGlob = path.replace(/[\/\\]/g, "/");
	const destPathname = filePathnameGlob.replace("src", "_dist");
	console.log(`Deleted: "${destPathname}"`);
	return del(destPathname);
};

const server = () => {
	bSync.init({
		notify: true,
		server: {
			baseDir: "_dist",
		},
		port: 8000,
	});
	watch(["src/_templates/_layout/**.pug"], series(htmlTask));

	watch(["src/**.pug"]).on("change", (path, stats) => {
		const pageName = path.split("\\" || "/")[1];
		const filePathnameGlob = path.replace(/[\\\/]/g, "/");
		console.log(`Render file ${pageName}`);

		return src(filePathnameGlob)
			.pipe(
				plumber(function (err) {
					this.emit("end");
				})
			)
			.pipe(
				pug({
					pretty: "\t",
				})
			)
			.pipe(dest("_dist"));
	});

	watch(["src/_templates/**/**.pug", "!src/_templates/_layout/**.pug"]).on(
		"change",
		(path, stats) => {
			const pageName = path.split("\\" || "/")[2];
			const filePathnameGlob = `src/${pageName}.pug`;
			console.log(`Render file ${pageName}.pug`);

			return src(filePathnameGlob)
				.pipe(
					plumber(function (err) {
						this.emit("end");
					})
				)
				.pipe(
					pug({
						pretty: "\t",
					})
				)
				.pipe(dest("_dist"));
		}
	);

	watch(["src/assets/**/**.**"], {
		ignorePermissionErrors: true,
		delay: 300,
		events: "all",
	})
		.on("add", imageChangeTask)
		.on("change", imageChangeTask)
		.on("addDir", imageChangeTask)
		.on("unlink", imageRemoveTask)
		.on("unlinkDir", imageRemoveTask);

	watch(
		["src/js/main.js", "src/js/libraries/**.js", "src/js/utilities/**.js"],
		series(jsTask)
	);

	watch(["src/js/**.js", "!src/js/main.js"]).on("change", (path, stats) => {
		const filePathnameGlob = path.replace(/[\/\\]/g, "/");
		console.log(`Transpile file ${filePathnameGlob}`);
		return src(filePathnameGlob)
			.pipe(
				plumber(function (err) {
					console.log(err);
					this.emit("end");
				})
			)
			.pipe(sourcemap.init())
			.pipe(babel())
			.pipe(uglify())
			.pipe(
				rename({
					suffix: ".min",
				})
			)
			.pipe(sourcemap.write("."))
			.pipe(dest("_dist/js"));
	});

	watch(
		["src/scss/**/**.scss"],
		{
			delay: 500,
		},
		series(cssTask)
	);

	watch(
		["_vendors.json", "vendors/**/**.css", "vendors/**/**.js"],
		parallel(jsCore, cssCore)
	);
	watch(["src/api/**.json", "src/api/**.html"], series(fakeAPITask));

	watch([
		"_dist/**.html",
		"_dist/css/**/**.css",
		"_dist/js/**/**.js",
		"_dist/api/**/**.{json,html}",
	]).on("change", bSync.reload);
};

module.exports = {
	server,
};
