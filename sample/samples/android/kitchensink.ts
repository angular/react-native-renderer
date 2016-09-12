import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {StyleSheet, BackAndroid, Alert, NativeModules, processColor} from 'react-native';
import {DrawerLayout, Toolbar} from 'angular2-react-native/android';

import {TodoMVC} from "./todomvc";

@Component({
  selector: 'kitchensink-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `
<DrawerLayout drawerWidth="240" drawerPosition="left" [style]="{flex: 1}">
  <DrawerLayoutSide>
    <Toolbar [styleSheet]="styles.toolbar" [navIcon]="hamburgerIcon" [overflowIcon]="moreIcon"
    title="Kitchen Sink" titleColor="#FFFFFF" (select)="handleToolbar($event)"></Toolbar>
    <View [styleSheet]="styles.content">
      <router-outlet (activate)="_lastActivated = $event"></router-outlet>
    </View>
  </DrawerLayoutSide>
  <DrawerLayoutContent>
    <View [styleSheet]="styles.drawer">
      <View *ngFor="let item of menuItems" [styleSheet]="styles.menuItem" [routerLink]="item.as" rippleFeedback="#00a9e0">
        <Text [styleSheet]="styles.menuText">{{item.name}}</Text>
      </View>
    </View>
  </DrawerLayoutContent>
</DrawerLayout>
`
})
export class KitchenSinkApp {
  private _lastActivated: any;
  private _todoMVC: TodoMVC;
  @ViewChild(DrawerLayout) drawerLayout: DrawerLayout;
  @ViewChild(Toolbar) toolbar: Toolbar;
  hamburgerIcon: any = require('../../assets/icon_hamburger.png');
  moreIcon: any = require('../../assets/icon_more.png');
  menuItems: Array<any> = [{name: 'Hello world', as: ''}, {name: 'Components', as: 'widgets'}, {name: 'WebView', as: 'webview'}, {name: 'APIs', as: 'apis'},
    {name: 'TodoMVC', as: 'todomvc'}, {name: 'Gestures', as: 'gestures'}, {name: 'Http', as: 'http'}, {name: 'Animation', as: 'animation'}]
  styles: any;
  _el : any = null;
  constructor(el: ElementRef, private router: Router, private locationStrategy: LocationStrategy) {
    this.router.events.subscribe((res) => {
      if (res instanceof NavigationEnd) {
        this._afterNavigate(res.url.substring(1));
      }
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
        bottom: 0,
        backgroundColor: '#F5FCFF'
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
      this._todoMVC = this._lastActivated;
    } else {
      this._removeMoreInToolbar();
      this._todoMVC = null;
    }
  }

  handleToolbar(event: any) {
    var position = event.position;
    if (position == -1) {
      this.drawerLayout.openDrawer();
    } else if (position == 0 && this._todoMVC) {
      this._todoMVC.reset();
    } else if (position == 1 && this._todoMVC) {
      this._todoMVC.empty();
    } else if (position == 2 && this._todoMVC) {
      this._todoMVC.full();
    } else if (position == 3 && this._todoMVC) {
      this._todoMVC.save();
    } else if (position == 4 && this._todoMVC) {
      this._todoMVC.load();
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