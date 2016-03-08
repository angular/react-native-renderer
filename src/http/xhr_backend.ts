import {Http, Connection, ConnectionBackend, ReadyState, Headers, BrowserXhr,
  Request, RequestMethod, RequestOptions, BaseRequestOptions,
  Response, ResponseType,  ResponseOptions, BaseResponseOptions } from 'angular2/http';
import {Injectable, provide, NgZone} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

class ReactNativeXHRConnection implements Connection {
  request: Request;
  response: Observable<Response>;
  readyState: ReadyState;
  constructor(req: Request, browserXHR: BrowserXhr, baseResponseOptions: ResponseOptions, private zone: NgZone) {
    this.request = req;
    this.response = new Observable((responseObserver: any) => {
      let _xhr: XMLHttpRequest = browserXHR.build();
      _xhr.open(RequestMethod[req.method].toUpperCase(), req.url);
      // load event handler
      let onLoad = () => {
        // responseText is the old-school way of retrieving response (supported by IE8 & 9)
        // response/responseType properties were introduced in XHR Level2 spec (supported by
        // IE10)
        let body = _xhr.response ? _xhr.response : _xhr.responseText;
        let headers = Headers.fromResponseHeaderString(_xhr.getAllResponseHeaders() || "");
        let url = getResponseURL(_xhr);
        let status: number = _xhr.status;

        var responseOptions = new ResponseOptions({body, status, headers, url});
        if (baseResponseOptions) {
          responseOptions = baseResponseOptions.merge(responseOptions);
        }
        let response = new Response(responseOptions);
        if (isSuccess(status)) {
          responseObserver.next(response);
          // TODO(gdi2290): defer complete if array buffer until done
          responseObserver.complete();
          return;
        }
        responseObserver.error(response);
      };

      _xhr.onload = () => this.zone.run(() => onLoad());
      var body = this.request.text();
      if (body && body.length > 0) {
        _xhr.send(body);
      } else {
        _xhr.send();
      }

      return () => {
        _xhr.onload = null;
        _xhr.abort();
      };
    });
  }
}

@Injectable()
export class ReactNativeXHRBackend implements ConnectionBackend {
  constructor(private _browserXHR: BrowserXhr, private _baseResponseOptions: ResponseOptions, private _zone: NgZone) {}
  createConnection(request: Request): ReactNativeXHRConnection {
    return new ReactNativeXHRConnection(request, this._browserXHR, this._baseResponseOptions, this._zone);
  }
}

const isSuccess = (status: number): boolean => (status >= 200 && status < 300);

function getResponseURL(xhr: any): string {
  if ('responseURL' in xhr) {
    return xhr.responseURL;
  }
  if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
    return xhr.getResponseHeader('X-Request-URL');
  }
  return;
}


