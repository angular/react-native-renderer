import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component, RootRenderer, provide, Injector, ViewChild} from 'angular2/core';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {CustomTestComponentBuilder} from "../../src/testing/test_component_builder";
import {RefreshControl} from "../../src/components/refresh_control";
import {fireFunctionalEvent} from './../utils';

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('RefreshControl component', () => {

  beforeEach(() => {
    mock.reset();
  });
  beforeEachProviders(() => [
    provide(REACT_NATIVE_WRAPPER, {useValue: mock}),
    ReactNativeElementSchemaRegistry,
    provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
    provide(ReactNativeRootRenderer, {useClass: ReactNativeRootRenderer_}),
    provide(RootRenderer, {useExisting: ReactNativeRootRenderer}),
    CustomTestComponentBuilder,
    provide(TestComponentBuilder, {useExisting: CustomTestComponentBuilder})
  ]);


  it('should render', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<RefreshControl></RefreshControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-refreshcontrol+{},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<RefreshControl refreshing="{{true}}"></RefreshControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-refreshcontrol+{"refreshing":true},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<RefreshControl [styleSheet]="20" [style]="{fontSize: 42}"></RefreshControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-refreshcontrol+{"flex":1,"collapse":true,"fontSize":42},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should fire events', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<RefreshControl (refresh)="handleChange($event)"></RefreshControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topRefresh', target, {});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(fixture.componentInstance.log.join(',')).toEqual('foo');
            expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-refreshcontrol+{"refreshing":false}');
            resolve();
          }, 30);
        });

      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [RefreshControl]
})
class TestComponent {
  @ViewChild(RefreshControl) refreshControl: RefreshControl
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push('foo');
  }
}