import {Component} from '@angular/core';
import {Routes} from '@angular/router';
import {LocationStrategy} from '@angular/common';

@Component({
  selector: 'comp-a',
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

@Component({
  selector: 'example',
  template: `
<View [style]="{margin: 50}">
  <router-outlet></router-outlet>
</View>
  `
})
export class Example {}

const appRoutes: Routes = [
  { path: '', component: CompA },
  { path: 'b', component: CompB }
];