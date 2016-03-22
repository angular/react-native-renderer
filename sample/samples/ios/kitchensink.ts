import {Component} from 'angular2/core';
import {Router, RouteConfig, ComponentInstruction} from 'angular2/router';
import {StyleSheet} from 'react-native';
import {ROUTER_DIRECTIVES} from "react-native-renderer/react-native-renderer";

@Component({
  selector: 'foo',
  template: `<View [routerLink]="['/Bar']"><Text>Foo from here</Text></View>`,
  directives: [ROUTER_DIRECTIVES]
})
class Foo {}

@Component({
  selector: 'bar',
  template: `<View><Text>Bar from here</Text></View>`
})
class Bar {}

var moreLogo = require('../../assets/icon_more.png');

@RouteConfig([
  { path: '/', component: Foo, as: 'Foo', data: {title: 'foo!', rightButtonIcon: moreLogo, backButtonTitle: 'back'}},
  { path: '/bar', component: Bar, as: 'Bar', data: {title: 'bar!'} }
])
@Component({
  selector: 'kitchensink-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `<Navigator (rightButtonPress)="_navigate($event)"></Navigator>`
})
export class KitchenSinkApp {
  constructor(private router: Router) {
  }

  _navigate(event: ComponentInstruction) {
    this.router.navigateByUrl('/bar');
  }
}
