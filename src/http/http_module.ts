import {NgModule} from "@angular/core";
import {
  Http,
  RequestOptions,
  ResponseOptions,
  BaseRequestOptions,
  BaseResponseOptions,
  BrowserXhr
} from "@angular/http";
import {ReactNativeXHRBackend} from "./xhr_backend";

export function httpFactory(xhrBackend: ReactNativeXHRBackend, requestOptions: RequestOptions) {
  return new Http(xhrBackend, requestOptions);
}

export const HTTP_PROVIDERS: any[] = [
  {
    provide: Http,
    useFactory: httpFactory,
    deps: [ReactNativeXHRBackend, RequestOptions]
  },
  BrowserXhr,
  {provide: RequestOptions, useClass: BaseRequestOptions},
  {provide: ResponseOptions, useClass: BaseResponseOptions},
  ReactNativeXHRBackend
];

@NgModule({providers: HTTP_PROVIDERS})
export class ReactNativeHttpModule {

}