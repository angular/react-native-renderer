import {Component, ViewChild} from '@angular/core';
import {RouteConfig} from '@angular/router-deprecated';
import {ActionSheetIOS} from 'react-native';
import {Navigator} from 'angular2-react-native';
import {HelloApp} from './hello';
import {WidgetsList} from "./widgets";
import {APIsApp} from './apis';
import {WebViewApp} from "../common/webview";
import {TodoMVC} from "../common/todomvc";
import {GesturesApp} from "../common/gestures";
import {HttpApp} from "../common/http";
import {AnimationApp} from "../common/animation";

@RouteConfig([
  { path: '/', component: HelloApp, name: 'HelloApp', data: {title: 'Kitchen Sink', backButtonTitle: 'Home'}},
  { path: '/widgets', component: WidgetsList, name: 'WidgetsList', data: {title: 'Components'}},
  { path: '/webview', component: WebViewApp, name: 'WebViewApp', data: {title: 'WebView'}},
  { path: '/apis', component: APIsApp, name: 'APIsApp', data: {title: 'APIs'}},
  { path: '/todomvc', component: TodoMVC, name: 'TodoMVC', data: {title: 'TodoMVC', rightButtonTitle: 'More'}},
  { path: '/gestures', component: GesturesApp, name: 'GesturesApp', data: {title: 'Gestures'} },
  { path: '/http', component: HttpApp, name: 'HttpApp', data: {title: 'Http'} },
  { path: '/animation', component: AnimationApp, name: 'AnimationApp', data: {title: 'Animation'} }
])
@Component({
  selector: 'kitchensink-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `<Navigator barTintColor="#005eb8" tintColor="#00a9e0" titleTextColor="#FFFFFF" [itemWrapperStyle]="{backgroundColor: '#F5FCFF'}" (rightButtonPress)="_actions($event)"></Navigator>`
})
export class KitchenSinkApp {
  @ViewChild(Navigator) navigator: Navigator;

  constructor() {}

  _actions(event: any) {
    var todoMVC: TodoMVC = this.navigator.activeComponent;
    ActionSheetIOS.showActionSheetWithOptions({
        title: 'Actions',
        options: ['Reset list', 'Empty list', 'Fill list with 100 items', 'Save', 'Load', 'Cancel'],
        cancelButtonIndex: 5},
      (actionIndex) => {
        if (actionIndex == 0 && todoMVC) {
          todoMVC.reset();
        } else if (actionIndex == 1 && todoMVC) {
          todoMVC.empty();
        } else if (actionIndex == 2 && todoMVC) {
          todoMVC.full();
        } else if (actionIndex == 3 && todoMVC) {
          todoMVC.save();
        } else if (actionIndex == 4 && todoMVC) {
          todoMVC.load();
        }
      }
    );
  }
}
