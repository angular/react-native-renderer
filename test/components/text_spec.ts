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
import {Text} from "./../../src/components/text";

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('Text component', () => {

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
    return tcb.overrideTemplate(TestComponent, `<Text>foo</Text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-text+{},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Text [accessible]="true" testID="foo" allowFontScaling="{{true}}">foo</Text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-text+{"accessible":true,"testID":"foo"},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Text [styleSheet]="20" [style]="{fontSize: 42}">foo</Text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-text+{"flex":1,"collapse":true,"fontSize":42},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  }));

  it('should support nested Text', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<Text>foo<Text>bar</Text></Text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-text+{},CREATE+4+native-rawtext+{"text":"foo"},CREATE+5+native-virtualtext+{},CREATE+6+native-rawtext+{"text":"bar"},' +
          'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+5+6+0,ATTACH+3+5+1');
      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [Text]
})
class TestComponent {
  @ViewChild(Text) text: Text
}