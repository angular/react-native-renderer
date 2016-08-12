import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactNativeModule} from 'angular2-react-native';
import {KitchenSinkApp}   from './kitchensink';

import {TodoMVC, TodoItem} from '../common/todomvc';
import {Ball} from '../common/animation';

@NgModule({
  declarations: [KitchenSinkApp, TodoMVC, TodoItem, Ball],
  imports: [ReactNativeModule, CommonModule],
  bootstrap: [KitchenSinkApp]
})
export class KitchenSinkModule {}
