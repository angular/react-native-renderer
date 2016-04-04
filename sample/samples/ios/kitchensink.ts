import {Component, ViewChild} from 'angular2/core';
import {RouteConfig} from 'angular2/router';
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
  { path: '/', component: HelloApp, as: 'HelloApp', data: {title: 'Kitchen Sink', backButtonTitle: 'Home'}},
  { path: '/widgets', component: WidgetsList, as: 'WidgetsList', data: {title: 'Widgets'}},
  { path: '/webview', component: WebViewApp, as: 'WebViewApp', data: {title: 'WebView'}},
  { path: '/apis', component: APIsApp, as: 'APIsApp', data: {title: 'APIs'}},
  { path: '/todomvc', component: TodoMVC, as: 'TodoMVC', data: {title: 'TodoMVC', rightButtonTitle: 'More'}},
  { path: '/gestures', component: GesturesApp, as: 'GesturesApp', data: {title: 'Gestures'} },
  { path: '/http', component: HttpApp, as: 'HttpApp', data: {title: 'Http'} },
  { path: '/animation', component: AnimationApp, as: 'AnimationApp', data: {title: 'Animation'} }
])
@Component({
  selector: 'kitchensink-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `<Navigator barTintColor="#005eb8" tintColor="#00a9e0" titleTextColor="#FFFFFF" (rightButtonPress)="_actions($event)"></Navigator>`
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
