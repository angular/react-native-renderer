declare var require: any;

//React Native wrapper
import {ReactNativeWrapperImpl} from "./../wrapper/wrapper_impl";

//Dependencies
import "reflect-metadata";

//Zone.js, working around some patches
if (!global.hasOwnProperty) {
  global.hasOwnProperty = () => false;
}
var oldSend = XMLHttpRequest.prototype.send;
require("zone.js/dist/zone.js");
XMLHttpRequest.prototype.send = oldSend;

// Finally, define the bootstrap
import {RendererFactory2, NgZone, enableProdMode, NgModuleRef, Sanitizer, ErrorHandler} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {DomElementSchemaRegistry} from "@angular/compiler";
import {
  ReactNativeRootRenderer,
  ReactNativeElementSchemaRegistry,
  ReactNativeSanitizer,
  REACT_NATIVE_WRAPPER
} from "./renderer";

export function bootstrapReactNativeJIT(appName:string, module: any, customProviders?: Array<any>) {
  ReactNativeWrapperImpl.registerApp(appName, function() {
    enableProdMode();
    platformBrowserDynamic([
      {provide: ErrorHandler, useFactory: errorHandler, deps: []},
      [ReactNativeWrapperImpl],
      {provide: REACT_NATIVE_WRAPPER, useExisting: ReactNativeWrapperImpl},
      [ReactNativeElementSchemaRegistry],
      {provide: DomElementSchemaRegistry, useExisting: ReactNativeElementSchemaRegistry},
      ReactNativeSanitizer,
      {provide: Sanitizer, useExisting: ReactNativeSanitizer},
      [ReactNativeRootRenderer],
      {provide: RendererFactory2, useExisting: ReactNativeRootRenderer}
    ].concat(customProviders || [])).
    bootstrapModule(module).
    then((ngModuleRef: NgModuleRef<any>) => {
      var zone: NgZone = ngModuleRef.injector.get(NgZone);
      var rendererFactory = ngModuleRef.injector.get(RendererFactory2);
      rendererFactory.zone = zone;
      rendererFactory.executeCommands();
      zone.onStable.subscribe(() => { rendererFactory.executeCommands(); });
      ngModuleRef.injector.get(ReactNativeWrapperImpl).patchReactNativeWithZone(zone);
    });
  });
}

function errorHandler(): ErrorHandler {
  return new ErrorHandler();
}