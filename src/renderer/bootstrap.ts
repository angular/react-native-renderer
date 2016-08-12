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
import "zone.js/dist/zone.js";
Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
  get: onreadystatechangeGetter,
});

// Finally, define the bootstrap
import {RootRenderer, NgZone, enableProdMode, NgModuleRef, SanitizationService, ExceptionHandler} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {ElementSchemaRegistry} from "@angular/compiler";
import {
  ReactNativeRootRenderer,
  ReactNativeRootRenderer_,
  ReactNativeElementSchemaRegistry,
  ReactNativeSanitizationServiceImpl,
  REACT_NATIVE_WRAPPER
} from "./renderer";

export function bootstrapReactNative(appName:string, module: any, customProviders?: Array<any>) {
  ReactNativeWrapperImpl.registerApp(appName, function() {
    enableProdMode();
    platformBrowserDynamic([
      {provide: ExceptionHandler, useFactory: _exceptionHandler, deps: []},
      [ReactNativeWrapperImpl],
      {provide: REACT_NATIVE_WRAPPER, useExisting: ReactNativeWrapperImpl},
      [ReactNativeElementSchemaRegistry],
      {provide: ElementSchemaRegistry, useExisting: ReactNativeElementSchemaRegistry},
      ReactNativeSanitizationServiceImpl,
      {provide: SanitizationService, useExisting: ReactNativeSanitizationServiceImpl},
      {provide: ReactNativeRootRenderer, useClass: ReactNativeRootRenderer_},
      {provide: RootRenderer, useExisting: ReactNativeRootRenderer}
    ].concat(customProviders || [])).
    bootstrapModule(module).
    then((ngModuleRef: NgModuleRef<any>) => {
      var zone: NgZone = ngModuleRef.injector.get(NgZone);
      var rootRenderer = ngModuleRef.injector.get(RootRenderer);
      rootRenderer.zone = zone;
      zone.onStable.subscribe(() => { rootRenderer.executeCommands(); });
      ngModuleRef.injector.get(ReactNativeWrapperImpl).patchReactNativeWithZone(zone);
    });
  });
}

function _exceptionHandler(): ExceptionHandler {
  return new ExceptionHandler({
    logError: (error: any) => console.log(error),
    logGroup: (error: any) => console.log(error),
    logGroupEnd: (_: any) => console.groupEnd()
  });
}