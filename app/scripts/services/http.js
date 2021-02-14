import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError } from 'rxjs/operators';

class HttpClient {
	static setRequestOption(method, initOptions = {}) {
		const defaultOptions = {
			method: method.toLowerCase(),
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: {},
		};
		const options = { ...defaultOptions, ...initOptions };
		if (method.toLowerCase() === 'get' || method.toLowerCase() === 'head') {
			delete options.body;
		}
		return options;
	}

	static request(method, url, options = {}) {
		const initOptions = HttpClient.setRequestOption(method, options);
		return fromFetch(url, initOptions).pipe(
			switchMap((response) => {
				if (response.ok) {
					// OK return data
					return response.json();
				} else {
					// Server is returning a status requiring the client to try something else.
					return of({
						error: true,
						message: `Error ${response.status}`,
						status: response.status,
					});
				}
			}),
			catchError((err) => {
				// Network or other error, handle appropriately
				console.error(err);
				return of({
					error: true,
					message: err.message,
					status: err.status,
				});
			}),
		);
	}
}

export class HTTP {


	/**
	 * @param {string} url - The url you will use to request to get data from backend
	 * @param {Object} options The options of request
	 * 
	 * {
	 *
	 * * mode: 'same-origin',
	 *
	 * * cache: 'default',
	 *
	 * * credentials: 'same-origin',
	 *
	 * * headers: {
	 *
	 * * * Content-Type: 'application/json',
	 *
	 * * },
	 *
	 * * redirect: 'follow',
	 * 
	 * * referrerPolicy: 'same-origin'
	 * 
	 * }
	 * @param {string} options.mode - no-cors, *cors, same-origin
	 * @param {string} options.cache - *default, no-cache, reload, force-cache, only-if-cached
	 * @param {string} options.credentials - include, *same-origin, omit
	 * @param {Object} options.headers - Content-Type: 'application/x-www-form-urlencoded', 'application/json'
	 * @param {string} options.redirect - manual, *follow, error
	 * @param {string} options.referrerPolicy - no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	 */
	static get(url, options = {}) {
		return HttpClient.request('get', url, options);
	}


	/**
	 * @param {string} url - The url you will use to request to get data from backend
	 * @param {Object} options The options of request
	 * 
	 * {
	 * 
	 * * body: JSON.stringify(data),
	 *
	 * * mode: 'same-origin',
	 *
	 * * cache: 'default',
	 *
	 * * credentials: 'same-origin',
	 *
	 * * headers: {
	 *
	 * * * Content-Type: 'application/json',
	 *
	 * * },
	 *
	 * * redirect: 'follow',
	 * 
	 * * referrerPolicy: 'same-origin'
	 * 
	 * }
	 * @param {string} options.body - data is depend on you
	 * @param {string} options.mode - no-cors, *cors, same-origin
	 * @param {string} options.cache - *default, no-cache, reload, force-cache, only-if-cached
	 * @param {string} options.credentials - include, *same-origin, omit
	 * @param {Object} options.headers - Content-Type: 'application/x-www-form-urlencoded', 'application/json'
	 * @param {string} options.redirect - manual, *follow, error
	 * @param {string} options.referrerPolicy - no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	 */
	static post(url, options = {}) {
		return HttpClient.request('post', url, options);
	}


	/**
	 * @param {string} url - The url you will use to request to get data from backend
	 * @param {Object} options The options of request
	 * 
	 * {
	 * 
	 * * body: JSON.stringify(data),
	 *
	 * * mode: 'same-origin',
	 *
	 * * cache: 'default',
	 *
	 * * credentials: 'same-origin',
	 *
	 * * headers: {
	 *
	 * * * Content-Type: 'application/json',
	 *
	 * * },
	 *
	 * * redirect: 'follow',
	 * 
	 * * referrerPolicy: 'same-origin'
	 * 
	 * }
	 * @param {string} options.body - data is depend on you
	 * @param {string} options.mode - no-cors, *cors, same-origin
	 * @param {string} options.cache - *default, no-cache, reload, force-cache, only-if-cached
	 * @param {string} options.credentials - include, *same-origin, omit
	 * @param {Object} options.headers - Content-Type: 'application/x-www-form-urlencoded', 'application/json'
	 * @param {string} options.redirect - manual, *follow, error
	 * @param {string} options.referrerPolicy - no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	 */
	static put(url, options = {}) {
		return HttpClient.request('put', url, options);
	}


	/**
	 * @param {string} url - The url you will use to request to get data from backend
	 * @param {Object} options The options of request
	 * 
	 * {
	 * 
	 * * method: 'get',
	 * 
	 * * body: JSON.stringify(data),
	 *
	 * * mode: 'same-origin',
	 *
	 * * cache: 'default',
	 *
	 * * credentials: 'same-origin',
	 *
	 * * headers: {
	 *
	 * * * Content-Type: 'application/json',
	 *
	 * * },
	 *
	 * * redirect: 'follow',
	 * 
	 * * referrerPolicy: 'same-origin'
	 * 
	 * }
	 * @param {string} options.method - 'get', 'post, 'put',...
	 * @param {string} options.body - data is depend on you
	 * @param {string} options.mode - no-cors, *cors, same-origin
	 * @param {string} options.cache - *default, no-cache, reload, force-cache, only-if-cached
	 * @param {string} options.credentials - include, *same-origin, omit
	 * @param {Object} options.headers - Content-Type: 'application/x-www-form-urlencoded', 'application/json'
	 * @param {string} options.redirect - manual, *follow, error
	 * @param {string} options.referrerPolicy - no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	 */
	static request(method, url, options = {}) {
		return HttpClient.request(method, url, options);
	}
}
