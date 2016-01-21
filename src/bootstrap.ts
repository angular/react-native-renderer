//React Native wrapper
import {ReactNativeWrapper} from "./wrapper";
import {ReactNativeWrapperImpl} from './wrapper_impl';

//Dependencies
import 'reflect-metadata';
  // Zone.js
import {Zone} from 'zone.js/lib/core';
global.zone = new Zone();
import {patchSetClearFunction} from 'zone.js/lib/patch/functions';
import {apply} from 'zone.js/lib/patch/promise';
patchSetClearFunction(global, ['timeout', 'interval', 'immediate']);

//Needed for Android or iOS, but to be imported after zone.js, and
var originalIsExtensible = Object.isExtensible;
import 'es6-shim';
Object.isExtensible = originalIsExtensible;
//Patch promises after es6-shim overrides them
apply();

// Finally, define the bootstrap
import {RootRenderer, Renderer, provide, NgZone, Provider, enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/bootstrap';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from './react_native_renderer';

export function bootstrapReactNative(appName:string, cpt: any) {
  ReactNativeWrapperImpl.registerApp(appName, function() {
    enableProdMode();
    bootstrap(cpt, [
      [ReactNativeWrapperImpl],
      provide(REACT_NATIVE_WRAPPER, {useExisting: ReactNativeWrapperImpl}),
      [ReactNativeElementSchemaRegistry],
      provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
      provide(ReactNativeRootRenderer, {useClass: ReactNativeRootRenderer_}),
      provide(RootRenderer, {useExisting: ReactNativeRootRenderer})
    ]).then(function(appRef) {
      var zone = appRef.injector.get(NgZone);
      var rootRenderer = appRef.injector.get(RootRenderer);
      zone.onTurnDone.subscribe(() => { rootRenderer.executeCommands(); });
      appRef.injector.get(ReactNativeWrapperImpl).patchReactUpdates(zone._innerZone);
    });
  });
}