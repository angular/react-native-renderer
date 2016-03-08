import {provide} from 'angular2/core';
import {Http, RequestOptions, ResponseOptions, BaseRequestOptions, BaseResponseOptions, BrowserXhr} from 'angular2/http';
import {ReactNativeXHRBackend} from "./xhr_backend";

export const HTTP_PROVIDERS: any[] = [
  provide(Http,
    {
      useFactory: (xhrBackend: ReactNativeXHRBackend, requestOptions: RequestOptions) => new Http(xhrBackend, requestOptions),
      deps: [ReactNativeXHRBackend, RequestOptions]
    }),
  BrowserXhr,
  provide(RequestOptions, {useClass: BaseRequestOptions}),
  provide(ResponseOptions, {useClass: BaseResponseOptions}),
  ReactNativeXHRBackend
];