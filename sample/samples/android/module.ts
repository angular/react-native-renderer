import {NgModule, Provider} from '@angular/core';
import {CommonModule, LocationStrategy} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactNativeAndroidModule, ReactNativeRouterModule, ReactNativeHttpModule, ReactNativeLocationStrategy} from 'angular-react-native';
import {KitchenSinkApp}   from './kitchensink';

import {HelloApp} from "./hello";
import {TodoMVC, TodoItem} from './todomvc';
import {GesturesApp} from "././gestures";
import {WidgetsList} from "./widgets";
import {WebViewApp} from '././webview';
import {APIsList} from "./apis";
import {HttpApp} from "./http";
import {AnimationApp, Ball} from './animation';

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

export const providers: Provider[] = RouterModule.forRoot(appRoutes)['providers'];

@NgModule({
  declarations: [KitchenSinkApp, HelloApp, WidgetsList, APIsList, AnimationApp, Ball, GesturesApp, HttpApp, TodoMVC, TodoItem, WebViewApp],
  imports: [ReactNativeAndroidModule, ReactNativeHttpModule, CommonModule, ReactNativeRouterModule],
  providers: [providers, {provide: LocationStrategy, useClass: ReactNativeLocationStrategy}],
  bootstrap: [KitchenSinkApp]
})
export class KitchenSinkModule {}
