var argv = require('minimist');
export const getArgv = () => {
	return argv(process.argv.slice(2));
};

export const isProduction = () => {
	const argvs = getArgv();
	return argvs.mode == 'production';
};
