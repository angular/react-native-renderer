import 'reflect-metadata';
import {ReactNativeWrapper} from './wrapper';
//Needed for Android or iOS, but to be imported after zone.js
import 'es6-shim';

// Finally, define the bootstrap

import {Renderer, provide, bootstrap, NgZone} from 'angular2/angular2';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRenderer, ReactNativeElementSchemaRegistry} from './react_native_renderer';

export function bootstrapReactNative(appName:string, cpt: any) {
  ReactNativeWrapper.registerApp(appName, function() {
    bootstrap(cpt, [
      [ReactNativeRenderer],
      provide(Renderer, {useExisting: ReactNativeRenderer}),
      [ReactNativeElementSchemaRegistry],
      provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry})
    ]).then(function(appRef) {
      ReactNativeWrapper.patchReactUpdates(appRef.injector.get(NgZone)._innerZone);
    });
  });
}