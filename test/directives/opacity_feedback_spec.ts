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
import {View} from "./../../src/components/view";
import {OpacityFeedback} from "../../src/directives/opacity_feedback";
import {fireEvent} from './../utils';

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('Opacity feedback', () => {

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


  it('should change opacity during a tap', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View opacityFeedback></View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireEvent('topTouchStart', target, 0, [[0, 0]]);
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'UPDATE+3+native-view+{"opacity":0.5}');
        mock.clearLogs();

        fireEvent('topTouchEnd', target, 40, [[100, 0]]);
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'UPDATE+3+native-view+{"opacity":1}');
      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [View, OpacityFeedback]
})
class TestComponent {
  @ViewChild(View) view: View
}