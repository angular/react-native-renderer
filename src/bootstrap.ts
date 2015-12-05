import 'reflect-metadata';

// Zone.js setup
import {Zone} from 'zone.js/lib/core';
global.zone = new Zone();
import {patchSetClearFunction} from 'zone.js/lib/patch/functions';
patchSetClearFunction(global, ['timeout', 'interval', 'immediate']);
//Needed for Android or iOS, but to be imported after zone.js
import 'es6-shim';

// Finally, define the bootstrap
import {AppRegistry} from 'react-native';
import {Renderer, provide, bootstrap, NgZone} from 'angular2/angular2';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRenderer, ReactNativeElementSchemaRegistry} from './react_native_renderer';

export function bootstrapReactNative(appName:string, cpt: any) {
  AppRegistry.registerRunnable(appName, function() {
    bootstrap(cpt, [
      [ReactNativeRenderer],
      provide(Renderer, {useExisting: ReactNativeRenderer}),
      [ReactNativeElementSchemaRegistry],
      provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry})
    ]).then(function(appRef) {
      var zone = appRef.injector.get(NgZone)._innerZone;
      require('ReactUpdates').batchedUpdates = zone.bind(require('ReactUpdates').batchedUpdates);
    });
  });
}