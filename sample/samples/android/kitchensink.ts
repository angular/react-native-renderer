import {Component, ElementRef, ViewChild} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {Router, RouteConfig, LocationStrategy} from 'angular2/router';
import {StyleSheet, BackAndroid, Alert, NativeModules, processColor} from 'react-native';
import {DrawerLayout, Toolbar, RippleFeedback, ROUTER_DIRECTIVES} from "react-native-renderer/react-native-renderer";

import {HelloApp} from "./hello";
import {TodoMVC} from "./../common/todomvc";
import {GesturesApp} from "./../common/gestures";
import {WidgetsList} from "./widgets";
import {WebViewApp} from './../common/webview';
import {APIsList} from "./apis";
import {HttpApp} from "./../common/http";
import {AnimationApp} from './../common/animation';

@Component({
  selector: 'kitchensink-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [NgFor, RippleFeedback, ROUTER_DIRECTIVES],
  template: `
<DrawerLayout drawerWidth="240" drawerPosition="left" [style]="{flex: 1}">
  <DrawerLayoutSide>
    <Toolbar [styleSheet]="styles.toolbar" [navIcon]="hamburgerIcon" [overflowIcon]="moreIcon"
    title="Kitchen Sink" titleColor="#FFFFFF" (select)="handleToolbar($event)"></Toolbar>
    <View [styleSheet]="styles.content">
      <router-outlet></router-outlet>
    </View>
  </DrawerLayoutSide>
  <DrawerLayoutContent>
    <View [styleSheet]="styles.drawer">
      <View *ngFor="#item of menuItems" [styleSheet]="styles.menuItem" [routerLink]="['/' + item.as]" rippleFeedback="#00a9e0">
        <Text [styleSheet]="styles.menuText">{{item.name}}</Text>
      </View>
    </View>
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
  menuItems: Array<any> = [{name: 'Hello world', as: 'HelloApp'}, {name: 'Widgets', as: 'WidgetsList'}, {name: 'WebView', as: 'WebViewApp'}, {name: 'APIs', as: 'APIsList'},
    {name: 'TodoMVC', as: 'TodoMVC'}, {name: 'Gestures', as: 'GesturesApp'}, {name: 'Http', as: 'HttpApp'}, {name: 'Animation', as: 'AnimationApp'}]
  styles: any;
  _el : any = null;
  constructor(el: ElementRef, private router: Router, private locationStrategy: LocationStrategy) {
    this.router.subscribe((url) => {
      this._afterNavigate(url);
    })
    NativeModules.StatusBarManager.setColor(processColor('#00a9e0'), true);

    BackAndroid.addEventListener('hardwareBackPress', function() {
      if ((<any>locationStrategy).canGoBack()) {
        locationStrategy.back();
      } else {
        Alert.alert(
          'Close App',
          'Are you sure you want to close the app?',
          [
            {text: 'Cancel', onPress: () => {}, style: 'cancel'},
            {text: 'OK', onPress: () => BackAndroid.exitApp()},
          ]
        );
      }
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
        flex: 1
      },
      content: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 50,
        bottom: 0
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

  _afterNavigate(url: string) {
    this.drawerLayout.closeDrawer();
    if (url == 'todomvc') {
      this._addMoreInToolbar();
    } else {
      this._removeMoreInToolbar();
    }
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
      {title: 'Reset list', show: 'never'},
      {title: 'Empty list', show: 'never'},
      {title: 'Fill list with 100 items', show: 'never'},
      {title: 'Save', show: 'never'},
      {title: 'Load', show: 'never'}
    ];
  }

  private _removeMoreInToolbar():void {
    this.toolbar.actions = [];
  }
}