import {Component, ViewChild} from '@angular/core';
import {ActionSheetIOS} from 'react-native';
import {Navigator} from 'angular2-react-native';
import {TodoMVC} from "../common/todomvc";

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
