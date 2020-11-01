import { of } from "rxjs";
import { Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { switchMap, catchError } from "rxjs/operators";

export interface HttpResponse {
  codeStatus?: number;
  message?: string;
  data: any;
}

export class HttpRequest {
  constructor() {}

  get(url: string): Observable<HttpResponse> {
    return fromFetch("https://api.github.com/users?per_page=5").pipe(
      switchMap((response) => {
        if (response.ok) {
          // OK return data
          return response.json();
        } else {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      catchError((err) => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err.message });
      })
    );
  }
}
