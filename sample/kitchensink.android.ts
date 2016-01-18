import {Component, ElementRef, ViewChild} from 'angular2/core';
import {NgSwitch, NgSwitchWhen} from 'angular2/common';
import {StyleSheet} from 'react-native';
var resolveAssetSource = require('resolveAssetSource');
import {HelloApp} from "./hello";
import {TodoMVC} from "./todomvc";
import {GesturesApp} from "./gestures";
import {ComponentsList} from "./widgets";
import {WebViewApp} from './webview';
import {NativeFeedback} from "./common";

@Component({
  selector: 'kitchensink-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [NgSwitch, NgSwitchWhen, NativeFeedback, HelloApp, TodoMVC, GesturesApp, ComponentsList, WebViewApp],
  template: `
<DrawerLayout drawerWidth="300" drawerPosition="8388611" flex="1">
  <View position="absolute" top="0" left="0" right="0" bottom="0" collapsable="false">
    <Toolbar [style]="styles.toolbar" [navIcon]="hamburgerIcon" [overflowIcon]="moreIcon" title="Kitchen Sink" titleColor="#FFFFFF" subtitle="null" (topSelect)="handleToolbar($event)"></Toolbar>
    <View [ngSwitch]="state" position="absolute" top="50" left="0" right="0" bottom="0" collapsable="false">
      <hello-app *ngSwitchWhen="0"></hello-app>
      <todo-mvc *ngSwitchWhen="1"></todo-mvc>
      <gestures-app *ngSwitchWhen="2"></gestures-app>
      <cpt-list *ngSwitchWhen="3"></cpt-list>
      <webview-app *ngSwitchWhen="4"></webview-app>
    </View>
  </View>
  <View position="absolute" top="0" bottom="0" width="300" collapsable="false">
    <View flex="1" [style]="styles.drawer">
      <View [style]="styles.menuItem" (tap)="switchContent(0)" nativeFeedback="#00a9e0">
        <Text [style]="styles.menuText">Hello world</Text>
      </View>
      <View [style]="styles.menuItem" (tap)="switchContent(1)" nativeFeedback="#00a9e0">
        <Text [style]="styles.menuText">TodoMVC</Text>
      </View>
      <View [style]="styles.menuItem" (tap)="switchContent(2)" nativeFeedback="#00a9e0">
        <Text [style]="styles.menuText">Gestures</Text>
      </View>
      <View [style]="styles.menuItem" (tap)="switchContent(3)" nativeFeedback="#00a9e0">
        <Text [style]="styles.menuText">Widgets</Text>
      </View>
      <View [style]="styles.menuItem" (tap)="switchContent(4)" nativeFeedback="#00a9e0">
        <Text [style]="styles.menuText">WebView</Text>
      </View>
    </View>
  </View>
</DrawerLayout>
`
})
export class KitchenSinkApp {
  @ViewChild(TodoMVC) viewChild:TodoMVC;
  hamburgerIcon: any = resolveAssetSource(require('./icon_hamburger.png'));
  moreIcon: any = resolveAssetSource(require('./icon_more.png'));
  state: number = 0;
  styles: any;
  _el : any = null;
  constructor(el: ElementRef) {
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

  switchContent(index: number = 0) {
    this._el.children[1].dispatchCommand('closeDrawer');
    if (this.state != 1 && index == 1) {
      this._addMoreInToolbar();
    } else if (this.state == 1 && index != 1) {
      this._removeMoreInToolbar();
    }
    this.state = index;
  }

  handleToolbar(event: any) {
    var position = event.position;
    if (position == -1) {
      this._el.children[1].dispatchCommand('openDrawer');
    } else if (position == 0 && this.viewChild) {
      this.viewChild.reset();
    } else if (position == 1 && this.viewChild) {
      this.viewChild.empty();
    }else if (position == 2 && this.viewChild) {
      this.viewChild.full();
    }
  }

  private _addMoreInToolbar():void {
    this._el.children[1].children[1].children[1].setProperty('nativeActions', [{title: 'Reset list', show: 0}, {title: 'Empty list', show: 0}, {title: 'Fill list with 100 items', show: 0}]);
  }

  private _removeMoreInToolbar():void {
    this._el.children[1].children[1].children[1].setProperty('nativeActions', []);
  }
}