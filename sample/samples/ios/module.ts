import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes} from '@angular/router';
import {ReactNativeiOSModule, ReactNativeRouterModule, ReactNativeHttpModule} from 'angular2-react-native';
import {KitchenSinkApp}   from './kitchensink';

import {HelloApp} from "./hello";
import {TodoMVC, TodoItem} from '../common/todomvc';
import {GesturesApp} from "./../common/gestures";
import {WidgetsList} from "./widgets";
import {WebViewApp} from './../common/webview';
import {APIsApp} from "./apis";
import {HttpApp} from "./../common/http";
import {AnimationApp, Ball} from './../common/animation';

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

@NgModule({
  declarations: [KitchenSinkApp, HelloApp, TodoMVC, TodoItem, GesturesApp, WidgetsList, WebViewApp, APIsApp, HttpApp, AnimationApp, Ball],
  imports: [ReactNativeiOSModule, ReactNativeHttpModule, CommonModule, ReactNativeRouterModule.forRoot(appRoutes)],
  bootstrap: [KitchenSinkApp]
})
export class KitchenSinkModule {}
