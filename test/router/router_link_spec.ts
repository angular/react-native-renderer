import {Component} from "@angular/core";
import {async} from "@angular/core/testing";
import {Router, RouteConfig} from "@angular/router-deprecated";
import {LocationStrategy} from "@angular/common";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {fireGesture, configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('Router Link', () => {
  var mock:MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should navigate', async(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View [routerLink]="['/CompB']" event="swipe"><router-outlet></router-outlet></View>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual('CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+router-outlet+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
    mock.clearLogs();

    var target = fixture.elementRef.nativeElement.children[0];
    fireGesture('swipe', target);

    setTimeout(() => {
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},CREATE+8+cmp-b+{},CREATE+9+native-text+{},CREATE+10+native-rawtext+{"text":"b"},' +
        'ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+9+10+0,ATTACH+8+9+0,ATTACH+3+5+1,ATTACH+3+8+2');
    }, 30);

  }));
});

@Component({
  selector: 'cmp-a',
  template: `<Text>a</Text>`
})
export class CompA {}

@Component({
  selector: 'cmp-b',
  template: `<Text>b</Text>`
})
export class CompB {}

@RouteConfig([
  {path: '/', component: CompA, name: 'CompA'},
  {path: '/b', component: CompB, name: 'CompB'}
])
@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  constructor(public router: Router, public location: LocationStrategy) {}
}