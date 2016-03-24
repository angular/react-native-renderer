import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect, MockApplicationRef
} from 'angular2/testing';
import {Component, RootRenderer, provide, Injector, ViewChild, ApplicationRef} from 'angular2/core';
import {Router, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, ROUTER_PRIMARY_COMPONENT, RouteConfig, LocationStrategy} from 'angular2/router';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {CustomTestComponentBuilder} from "../../../src/testing/test_component_builder";
import {View} from "../../../src/components/view";
import {Text} from '../../../src/components/text';
import {fireFunctionalEvent} from "../../utils";
import {Navigator} from "../../../src/components/ios/navigator";
import {ReactNativeLocationStrategy} from "../../../src/router/location_strategy";

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('Navigator component (iOS)', () => {

  beforeEach(() => {
    mock.reset();
  });
  beforeEachProviders(() => [
    provide(ApplicationRef, {useClass: MockApplicationRef}),
    ROUTER_PROVIDERS,
    provide(LocationStrategy, { useClass: ReactNativeLocationStrategy }),
    provide(ROUTER_PRIMARY_COMPONENT, {useValue: TestComponent}),
    provide(REACT_NATIVE_WRAPPER, {useValue: mock}),
    ReactNativeElementSchemaRegistry,
    provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
    provide(ReactNativeRootRenderer, {useClass: ReactNativeRootRenderer_}),
    provide(RootRenderer, {useExisting: ReactNativeRootRenderer}),
    CustomTestComponentBuilder,
    provide(TestComponentBuilder, {useExisting: CustomTestComponentBuilder})
  ]);


  it('should render with default route', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Navigator></Navigator>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},ATTACH+1+2+0');
        mock.clearLogs();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            fixture.detectChanges();
            rootRenderer.executeCommands();
            expect(mock.commandLogs.toString()).toEqual(
              'CREATE+3+native-navigator+{"onNavigationComplete":true,"flex":1},' +
              'CREATE+4+native-navitem+{"onLeftButtonPress":true,"onRightButtonPress":true,"title":"aaa","backgroundColor":"white","overflow":"hidden","position":"absolute","top":0,"left":0,"right":0,"bottom":64,"padding":37},' +
              'ATTACH+2+3+0,ATTACH+3+4+0');
            mock.clearLogs();

            setTimeout(() => {
              rootRenderer.executeCommands();
              expect(mock.commandLogs.toString()).toEqual(
                'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+4+5+0');
              resolve();
            }, 0);
          }, 30);
        });
      });
  }));

  it('should navigate to another route', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    var router: Router;
    return tcb.overrideTemplate(TestComponent, `<Navigator></Navigator>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        router = fixture.componentInstance.router;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            fixture.detectChanges();
            rootRenderer.executeCommands();
            mock.clearLogs();

            setTimeout(() => {
              fixture.detectChanges();
              rootRenderer.executeCommands();
              mock.clearLogs();

              router.navigateByUrl('/b').then((_: any) => {
                fixture.detectChanges();
                rootRenderer.executeCommands();
                mock.clearLogs();

                setTimeout(() => {
                  fixture.detectChanges();
                  rootRenderer.executeCommands();
                  expect(mock.commandLogs.toString()).toEqual(
                    'REQUEST_NAVIGATOR_LOCK+3+,UPDATE+3+native-navigator+{"requestedTopOfStack":1},' +
                    'CREATE+8+native-navitem+{"onLeftButtonPress":true,"onRightButtonPress":true,"title":"bbb","backgroundColor":"white","overflow":"hidden","position":"absolute","top":0,"left":0,"right":0,"bottom":64},' +
                    'ATTACH+3+8+1');
                  mock.clearLogs();

                  setTimeout(() => {
                    rootRenderer.executeCommands();
                    expect(mock.commandLogs.toString()).toEqual(
                      'CREATE+9+cmp-b+{},CREATE+10+native-text+{},CREATE+11+native-rawtext+{"text":"b"},ATTACH+10+11+0,ATTACH+9+10+0,ATTACH+8+9+0');
                    resolve();
                  }, 0);
                }, 100);
              });
            }, 100);
          }, 100);
        });
      });
  }));

  it('should navigate back', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    var router: Router;
    return tcb.overrideTemplate(TestComponent, `<Navigator></Navigator>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        router = fixture.componentInstance.router;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            fixture.detectChanges();
            rootRenderer.executeCommands();
            mock.clearLogs();

            setTimeout(() => {
              fixture.detectChanges();
              rootRenderer.executeCommands();
              mock.clearLogs();

              router.navigateByUrl('/b').then((_: any) => {
                fixture.detectChanges();
                rootRenderer.executeCommands();
                mock.clearLogs();

                setTimeout(() => {
                  fixture.detectChanges();
                  rootRenderer.executeCommands();
                  mock.clearLogs();

                  setTimeout(() => {
                    rootRenderer.executeCommands();
                    mock.clearLogs();

                    var target = fixture.elementRef.nativeElement.children[0].children[1];
                    fireFunctionalEvent('topNavigationComplete', target, {stackLength: 1});
                    fixture.detectChanges();
                    rootRenderer.executeCommands();
                    mock.clearLogs();

                    setTimeout(() => {
                      fixture.detectChanges();
                      rootRenderer.executeCommands();
                      expect(mock.commandLogs.toString()).toEqual(
                        'REQUEST_NAVIGATOR_LOCK+3+,UPDATE+3+native-navigator+{"requestedTopOfStack":0},DETACH+3+1');
                      resolve();
                    }, 100);
                  }, 0);
                }, 100);
              });
            }, 100);
          }, 100);
        });
      });
  }));

  it('should render with default route and custom styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Navigator [itemWrapperStyle]="{margin: 42}"></Navigator>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},ATTACH+1+2+0');
        mock.clearLogs();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            fixture.detectChanges();
            rootRenderer.executeCommands();
            expect(mock.commandLogs.toString()).toEqual(
              'CREATE+3+native-navigator+{"onNavigationComplete":true,"flex":1},' +
              'CREATE+4+native-navitem+{"onLeftButtonPress":true,"onRightButtonPress":true,"title":"aaa","backgroundColor":"white","overflow":"hidden","position":"absolute","top":0,"left":0,"right":0,"bottom":64,"margin":42,"padding":37},' +
              'ATTACH+2+3+0,ATTACH+3+4+0');
            mock.clearLogs();

            setTimeout(() => {
              rootRenderer.executeCommands();
              expect(mock.commandLogs.toString()).toEqual(
                'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+4+5+0');
              resolve();
            }, 0);
          }, 30);
        });
      });
  }));

  it('should fire button press events', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Navigator (leftButtonPress)="_handleEvent($event)"></Navigator>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            fixture.detectChanges();
            rootRenderer.executeCommands();
            mock.clearLogs();

            setTimeout(() => {
              rootRenderer.executeCommands();
              mock.clearLogs();

              var target = fixture.elementRef.nativeElement.children[0].children[1].children[2].children[0];
              fireFunctionalEvent('topLeftButtonPress', target, {});
              fixture.detectChanges();

              setTimeout(() => {
                expect(fixture.componentInstance.log.join(',')).toEqual('{"title":"aaa","wrapperStyle":{"padding":37}}');
                resolve();
              }, 30);
            }, 0);
          }, 30);
        });
      });
  }));


});

@Component({
  selector: 'cmp-a',
  template: `<Text>a</Text>`,
  directives: [Text]
})
export class CompA {}

@Component({
  selector: 'cmp-b',
  template: `<Text>b</Text>`,
  directives: [Text]
})
export class CompB {}

@RouteConfig([
  {path: '/', component: CompA, data: {title: 'aaa', wrapperStyle: {padding: 37}}},
  {path: '/b', component: CompB, data: {title: 'bbb'}}
])
@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [Navigator, View]
})
class TestComponent {
  @ViewChild(Navigator) navigator: Navigator;
  log: Array<any> = [];

  constructor(public router: Router) {}

  _handleEvent(event: any) {
    this.log.push(JSON.stringify(event.routeData.data));
  }
}