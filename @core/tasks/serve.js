import { watch, series, src, dest } from 'gulp';
import bSync from 'browser-sync';
import del from 'del';
import compression from 'compression';
import { copyFonts } from './copy';
import { renderHTML } from './render';
import { cssTask, jsTask } from './main';
import { jsCore, cssCore } from './core';

const imageChangeTask = (path, stats) => {
	const filePathnameGlob = path.replace(/[\/\\]/g, '/');
	const destPathname = filePathnameGlob
		.replace('public', '_dist')
		.replace(
			filePathnameGlob.split('/')[filePathnameGlob.split('/').length - 1],
			'',
		);
	console.log(`Copy: '${filePathnameGlob}'   =====>   '${destPathname}'`);
	return src(filePathnameGlob).pipe(dest(destPathname));
};

const imageRemoveTask = (path, stats) => {
	const filePathnameGlob = path.replace(/[\/\\]/g, '/');
	const destPathname = filePathnameGlob.replace('public', '_dist');
	console.log(`Deleted: '${destPathname}'`);
	return del(destPathname);
};

export const serve = () => {
	bSync.init({
		notify: false,
		// proxy: 'web-dev.local',
		server: {
			baseDir: '_dist',
			middleware: [compression()],
		},
		port: 8000,
	});
	watch('app/views/_**/**.pug').on(
		'change',
		(path, stats) => {
			console.log(`Files changed: '${path}'`);
			console.log(`Rendering: All templates`);
			return renderHTML('./app/**.pug');
		},
	);

	watch(['app/*.pug']).on('change', (path, stats) => {
		console.log(`Files changed: '${path}'`);
		let pageName;
		let glob;
		if (path.indexOf('/') >= 0) {
			pageName = path.split('/')[1];
		} else {
			pageName = path.split('\\')[1];
		}
		if (pageName.indexOf('.pug') >= 0) {
			glob = `app/${pageName}`;
		} else {
			glob = `app/${pageName}.pug`;
		}
		console.log(`Rendering: '${path}'`);
		return renderHTML(glob);
	});

	watch(['app/views/**/**.pug', '!app/views/_**/**.pug']).on(
		'change',
		(path, stats) => {
			console.log(`Files changed: '${path}'`);
			let pageName;
			let glob;
			if (path.indexOf('/') >= 0) {
				pageName = path.split('/')[2];
			} else {
				pageName = path.split('\\')[2];
			}
			if (pageName.indexOf('.pug') >= 0) {
				glob = `app/${pageName}`;
			} else {
				glob = `app/${pageName}.pug`;
			}
			console.log(`Rendering: '${path}'`);
			return renderHTML(glob);
		},
	);

	watch(['./public/**/**.**'], {
		ignorePermissionErrors: true,
		delay: 300,
		events: 'all',
	})
		.on('add', imageChangeTask)
		.on('change', imageChangeTask)
		.on('addDir', imageChangeTask)
		.on('unlink', imageRemoveTask)
		.on('unlinkDir', imageRemoveTask);

	watch(['./app/scripts/**/**.js'], series(jsTask));

	watch(
		['app/styles/**/**.scss'],
		{
			delay: 300,
		},
		series(cssTask),
	);

	watch(
		['./vendors.json', './vendors/**/**.**'],
		series(jsCore, cssCore, copyFonts),
	);

	watch(['./_dist/**/**.**']).on('change', bSync.reload);
};
