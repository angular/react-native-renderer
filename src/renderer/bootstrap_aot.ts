declare var require: any;

//React Native wrapper
import {ReactNativeWrapperImpl} from "./../wrapper/wrapper_impl";

//Dependencies
import "reflect-metadata";

//Zone.js, patching RN's polyfill of XMLHttpRequest is needed to make it compatible with Zone.js
var onreadystatechangeGetter = function() {return this._onreadystatechange;};
var onreadystatechangeSetter = function(v: any) {this._onreadystatechange = v;};
Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
  get: onreadystatechangeGetter,
  set: onreadystatechangeSetter,
  configurable: true
});
require("zone.js/dist/zone.js");
Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
  get: onreadystatechangeGetter,
});

// Finally, define the bootstrap
import {RootRenderer, NgZone, enableProdMode, NgModuleRef, Sanitizer, ErrorHandler} from "@angular/core";
import { platformBrowser } from '@angular/platform-browser';
import {ElementSchemaRegistry} from "@angular/compiler";
import {
  ReactNativeRootRenderer,
  ReactNativeRootRenderer_,
  ReactNativeElementSchemaRegistry,
  ReactNativeSanitizer,
  REACT_NATIVE_WRAPPER
} from "./renderer";

export function bootstrapReactNativeAOT(appName:string, factory: any, customProviders?: Array<any>) {
  ReactNativeWrapperImpl.registerApp(appName, function() {
    enableProdMode();
    platformBrowser([
      {provide: ErrorHandler, useFactory: errorHandler, deps: []},
      [ReactNativeWrapperImpl],
      {provide: REACT_NATIVE_WRAPPER, useExisting: ReactNativeWrapperImpl},
      [ReactNativeElementSchemaRegistry],
      {provide: ElementSchemaRegistry, useExisting: ReactNativeElementSchemaRegistry},
      ReactNativeSanitizer,
      {provide: Sanitizer, useExisting: ReactNativeSanitizer},
      {provide: ReactNativeRootRenderer, useClass: ReactNativeRootRenderer_},
      {provide: RootRenderer, useExisting: ReactNativeRootRenderer}
    ].concat(customProviders || [])).
    bootstrapModuleFactory(factory).
    then((ngModuleRef: NgModuleRef<any>) => {
      var zone: NgZone = ngModuleRef.injector.get(NgZone);
      var rootRenderer = ngModuleRef.injector.get(RootRenderer);
      rootRenderer.zone = zone;
      rootRenderer.executeCommands();
      zone.onStable.subscribe(() => { rootRenderer.executeCommands(); });
      ngModuleRef.injector.get(ReactNativeWrapperImpl).patchReactNativeWithZone(zone);
    });
  });
}

function errorHandler(): ErrorHandler {
  return new ErrorHandler();
}