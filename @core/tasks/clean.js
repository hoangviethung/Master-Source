import del from 'del';

export const clean = (folder) => {
	return del(folder);
};
