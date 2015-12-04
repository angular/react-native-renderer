import 'reflect-metadata';

// Zone.js setup
import {Zone} from 'zone.js/lib/core';
global.zone = new Zone();
import {patchSetClearFunction} from 'zone.js/lib/patch/functions';
patchSetClearFunction(global, ['timeout', 'interval', 'immediate']);
//Needed for Android or iOS, but to be imported after zone.js
import 'es6-shim';

//Patch Parse5DomAdapter to avoid property check, will be removed with new parser
import {RCT_PROPERTY_NAMES} from './reference';
import {Parse5DomAdapter} from 'angular2/src/core/dom/parse5_adapter';
import {setRootDomAdapter} from 'angular2/src/core/dom/dom_adapter';
class CustomParse5DomAdapter extends Parse5DomAdapter {
  static makeCurrent() { setRootDomAdapter(new CustomParse5DomAdapter()); }
  hasProperty(element, name: string): boolean {
    return RCT_PROPERTY_NAMES[name] !== undefined;
  }
}

// Finally, define the bootstrap
import {AppRegistry} from 'react-native';
import {Renderer, provide, bootstrap, NgZone} from 'angular2/angular2';
import {ReactNativeRenderer} from './react_native_renderer';

export function bootstrapReactNative(appName:string, cpt: any) {
  AppRegistry.registerRunnable(appName, function() {
    CustomParse5DomAdapter.makeCurrent();
    bootstrap(cpt, [
      [ReactNativeRenderer],
      provide(Renderer, {useExisting: ReactNativeRenderer})
    ]).then(function(appRef) {
      var zone = appRef.injector.get(NgZone)._innerZone;
      require('ReactUpdates').batchedUpdates = zone.bind(require('ReactUpdates').batchedUpdates);
    });
  });
}