import {Component, ModuleWithProviders} from "@angular/core";
import {fakeAsync, tick, getTestBed} from "@angular/core/testing";
import {Router, Routes} from "@angular/router";
import {LocationStrategy} from "@angular/common";
import {ReactNativeRouterTestingModule} from './../../src/test_helpers/router_testing_module';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('Router', () => {
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

  it('should render default route', fakeAsync(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><router-outlet></router-outlet></View>`);
    const router: Router = getTestBed().get(Router);
    router.initialNavigation();
    tick();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+router-outlet+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,' +
      'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+3+5+1');
  }));

  it('should navigate to another route', fakeAsync(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><router-outlet></router-outlet></View>`);
    const router: Router = getTestBed().get(Router);
    router.initialNavigation();
    tick();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+router-outlet+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,' +
      'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+3+5+1');
    mock.clearLogs();

    router.navigateByUrl('/b').then((_: any) => {
      tick();
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+8+cmp-b+{},CREATE+9+native-text+{},CREATE+10+native-rawtext+{"text":"b"},DETACH+3+1,ATTACH+3+8+1,ATTACH+9+10+0,ATTACH+8+9+0');
    });

  }));

  it('should navigate back', fakeAsync(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><router-outlet></router-outlet></View>`);
    const location: LocationStrategy = getTestBed().get(LocationStrategy);
    const router: Router = getTestBed().get(Router);
    router.initialNavigation();
    tick();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+router-outlet+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,' +
      'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+3+5+1');
    mock.clearLogs();

    router.navigateByUrl('/b')
      .then((_: any) => {
        tick();
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+8+cmp-b+{},CREATE+9+native-text+{},CREATE+10+native-rawtext+{"text":"b"},DETACH+3+1,ATTACH+3+8+1,ATTACH+9+10+0,ATTACH+8+9+0');
        mock.clearLogs();
      })
      .then((_: any) => {
        location.back();
        tick();
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+11+cmp-a+{},CREATE+12+native-text+{},CREATE+13+native-rawtext+{"text":"a"},DETACH+3+1,ATTACH+3+11+1,ATTACH+12+13+0,ATTACH+11+12+0');
      });
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
  template: 'to be overriden'
})
class TestComponent {}