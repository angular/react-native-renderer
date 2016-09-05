import {Component, ModuleWithProviders} from "@angular/core";
import {fakeAsync, tick, getTestBed} from "@angular/core/testing";
import {Router, Routes} from "@angular/router";
import {LocationStrategy} from "@angular/common";
import {ReactNativeRouterTestingModule} from './../../src/test_helpers/router_testing_module';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {fireGesture, configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('Router Link', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

  beforeEach(() => {
    mock.reset();
    const appRoutes: Routes = [
      {path: '', component: CompA},
      {path: 'b', component: CompB}
    ];
    const routing: ModuleWithProviders = ReactNativeRouterTestingModule.withRoutes(appRoutes);
    configureTestingModule(mock, TestComponent, [CompA, CompB], [routing]);
  });

  it('should navigate', fakeAsync(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View routerLink="/b" event="swipe"><router-outlet></router-outlet></View>`);
    const router: Router = getTestBed().get(Router);
    router.initialNavigation();
    tick();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual('CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+router-outlet+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+3+5+1');
    mock.clearLogs();

    var target = fixture.elementRef.nativeElement.children[0];
    fireGesture('swipe', target);

    tick();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+8+cmp-b+{},CREATE+9+native-text+{},CREATE+10+native-rawtext+{"text":"b"},DETACH+3+1,ATTACH+3+8+1,ATTACH+9+10+0,ATTACH+8+9+0');

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

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  constructor(public router: Router, public location: LocationStrategy) {}
}