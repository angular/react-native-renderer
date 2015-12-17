import {
  inject, TestComponentBuilder,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe
  expect
} from 'angular2/testing';
import {Component, Renderer, provide} from 'angular2/core';
import {NgIf, NgFor} from 'angular2/common';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRenderer, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../src/react_native_renderer';
import {MockReactNativeWrapper, fireEvent} from "./mock_react_native_wrapper";

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('ReactNativeRenderer', () => {

  beforeEach(() => {
    mock.reset();
  });
  beforeEachProviders(() => [
    provide(REACT_NATIVE_WRAPPER, {useValue: mock}),
    ReactNativeElementSchemaRegistry,
    provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
    ReactNativeRenderer,
    provide(Renderer, {useExisting: ReactNativeRenderer})
  ]);

  it('should support tap', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text (tap)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target);
      fireEvent('topTouchEnd', target);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('tap');
    });
  }));

  it('should support doubletap', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text (tap)="handleEvent($event)" (doubletap)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target);
      fireEvent('topTouchEnd', target);
      fireEvent('topTouchStart', target);
      fireEvent('topTouchEnd', target);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('tap,tap,doubletap');
    });
  }));

});



@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [NgIf, NgFor]
})
class TestComponent {
  log: Array<string> = [];

  handleEvent(evt) {
    this.log.push(evt.type);
  }
}