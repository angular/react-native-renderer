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
import {Switch} from "./../../src/components/switch";
import {fireFunctionalEvent} from './../utils';

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('Switch component', () => {

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
    return tcb.overrideTemplate(TestComponent, `<Switch></Switch>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-switch+{"on":false,"enabled":true,"height":31,"width":51},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Switch [accessible]="true" testID="foo" thumbTintColor="#ABC123"></Switch>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-switch+{"on":false,"enabled":true,"accessible":true,"testID":"foo","height":31,"width":51},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Switch [styleSheet]="20" [style]="{width: 100}"></Switch>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-switch+{"on":false,"enabled":true,"height":31,"width":100,"flex":1,"collapse":true},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should fire change event', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Switch (change)="handleChange($event)"></Switch>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topChange', target, {value: true});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            expect(fixture.componentInstance.log.join(',')).toEqual('true');
            fixture.detectChanges();
            rootRenderer.executeCommands();
            expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-switch+{"on":true}');
            resolve();
          }, 30);
        });

      });
  }));
});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [Switch]
})
class TestComponent {
  @ViewChild(Switch) switch: Switch;
  log: Array<boolean> = [];

  handleChange(state: boolean) {
    this.log.push(state);
  }
}