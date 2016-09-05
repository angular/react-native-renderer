import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes} from '@angular/router';
import {ReactNativeModule, ReactNativeRouterModule, ReactNativeHttpModule} from 'angular2-react-native';
import {KitchenSinkApp}   from './kitchensink';

import {HelloApp} from "./hello";
import {TodoMVC, TodoItem} from '../common/todomvc';
import {GesturesApp} from "./../common/gestures";
import {WidgetsList} from "./widgets";
import {WebViewApp} from './../common/webview';
import {APIsList} from "./apis";
import {HttpApp} from "./../common/http";
import {AnimationApp, Ball} from './../common/animation';

const appRoutes: Routes = [
  { path: '', component: HelloApp },
  { path: 'todomvc', component: TodoMVC },
  { path: 'gestures', component: GesturesApp },
  { path: 'widgets', component: WidgetsList },
  { path: 'webview', component: WebViewApp },
  { path: 'apis', component: APIsList },
  { path: 'http', component: HttpApp },
  { path: 'animation', component: AnimationApp }
];

@NgModule({
  declarations: [KitchenSinkApp, HelloApp, TodoMVC, TodoItem, GesturesApp, WidgetsList, WebViewApp, APIsList, HttpApp, AnimationApp, Ball],
  imports: [ReactNativeModule, ReactNativeHttpModule, CommonModule, ReactNativeRouterModule.forRoot(appRoutes)],
  bootstrap: [KitchenSinkApp]
})
export class KitchenSinkModule {}
