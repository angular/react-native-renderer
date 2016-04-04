import {Component} from 'angular2/core';
import {RouteConfig, LocationStrategy} from 'angular2/router';
import {ROUTER_DIRECTIVES} from 'angular2-react-native';

@Component({
  selector: 'comp-a',
  directives: [ROUTER_DIRECTIVES],
  template: `<Text [routerLink]="['/CompB']" event="doubletap">Hello A</Text>`
})
class CompA {}

@Component({
  selector: 'comp-b',
  template: `<Text (tap)="_goBack()"> Hello B</Text>`
})
class CompB {
  constructor(private _locationStrategy: LocationStrategy) {}
  _goBack() {
    this._locationStrategy.back();
  }
}


@RouteConfig([
  { path: '/', component: CompA, as: 'CompA' },
  { path: '/b', component: CompB, as: 'CompB' },
])
@Component({
  selector: 'example',
  directives: [ROUTER_DIRECTIVES],
  template: `
<View [style]="{margin: 50}">
  <router-outlet></router-outlet>
</View>
  `
})
export class Example {}