import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component} from 'angular2/core';
import {Router, RouteConfig, LocationStrategy, RouterOutlet} from 'angular2/router';
import {ReactNativeRootRenderer} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {View} from "./../../src/components/view";
import {Text} from './../../src/components/text';
import {RouterLink} from "../../src/router/router_link";
import {fireGesture, getTestingProviders} from '../../src/test_helpers/utils';

describe('Router Link', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));


  it('should navigate', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
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
            mock.clearLogs();

            var target = fixture.elementRef.nativeElement.children[0];
            fireGesture('swipe', target);
            fixture.detectChanges();

            setTimeout(() => {
              rootRenderer.executeCommands();
              expect(mock.commandLogs.toString()).toEqual(
                'CREATE+8+cmp-b+{},CREATE+9+native-text+{},CREATE+10+native-rawtext+{"text":"b"},DETACH+3+1,ATTACH+3+8+1,ATTACH+9+10+0,ATTACH+8+9+0');
              resolve();
            }, 10);

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
  template: `<View [routerLink]="['/CompB']" event="swipe">
      <router-outlet></router-outlet>
    </View>`,
  directives: [View, RouterOutlet, RouterLink]
})
@RouteConfig([
  {path: '/', component: CompA, as: 'CompA'},
  {path: '/b', component: CompB, as: 'CompB'}
])
class TestComponent {
  constructor(public router: Router, public location: LocationStrategy) {}
}