import 'reflect-metadata';
import {ReactNativeWrapper} from "./wrapper";
import {ReactNativeWrapperImpl} from './wrapper_impl';
//Needed for Android or iOS, but to be imported after zone.js
import 'es6-shim';

// Finally, define the bootstrap
import {Renderer, provide, NgZone, Provider} from 'angular2/core';
import {bootstrap} from 'angular2/bootstrap';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRenderer, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from './react_native_renderer';


export function bootstrapReactNative(appName:string, cpt: any) {
  ReactNativeWrapperImpl.registerApp(appName, function() {
    bootstrap(cpt, [
      [ReactNativeWrapperImpl],
      provide(REACT_NATIVE_WRAPPER, {useExisting: ReactNativeWrapperImpl}),
      [ReactNativeRenderer],
      provide(Renderer, {useExisting: ReactNativeRenderer}),
      [ReactNativeElementSchemaRegistry],
      provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry})
    ]).then(function(appRef) {
      appRef.injector.get(ReactNativeWrapper).patchReactUpdates(appRef.injector.get(NgZone)._innerZone);
    });
  });
}