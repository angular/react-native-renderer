import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component, RootRenderer, provide, Injector, ViewChild} from 'angular2/core';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {CustomTestComponentBuilder} from "../../../src/testing/test_component_builder";
import {Toolbar} from "../../../src/components/android/toolbar";
import {fireFunctionalEvent} from './../../utils';

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('Toolbar component (Android)', () => {

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
    return tcb.overrideTemplate(TestComponent, `<Toolbar></Toolbar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-toolbar+{"subtitle":null},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Toolbar [accessible]="true" testID="foo" [actions]="[{title:'foo', icon: 'require(icon.png)', show: 'ifRoom'}]" rtl="{{true}}"></Toolbar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-toolbar+{"nativeActions":[{"title":"foo","icon":"require(icon.png)","show":1}],"rtl":true,"subtitle":null,"accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Toolbar [styleSheet]="20" [style]="{margin: 42}"></Toolbar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-toolbar+{"subtitle":null,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should fire select event', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Toolbar (select)="handleChange($event)"></Toolbar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topSelect', target, {position: 1});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(fixture.componentInstance.log.join(',')).toEqual('1');
            resolve();
          }, 30);
        });

      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [Toolbar]
})
class TestComponent {
  @ViewChild(Toolbar) toolbar: Toolbar
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push(event.position);
  }
}