import {Component, ElementRef} from 'angular2/core';
import {NgSwitch, NgSwitchWhen} from 'angular2/common';
import {StyleSheet} from 'react-native';
import {HelloApp} from "./hello";
import {TodoMVC} from "./todomvc";
import {GesturesApp} from "./gestures";
import {ComponentsList} from "./widgets";
import {PagerApp} from './pager';
import {WebViewApp} from './webview';
import {NativeFeedback} from "./common";

@Component({
  selector: 'kitchensink-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [NgSwitch, NgSwitchWhen, NativeFeedback, HelloApp, TodoMVC, GesturesApp, ComponentsList, PagerApp, WebViewApp],
  template: `
<DrawerLayout drawerWidth="300" drawerPosition="8388611" flex="1">
  <View [ngSwitch]="state" position="absolute" top="0" left="0" right="0" bottom="0" collapsable="false">
    <hello-app *ngSwitchWhen="0"></hello-app>
    <todo-mvc *ngSwitchWhen="1"></todo-mvc>
    <gestures-app *ngSwitchWhen="2"></gestures-app>
    <cpt-list *ngSwitchWhen="3"></cpt-list>
    <pager-app *ngSwitchWhen="4"></pager-app>
    <webview-app *ngSwitchWhen="5"></webview-app>
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
        <Text [style]="styles.menuText">Pager</Text>
      </View>
      <View [style]="styles.menuItem" (tap)="switchContent(5)" nativeFeedback="#00a9e0">
        <Text [style]="styles.menuText">WebView</Text>
      </View>
    </View>
  </View>
</DrawerLayout>
`
})
export class KitchenSinkApp {
  state: number = 0;
  styles: any;
  _el : any = null;
  constructor(el: ElementRef) {
    this._el = el.nativeElement;
    this.styles = StyleSheet.create({
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
    setTimeout(() => {
      this._el.children[1].dispatchCommand('closeDrawer');
      this.state = index;
    }, 50);
  }
}