import {Component, ViewChild, ModuleWithProviders} from "@angular/core";
import {fakeAsync, tick, getTestBed} from "@angular/core/testing";
import {Router, Routes} from "@angular/router";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../../src/test_helpers/utils";
import {Navigator} from "../../../src/components/ios/navigator";
import {ReactNativeRouterTestingModule} from './../../../src/test_helpers/router_testing_module';

describe('Navigator component (iOS)', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    const appRoutes: Routes = [
      {path: '', component: CompA, data: {title: 'aaa', wrapperStyle: {padding: 37}}},
      {path: 'b', component: CompB, data: {title: 'bbb'}}
    ];
    const routing: ModuleWithProviders = ReactNativeRouterTestingModule.withRoutes(appRoutes);
    configureTestingModule(mock, TestComponent, [CompA, CompB], [routing]);
  });

  it('should render with default route', fakeAsync(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Navigator></Navigator>`);
    const router: Router = getTestBed().get(Router);
    router.initialNavigation();
    tick();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+native-navigator+{"onNavigationComplete":true,"flex":1},' +
      'CREATE+4+native-navitem+{"onLeftButtonPress":true,"onRightButtonPress":true,"title":"aaa","backgroundColor":"white","overflow":"hidden","position":"absolute","top":0,"left":0,"right":0,"bottom":64,"padding":37},' +
      'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+4+5+0');
  }));

  it('should navigate to another route', fakeAsync(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Navigator></Navigator>`);
    const router: Router = getTestBed().get(Router);
    router.initialNavigation();
    tick();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    mock.clearLogs();

    router.navigateByUrl('/b').then((_: any) => {
      tick();
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'REQUEST_NAVIGATOR_LOCK+3+,UPDATE+3+native-navigator+{"requestedTopOfStack":1},' +
        'CREATE+8+native-navitem+{"onLeftButtonPress":true,"onRightButtonPress":true,"title":"bbb","backgroundColor":"white","overflow":"hidden","position":"absolute","top":0,"left":0,"right":0,"bottom":64},' +
        'CREATE+9+cmp-b+{},CREATE+10+native-text+{},CREATE+11+native-rawtext+{"text":"b"},ATTACH+3+8+1,ATTACH+10+11+0,ATTACH+9+10+0,ATTACH+8+9+0');
    });
  }));

  it('should navigate back', fakeAsync(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Navigator></Navigator>`);
    const router: Router = getTestBed().get(Router);
    router.initialNavigation();
    tick();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    mock.clearLogs();

    router.navigateByUrl('/b').then((_: any) => {
      tick();
      fixture.detectChanges();
      rootRenderer.executeCommands();
      mock.clearLogs();

      const target = fixture.nativeElement.children[0].children[0];
      fireFunctionalEvent('topNavigationComplete', target, {stackLength: 1});

      tick();
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'REQUEST_NAVIGATOR_LOCK+3+,UPDATE+3+native-navigator+{"requestedTopOfStack":0},DETACH+3+1');
    });
  }));

  it('should render with default route and custom styles', fakeAsync(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Navigator [itemWrapperStyle]="{margin: 42}"></Navigator>`);
    const router: Router = getTestBed().get(Router);
    router.initialNavigation();
    tick();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},ATTACH+1+2+0,' +
      'CREATE+3+native-navigator+{"onNavigationComplete":true,"flex":1},' +
      'CREATE+4+native-navitem+{"onLeftButtonPress":true,"onRightButtonPress":true,"title":"aaa","backgroundColor":"white","overflow":"hidden","position":"absolute","top":0,"left":0,"right":0,"bottom":64,"margin":42,"padding":37},' +
      'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+4+5+0');
  }));

  it('should fire button press events', fakeAsync(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Navigator (leftButtonPress)="_handleEvent($event)"></Navigator>`);
    const router: Router = getTestBed().get(Router);
    router.initialNavigation();
    tick();
    fixture.detectChanges();
    rootRenderer.executeCommands();

    const target = fixture.elementRef.nativeElement.children[0].children[0].children[2].children[0];
    fireFunctionalEvent('topLeftButtonPress', target, {});

    tick();
    fixture.detectChanges();
    expect(fixture.componentInstance.log.join(',')).toEqual('{"title":"aaa","wrapperStyle":{"padding":37}}');
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
  @ViewChild(Navigator) navigator: Navigator;
  log: Array<any> = [];

  constructor(public router: Router) {}

  _handleEvent(event: any) {
    this.log.push(JSON.stringify(event.routeConfig.data));
  }
}