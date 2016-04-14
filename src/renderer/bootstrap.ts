//React Native wrapper
import {ReactNativeWrapperImpl} from './../wrapper/wrapper_impl';

//Dependencies
import 'reflect-metadata'

//Zone.js, patching RN's polyfill of XMLHttpRequest is needed to make it compatible with Zone.js
var onreadystatechangeGetter = function() {return this._onreadystatechange;};
var onreadystatechangeSetter = function(v: any) {this._onreadystatechange = v;};
Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
  get: onreadystatechangeGetter,
  set: onreadystatechangeSetter,
  configurable: true
});
import 'zone.js/dist/zone.js';
Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
  get: onreadystatechangeGetter,
});
XMLHttpRequest.prototype.addEventListener = () => {};

// Finally, define the bootstrap
import {RootRenderer, provide, NgZone, enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from './renderer';
import {getAmbientComponents} from "./utils";

export function bootstrapReactNative(appName:string, cpt: any, customProviders?: Array<any>) {
  ReactNativeWrapperImpl.registerApp(appName, function() {
    enableProdMode();
    bootstrap(cpt, [
      [ReactNativeWrapperImpl],
      provide(REACT_NATIVE_WRAPPER, {useExisting: ReactNativeWrapperImpl}),
      [ReactNativeElementSchemaRegistry],
      provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
      provide(ReactNativeRootRenderer, {useClass: ReactNativeRootRenderer_}),
      provide(RootRenderer, {useExisting: ReactNativeRootRenderer})
    ].concat(getAmbientComponents()).concat(customProviders || []))
    .then(function(appRef) {
      var zone: NgZone = appRef.injector.get(NgZone);
      var rootRenderer = appRef.injector.get(RootRenderer);
      zone.onStable.subscribe(() => { rootRenderer.executeCommands(); });
      appRef.injector.get(ReactNativeWrapperImpl).patchReactNativeWithZone(zone);
    });
  });
}