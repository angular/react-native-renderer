import {Component, ElementRef, ViewChild} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {Router, RouteConfig, ROUTER_DIRECTIVES, LocationStrategy} from 'angular2/router';
import {StyleSheet, BackAndroid, Alert} from 'react-native';
var resolveAssetSource = require('resolveAssetSource');

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
<DrawerLayout drawerWidth="300" drawerPosition="8388611" flex="1">
  <View position="absolute" top="0" left="0" right="0" bottom="0" collapsable="false">
    <Toolbar [style]="styles.toolbar" [navIcon]="hamburgerIcon" [overflowIcon]="moreIcon" title="Kitchen Sink" titleColor="#FFFFFF" subtitle="null" (topSelect)="handleToolbar($event)"></Toolbar>
    <View position="absolute" top="50" left="0" right="0" bottom="0" collapsable="false">
      <router-outlet></router-outlet>
    </View>
  </View>
  <View position="absolute" top="0" bottom="0" width="300" collapsable="false">
    <View flex="1" [style]="styles.drawer">
      <View *ngFor="#item of menuItems" [style]="styles.menuItem" (tap)="navigate(item.path)" nativeFeedback="#00a9e0">
        <Text [style]="styles.menuText">{{item.name}}</Text>
      </View>
    </View>
  </View>
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
  @ViewChild(TodoMVC) viewChild:TodoMVC;
  hamburgerIcon: any = resolveAssetSource(require('./icon_hamburger.png'));
  moreIcon: any = resolveAssetSource(require('./icon_more.png'));
  menuItems: Array = [{name: 'Hello world', path: '/'}, {name: 'Widgets', path: '/widgets'}, {name: 'WebView', path: '/webview'}, {name: 'APIs', path: '/apis'},
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
    this._el.children[1].dispatchCommand('closeDrawer');
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
      this._el.children[1].dispatchCommand('openDrawer');
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
    this._el.children[1].children[1].children[1].setProperty('nativeActions', [
      {title: 'Reset list', show: 0},
      {title: 'Empty list', show: 0},
      {title: 'Fill list with 100 items', show: 0},
      {title: 'Save', show: 0},
      {title: 'Load', show: 0}
    ]);
  }

  private _removeMoreInToolbar():void {
    this._el.children[1].children[1].children[1].setProperty('nativeActions', []);
  }
}