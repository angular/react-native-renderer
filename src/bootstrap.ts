import 'reflect-metadata';
import {Parse5DomAdapter} from 'angular2/src/core/dom/parse5_adapter';
import {Zone} from 'zone.js/lib/core';
global.zone = new Zone();

import {AppRegistry, NativeModules} from 'react-native';
import {Renderer, provide, bootstrap, NgZone} from 'angular2/angular2';
import {ReactNativeRenderer} from './react_native_renderer';



export function bootstrapReactNative(appName:string, cpt: any) {
  AppRegistry.registerRunnable(appName, function() {
    Parse5DomAdapter.makeCurrent();

    bootstrap(cpt, [
      [ReactNativeRenderer],
      provide(Renderer, {useExisting: ReactNativeRenderer})
    ]).then(function(appRef) {
      var zone = appRef.injector.get(NgZone)._innerZone;
      require('ReactUpdates').batchedUpdates = zone.bind(require('ReactUpdates').batchedUpdates);

      /*var UIManager = NativeModules.UIManager;
      UIManager.createView(2, "RCTView", 1, {});
      UIManager.manageChildren(1, null, null, [2], [0], null);


      UIManager.createView(4, "RCTRawText", 1, {
        "text": "Hello World! 989056 sdf"
      });
      UIManager.createView(3, "RCTText", 1, {});
      UIManager.manageChildren(3, null, null, [4], [0], null);

      UIManager.createView(5, "RCTRawText", 1, {
        "text": "Hello World! 989056 sdf é;:"
      });
      UIManager.createView(39, "RCTText", 1, {});
      UIManager.manageChildren(39, null, null, [5], [0], null);
      // attach views
      // Note: the "root" native view is tag # 1


      UIManager.createView(11, "RCTView", 1, {});


      UIManager.manageChildren(11, null, null, [3], [0], null);
      UIManager.manageChildren(11, null, null, [39], [1], null);


      UIManager.manageChildren(2, null, null, [11], [0], null);*/
    });
  });
}