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
import {Picker} from "./../../src/components/picker";
import {fireFunctionalEvent} from './../utils';

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('Picker component', () => {

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


  it('should render in dialog mode', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Picker></Picker>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-dialogpicker+{"items":[],"mode":"dialog","height":50},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render in dropdown mode', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Picker mode="dropdown"></Picker>`o)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-dropdownpicker+{"items":[],"mode":"dropdown","height":50},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Picker [items]="[{label:'a',value:0},{label:'b',value:1}]"></Picker>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-dialogpicker+{"items":[{"label":"a","value":0},{"label":"b","value":1}],"mode":"dialog","height":50},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Picker [styleSheet]="20" [style]="{height: 100}"></Picker>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-dialogpicker+{"items":[],"mode":"dialog","height":100,"flex":1,"collapse":true},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should fire select event', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Picker (select)="handleChange($event)"></Picker>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[2];
        fireFunctionalEvent('topSelect', target, {position: 0});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            expect(fixture.componentInstance.log.join(',')).toEqual('0');
            fixture.detectChanges();
            rootRenderer.executeCommands();
            expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-dialogpicker+{"selected":0}');
            resolve();
          }, 30);
        });

      });
  }));
});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [Picker]
})
class TestComponent {
  @ViewChild(Picker) picker: Picker;
  log: Array<any> = [];

  handleChange(value: any) {
    this.log.push(value);
  }
}