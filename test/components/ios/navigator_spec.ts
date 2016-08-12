import {Component, ViewChild} from "@angular/core";
import {async, getTestBed} from "@angular/core/testing";
import {Router, RouteConfig} from "@angular/router-deprecated";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../../src/test_helpers/utils";
import {Navigator} from "../../../src/components/ios/navigator";

describe('Navigator component (iOS)', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render with default route', async(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Navigator></Navigator>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},ATTACH+1+2+0');
    mock.clearLogs();

    setTimeout(() => {
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+3+native-navigator+{"onNavigationComplete":true,"flex":1},' +
        'CREATE+4+native-navitem+{"onLeftButtonPress":true,"onRightButtonPress":true,"title":"aaa","backgroundColor":"white","overflow":"hidden","position":"absolute","top":0,"left":0,"right":0,"bottom":64,"padding":37},' +
        'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+4+5+0');
    }, 150);
  }));

  it('should navigate to another route', async(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Navigator></Navigator>`);
    mock.clearLogs();
    const router: Router = getTestBed().get(Router);

    setTimeout(() => {
      router.navigateByUrl('/b').then((_: any) => {
        rootRenderer.executeCommands();
        mock.clearLogs();

        setTimeout(() => {
          rootRenderer.executeCommands();
          expect(mock.commandLogs.toString()).toEqual(
            'REQUEST_NAVIGATOR_LOCK+3+,UPDATE+3+native-navigator+{"requestedTopOfStack":1},' +
            'CREATE+8+native-navitem+{"onLeftButtonPress":true,"onRightButtonPress":true,"title":"bbb","backgroundColor":"white","overflow":"hidden","position":"absolute","top":0,"left":0,"right":0,"bottom":64},' +
            'CREATE+9+cmp-b+{},CREATE+10+native-text+{},CREATE+11+native-rawtext+{"text":"b"},ATTACH+10+11+0,ATTACH+9+10+0,ATTACH+3+8+1,ATTACH+8+9+0');
        }, 100);
      });
    }, 100);
  }));

  it('should navigate back', async(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Navigator></Navigator>`);
    mock.clearLogs();
    const router: Router = getTestBed().get(Router);

    setTimeout(() => {
      router.navigateByUrl('/b').then((_: any) => {
        setTimeout(() => {
          rootRenderer.executeCommands();
          mock.clearLogs();

          const target = fixture.nativeElement.children[0].children[1];
          fireFunctionalEvent('topNavigationComplete', target, {stackLength: 1});

          fixture.whenStable().then(() => {
            rootRenderer.executeCommands();
            expect(mock.commandLogs.toString()).toEqual(
              'REQUEST_NAVIGATOR_LOCK+3+,UPDATE+3+native-navigator+{"requestedTopOfStack":0},DETACH+3+1');
          });
        }, 100);
      });
    }, 100);
  }));

  it('should render with default route and custom styles', async(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Navigator [itemWrapperStyle]="{margin: 42}"></Navigator>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},ATTACH+1+2+0');
    mock.clearLogs();

    setTimeout(() => {
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+3+native-navigator+{"onNavigationComplete":true,"flex":1},' +
        'CREATE+4+native-navitem+{"onLeftButtonPress":true,"onRightButtonPress":true,"title":"aaa","backgroundColor":"white","overflow":"hidden","position":"absolute","top":0,"left":0,"right":0,"bottom":64,"margin":42,"padding":37},' +
        'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+4+5+0');
    }, 150);
  }));

  it('should fire button press events', async(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Navigator (leftButtonPress)="_handleEvent($event)"></Navigator>`);
    mock.clearLogs();

    setTimeout(() => {
      rootRenderer.executeCommands();
      mock.clearLogs();

      const target = fixture.elementRef.nativeElement.children[0].children[1].children[2].children[0];
      fireFunctionalEvent('topLeftButtonPress', target, {});

      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.log.join(',')).toEqual('{"title":"aaa","wrapperStyle":{"padding":37}}');
      });
    }, 150);
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
  {path: '/', component: CompA, data: {title: 'aaa', wrapperStyle: {padding: 37}}},
  {path: '/b', component: CompB, data: {title: 'bbb'}}
])
@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(Navigator) navigator: Navigator;
  log: Array<any> = [];

  constructor(public router: Router) {}

  _handleEvent(event: any) {
    this.log.push(JSON.stringify(event.routeData.data));
  }
}