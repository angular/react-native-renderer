import {Component, ElementRef, ViewChild} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {Router, RouteConfig, ROUTER_DIRECTIVES, LocationStrategy} from 'angular2/router';
import {StyleSheet, BackAndroid, Alert} from 'react-native';
import {DrawerLayout, Toolbar} from "react-native-renderer/react-native-renderer";

import {HelloApp} from "./hello";
import {TodoMVC} from "./todomvc";
import {GesturesApp} from "./gestures";
import {WidgetsList} from "./widgets";
import {WebViewApp} from './webview';
import {APIsList} from "./apis";
import {HttpApp} from "./http";
import {AnimationApp} from './animation';
import {NativeFeedback} from "./common";

@Component({
  selector: 'kitchensink-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [NgFor, NativeFeedback, ROUTER_DIRECTIVES],
  template: `
<DrawerLayout drawerWidth="240" drawerPosition="left" [style]="{flex: 1}">
  <DrawerLayoutSide>
    <Toolbar [styleSheet]="styles.toolbar" [navIcon]="hamburgerIcon" [overflowIcon]="moreIcon"
    title="Kitchen Sink" titleColor="#FFFFFF" (select)="handleToolbar($event)"></Toolbar>
    <native-view position="absolute" top="50" left="0" right="0" bottom="0" collapsable="false">
      <router-outlet></router-outlet>
    </native-view>
  </DrawerLayoutSide>
  <DrawerLayoutContent>
    <native-view flex="1" [style]="styles.drawer">
      <native-view *ngFor="#item of menuItems" [style]="styles.menuItem" (tap)="navigate(item.path)" nativeFeedback="#00a9e0">
        <native-text [style]="styles.menuText">{{item.name}}</native-text>
      </native-view>
    </native-view>
  </DrawerLayoutContent>
</DrawerLayout>
`
})
@RouteConfig([
  { path: '/', component: HelloApp, as: 'HelloApp' },
  { path: '/todomvc', component: TodoMVC, as: 'TodoMVC' },
  { path: '/gestures', component: GesturesApp, as: 'GesturesApp' },
  { path: '/widgets', component: WidgetsList, as: 'WidgetsList' },
  { path: '/webview', component: WebViewApp, as: 'WebViewApp' },
  { path: '/apis', component: APIsList, as: 'APIsList' },
  { path: '/http', component: HttpApp, as: 'HttpApp' },
  { path: '/animation', component: AnimationApp, as: 'AnimationApp'}
])
export class KitchenSinkApp {
  @ViewChild(TodoMVC) viewChild: TodoMVC;
  @ViewChild(DrawerLayout) drawerLayout: DrawerLayout;
  @ViewChild(Toolbar) toolbar: Toolbar;
  hamburgerIcon: any = require('../../assets/icon_hamburger.png');
  moreIcon: any = require('../../assets/icon_more.png');
  menuItems: Array<any> = [{name: 'Hello world', path: '/'}, {name: 'Widgets', path: '/widgets'}, {name: 'WebView', path: '/webview'}, {name: 'APIs', path: '/apis'},
    {name: 'TodoMVC', path: '/todomvc'}, {name: 'Gestures', path: '/gestures'}, {name: 'Http', path: '/http'}, {name: 'Animation', path: '/animation'}]
  styles: any;
  _el : any = null;
  constructor(el: ElementRef, private router: Router, private locationStrategy: LocationStrategy) {
    BackAndroid.addEventListener('hardwareBackPress', function() {
      Alert.alert(
        'Close App',
        'Are you sure you want to close the app?',
        [
          {text: 'Cancel', onPress: () => {}, style: 'cancel'},
          {text: 'OK', onPress: () => BackAndroid.exitApp()},
        ]
      );
      return true;
    });
    this._el = el.nativeElement;
    this.styles = StyleSheet.create({
      toolbar: {
        backgroundColor: '#005eb8',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 50
      },
      drawer: {
        backgroundColor: '#DDDDDD',
      },
      menuItem: {
        backgroundColor: '#FFFFFF',
        borderColor: '#005eb8',
        borderBottomWidth: 1
      },
      menuText: {
        fontSize: 20,
        margin: 10
      }
    });
  }

  navigate(url: string) {
    this.drawerLayout.closeDrawer();
    var currentPath = this.locationStrategy.path();
    if (currentPath != '/todomvc' && url == '/todomvc') {
      this._addMoreInToolbar();
    } else if (currentPath == '/todomvc' && url != '/todomvc') {
      this._removeMoreInToolbar();
    }
    this.router.navigateByUrl(url);
  }

  handleToolbar(event: any) {
    var position = event.position;
    if (position == -1) {
      this.drawerLayout.openDrawer();
    } else if (position == 0 && this.viewChild) {
      this.viewChild.reset();
    } else if (position == 1 && this.viewChild) {
      this.viewChild.empty();
    } else if (position == 2 && this.viewChild) {
      this.viewChild.full();
    } else if (position == 3 && this.viewChild) {
      this.viewChild.save();
    } else if (position == 4 && this.viewChild) {
      this.viewChild.load();
    }
  }

  private _addMoreInToolbar():void {
    this.toolbar.actions = [
      {title: 'Reset list', show: 0},
      {title: 'Empty list', show: 0},
      {title: 'Fill list with 100 items', show: 0},
      {title: 'Save', show: 0},
      {title: 'Load', show: 0}
    ];
  }

  private _removeMoreInToolbar():void {
    this.toolbar.actions = [];
  }
}