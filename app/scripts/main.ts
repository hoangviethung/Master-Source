// import { map } from "rxjs/operators";
import { HttpRequest, HttpResponse } from './services/http';

const http = new HttpRequest();
http.get('http://dummy.restapiexample.com/api/v1/employees').subscribe(
	(a: HttpResponse) => {
		console.log(a.codeStatus, a.data, a.message);
	},
);
