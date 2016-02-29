//React Native wrapper
import {ReactNativeWrapper} from "./../wrapper/wrapper";
import {ReactNativeWrapperImpl} from './../wrapper/wrapper_impl';

//Dependencies
import 'reflect-metadata';
  // Zone.js
import {Zone} from 'zone.js/build/lib/core';
global.Zone = Zone;
global.zone = new Zone();
import {patchSetClearFunction} from 'zone.js/build/lib/patch/functions';
import {apply} from 'zone.js/build/lib/patch/promise';
patchSetClearFunction(global, global.Zone,
  [['setTimeout', 'clearTimeout', false, false],
  ['setInterval', 'clearInterval', true, false],
  ['setImmediate', 'clearImmediate', false, false]]);

//Needed for Android or iOS, but to be imported after zone.js, and
var originalIsExtensible = Object.isExtensible;
import 'es6-shim';
Object.isExtensible = originalIsExtensible;
//Patch promises after es6-shim overrides them
apply();

// Finally, define the bootstrap
import {RootRenderer, Renderer, provide, NgZone, Provider, enableProdMode, PLATFORM_DIRECTIVES} from 'angular2/core';
import {bootstrap} from 'angular2/bootstrap';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from './renderer';
import {HTTP_PROVIDERS} from './../http/xhr_backend';
import {ROUTER_PROVIDERS, LocationStrategy} from 'angular2/router';
import {ReactNativeLocationStrategy} from "./../router/location_strategy";
import {View} from "./../components/view";
import {Text} from "../components/text";
import {Switch} from "../components/switch";
import {TextInput} from "../components/textinput";
import {WebView} from "../components/webview";
import {ProgressBar} from "../components/android/progress_bar";
import {PagerLayout} from "../components/android/pager_layout";
import {DrawerLayout, DrawerLayoutSide, DrawerLayoutContent} from "../components/android/drawer_layout";
import {RefreshControl} from "../components/refresh_control";
import {Toolbar} from "../components/android/toolbar";
import {Image} from '../components/image';
import {ScrollView} from "../components/scrollview";
import {Picker} from "../components/picker";

export function bootstrapReactNative(appName:string, cpt: any) {
  ReactNativeWrapperImpl.registerApp(appName, function() {
    enableProdMode();
    bootstrap(cpt, [
      provide(PLATFORM_DIRECTIVES, {useValue: [View, Text, Switch, TextInput, WebView, Image, ProgressBar, PagerLayout, ScrollView,
        DrawerLayout, DrawerLayoutSide, DrawerLayoutContent, RefreshControl, Toolbar, Picker], multi:true}),
      ROUTER_PROVIDERS,
      provide(LocationStrategy, { useClass: ReactNativeLocationStrategy }),
      HTTP_PROVIDERS,
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