import { HttpRequest } from "./http";

export default class HttpInterceptor {
  constructor(private http: HttpRequest) {}
}
