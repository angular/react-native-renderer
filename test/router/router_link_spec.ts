import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect, MockApplicationRef
} from 'angular2/testing';
import {Component, RootRenderer, provide, Injector, ViewChild, ApplicationRef} from 'angular2/core';
import {Router, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, ROUTER_PRIMARY_COMPONENT, RouteConfig, LocationStrategy, RouterOutlet} from 'angular2/router';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {CustomTestComponentBuilder} from "../../src/testing/test_component_builder";
import {View} from "./../../src/components/view";
import {Text} from './../../src/components/text';
import {ReactNativeLocationStrategy} from "../../src/router/location_strategy";
import {RouterLink} from "../../src/router/router_link";
import {fireEvent} from './../utils';

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('Router Link', () => {
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
            fireEvent('topTouchStart', target, 0, [[0, 0]]);
            fireEvent('topTouchMove', target, 10, [[25, 0]]);
            fireEvent('topTouchMove', target, 20, [[50, 0]]);
            fireEvent('topTouchMove', target, 30, [[75, 0]]);
            fireEvent('topTouchEnd', target, 40, [[100, 0]]);
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