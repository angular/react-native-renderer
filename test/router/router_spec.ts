import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, RouteConfig, LocationStrategy} from 'angular2/router';
import {ReactNativeRootRenderer} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {View} from "./../../src/components/view";
import {Text} from './../../src/components/text';
import {getTestingProviders} from "../../src/test_helpers/utils";


describe('Router', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));


  it('should render default route', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+router-outlet+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
        mock.clearLogs();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(mock.commandLogs.toString()).toEqual(
              'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+3+5+1');
            resolve();
          }, 0);
        });
      });
  }));

  it('should navigate to another route', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    var router: Router;
    return tcb.createAsync(TestComponent).then((fixture: ComponentFixture) => {
      router = fixture.componentInstance.router;
      fixture.detectChanges();
      rootRenderer.executeCommands();
      mock.clearLogs();

      return new Promise((resolve: any) => {
        setTimeout(() => {
          rootRenderer.executeCommands();
          expect(mock.commandLogs.toString()).toEqual(
            'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+3+5+1');
          mock.clearLogs();

          router.navigateByUrl('/b').then((_: any) => {
            rootRenderer.executeCommands();
            expect(mock.commandLogs.toString()).toEqual(
              'CREATE+8+cmp-b+{},CREATE+9+native-text+{},CREATE+10+native-rawtext+{"text":"b"},DETACH+3+1,ATTACH+3+8+1,ATTACH+9+10+0,ATTACH+8+9+0');
            resolve();
          });

        }, 0);
      });
    });
  }));

  it('should navigate back', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    var router: Router;
    var location: LocationStrategy;
    return tcb.createAsync(TestComponent).then((fixture: ComponentFixture) => {
      router = fixture.componentInstance.router;
      location = fixture.componentInstance.location;
      fixture.detectChanges();
      rootRenderer.executeCommands();
      mock.clearLogs();

      return new Promise((resolve: any) => {
        setTimeout(() => {
          rootRenderer.executeCommands();
          expect(mock.commandLogs.toString()).toEqual(
            'CREATE+5+cmp-a+{},CREATE+6+native-text+{},CREATE+7+native-rawtext+{"text":"a"},ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+3+5+1');
          mock.clearLogs();

          router.navigateByUrl('/b')
          .then((_: any) => {
            rootRenderer.executeCommands();
            expect(mock.commandLogs.toString()).toEqual(
              'CREATE+8+cmp-b+{},CREATE+9+native-text+{},CREATE+10+native-rawtext+{"text":"b"},DETACH+3+1,ATTACH+3+8+1,ATTACH+9+10+0,ATTACH+8+9+0');
            mock.clearLogs();
          })
          .then((_: any) => {
            location.back();
            setTimeout(() => {
              rootRenderer.executeCommands();
              expect(mock.commandLogs.toString()).toEqual(
                'CREATE+11+cmp-a+{},CREATE+12+native-text+{},CREATE+13+native-rawtext+{"text":"a"},DETACH+3+1,ATTACH+3+11+1,ATTACH+12+13+0,ATTACH+11+12+0');
              resolve();
            }, 30);
          });

        }, 0);
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

@Component({
  selector: 'test-cmp',
  template: `<View>
      <router-outlet></router-outlet>
    </View>`,
  directives: [View, ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: '/', component: CompA},
  {path: '/b', component: CompB}
])
class TestComponent {
  constructor(public router: Router, public location: LocationStrategy) {}
}