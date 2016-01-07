import {
  inject, injectAsync, TestComponentBuilder,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe
  expect
} from 'angular2/testing';
import {Component, Renderer, provide} from 'angular2/core';
import {NgIf, NgFor} from 'angular2/common';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRenderer, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../src/react_native_renderer';
import {MockReactNativeWrapper} from "./mock_react_native_wrapper";
import {fireEvent} from './utils';

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
    tcb.overrideTemplate(TestComponent, `<Text (tap)="handleEvent($event)" (tapstart)="handleEvent($event)" (tapcancel)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0,0]]);
      fireEvent('topTouchEnd', target, 1000, [[0,5]]);
      fixture.detectChanges();
      expect(fixture.componentInstance.log.join(',')).toEqual('tapstart,tap');

      fixture.componentInstance.log = [];
      fireEvent('topTouchStart', target, 0, [[0,0]]);
      fireEvent('topTouchEnd', target, 1000, [[0,20]]);
      fixture.detectChanges();
      expect(fixture.componentInstance.log.join(',')).toEqual('tapstart,tapcancel');
    });
  }));

  it('should support doubletap', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text (tap)="handleEvent($event)" (doubletap)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0);
      fireEvent('topTouchEnd', target, 10);
      fireEvent('topTouchStart', target, 20);
      fireEvent('topTouchEnd', target, 30);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('tap,tap,doubletap');
    });
  }));

  it('should support pan', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text (pan)="handleEvent($event)" (panstart)="handleEvent($event)" (panmove)="handleEvent($event)"
     (panend)="handleEvent($event)" (pancancel)="handleEvent($event)" (panleft)="handleEvent($event)"
     (panright)="handleEvent($event)" (panup)="handleEvent($event)" (pandown)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchMove', target, 20, [[50, 0]]);
      fireEvent('topTouchMove', target, 30, [[75, 0]]);
      fireEvent('topTouchEnd', target, 40, [[100, 0]]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('panstart,pan,panright,panmove,pan,panmove,pan,pan,panend');
    });
  }));

  it('should support swipe', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text (swipe)="handleEvent($event)" (swipeleft)="handleEvent($event)"
    (swiperight)="handleEvent($event)" (swipeup)="handleEvent($event)" (swipedown)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchMove', target, 20, [[50, 0]]);
      fireEvent('topTouchMove', target, 30, [[75, 0]]);
      fireEvent('topTouchEnd', target, 40, [[100, 0]]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('swiperight,swipe');
    });
  }));

  it('should support press', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (press)="handleEvent($event)" (pressup)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0);
      fixture.detectChanges();

      return new Promise((resolve) => {
        setTimeout(() => {
          fireEvent('topTouchEnd', target, 300);
          //fixture.detectChanges();
          expect(fixture.componentInstance.log.join(',')).toEqual('press,pressup');
          resolve();
        }, 300);
      });
    });
  }));

  it('should support pinch', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text (pinch)="handleEvent($event)" (pinchstart)="handleEvent($event)"
    (pinchmove)="handleEvent($event)" (pinchend)="handleEvent($event)" (pinchcancel)="handleEvent($event)"
    (pinchin)="handleEvent($event)" (pinchout)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0,0], [0, 150]], [0, 1]);
      fireEvent('topTouchMove', target, 10, [[0,0], [0, 100]], [1]);
      fireEvent('topTouchMove', target, 20, [[0,0], [0, 50]], [1]);
      fireEvent('topTouchEnd', target, 30, [[0,0], [0, 0]], [1]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('pinchstart,pinch,pinchin,pinchmove,pinch,pinchin,pinch,pinchin,pinchend');
    });
  }));

  it('should support rotate', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text (rotate)="handleEvent($event)" (rotatestart)="handleEvent($event)"
    (rotatemove)="handleEvent($event)" (rotateend)="handleEvent($event)" (rotatecancel)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0,0], [0, 150]], [0, 1]);
      fireEvent('topTouchMove', target, 10, [[0,0], [0, 100]], [1]);
      fireEvent('topTouchMove', target, 20, [[0,0], [0, 50]], [1]);
      fireEvent('topTouchEnd', target, 30, [[0,0], [0, 0]], [1]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('rotatestart,rotate,rotatemove,rotate,rotatemove,rotate,rotate,rotateend');
    });
  }));

  it('should support multiple gestures', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text (tap)="handleEvent($event)" (swipe)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchMove', target, 20, [[50, 0]]);
      fireEvent('topTouchMove', target, 30, [[75, 0]]);
      fireEvent('topTouchEnd', target, 40, [[100, 0]]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('swipe');
    });
  }));

  it('should support multiple gestures', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text (tap)="handleEvent($event)" (swipe)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchMove', target, 20, [[50, 0]]);
      fireEvent('topTouchMove', target, 30, [[75, 0]]);
      fireEvent('topTouchEnd', target, 40, [[100, 0]]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('swipe');
    });
  }));

  it('should always emit tap events', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text (pan)="handleEvent($event)" (tapstart)="handleEvent($event)" (tapcancel)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchEnd', target, 40, [[50, 0]]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('tapstart,pan,tapcancel,pan');
    });
  }));

  it('should add and remove event listeners', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text>foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.nativeElement.children[0];
      var handler = () => {};
      expect(target._hammer).toEqual(null);
      target.addEventListener('tap', handler);
      expect(target._hammer.recognizers.length).toEqual(1);
      target.addEventListener('swipe', handler);
      expect(target._hammer.recognizers.length).toEqual(2);
      target.addEventListener('swiperight', handler);
      expect(target._hammer.recognizers.length).toEqual(2);

      target.removeEventListener('swiperight', handler);
      expect(target._hammer.recognizers.length).toEqual(2);
      target.removeEventListener('tap', handler);
      expect(target._hammer.recognizers.length).toEqual(1);
      target.removeEventListener('swipe', handler);
      expect(target._hammer).toEqual(null);
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