import {NgModule, Provider} from '@angular/core';
import {CommonModule, LocationStrategy} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactNativeiOSModule, ReactNativeRouterModule, ReactNativeHttpModule, ReactNativeLocationStrategy} from 'angular-react-native';
import {KitchenSinkApp}   from './kitchensink';

import {HelloApp} from "./hello";
import {TodoMVC, TodoItem} from './todomvc';
import {GesturesApp} from "././gestures";
import {WidgetsList} from "./widgets";
import {WebViewApp} from './webview';
import {APIsApp} from "./apis";
import {HttpApp} from "././http";
import {AnimationApp, Ball} from './animation';

const appRoutes: Routes = [
  { path: '', component: HelloApp, data: {title: 'Kitchen Sink', backButtonTitle: 'Home'}},
  { path: 'widgets', component: WidgetsList, data: {title: 'Components'}},
  { path: 'webview', component: WebViewApp, data: {title: 'WebView'}},
  { path: 'apis', component: APIsApp, data: {title: 'APIs'}},
  { path: 'todomvc', component: TodoMVC, data: {title: 'TodoMVC', rightButtonTitle: 'More'}},
  { path: 'gestures', component: GesturesApp, data: {title: 'Gestures'} },
  { path: 'http', component: HttpApp, data: {title: 'Http'} },
  { path: 'animation', component: AnimationApp, data: {title: 'Animation'} }
];

export const providers: Provider[] = RouterModule.forRoot(appRoutes)['providers'];

@NgModule({
  declarations: [KitchenSinkApp, HelloApp, WidgetsList, APIsApp, AnimationApp, Ball, GesturesApp, HttpApp, TodoMVC, TodoItem, WebViewApp],
  imports: [ReactNativeiOSModule, ReactNativeHttpModule, CommonModule, ReactNativeRouterModule],
  providers: [providers, {provide: LocationStrategy, useClass: ReactNativeLocationStrategy}],
  bootstrap: [KitchenSinkApp]
})
export class KitchenSinkModule {}
