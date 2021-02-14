import { readFileSync } from 'fs';

export const readVendors = (url) => {
	return readFileSync(url);
};
