import {async} from "@angular/core/testing";
import {Component} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {fireEvent, configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('Hammer', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should support tap', () => {
    const {fixture, rootRenderer} = initTest(TestComponent,
      `<native-text (tap)="handleEvent($event)" (tapstart)="handleEvent($event)" (tapcancel)="handleEvent($event)">foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
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

  it('should support doubletap', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<native-text (tap)="handleEvent($event)" (doubletap)="handleEvent($event)">foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
    fireEvent('topTouchStart', target, 0);
    fireEvent('topTouchEnd', target, 10);
    fireEvent('topTouchStart', target, 20);
    fireEvent('topTouchEnd', target, 30);
    fixture.detectChanges();

    expect(fixture.componentInstance.log.join(',')).toEqual('tap,tap,doubletap');
  });

  it('should support pan', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<native-text (pan)="handleEvent($event)" (panstart)="handleEvent($event)" (panmove)="handleEvent($event)"
     (panend)="handleEvent($event)" (pancancel)="handleEvent($event)" (panleft)="handleEvent($event)"
     (panright)="handleEvent($event)" (panup)="handleEvent($event)" (pandown)="handleEvent($event)">foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
    fireEvent('topTouchStart', target, 0, [[0, 0]]);
    fireEvent('topTouchMove', target, 10, [[25, 0]]);
    fireEvent('topTouchMove', target, 20, [[50, 0]]);
    fireEvent('topTouchMove', target, 30, [[75, 0]]);
    fireEvent('topTouchEnd', target, 40, [[100, 0]]);
    fixture.detectChanges();

    expect(fixture.componentInstance.log.join(',')).toEqual('panstart,pan,panright,panmove,pan,panmove,pan,pan,panend');
  });

  it('should support swipe', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<native-text (swipe)="handleEvent($event)" (swipeleft)="handleEvent($event)"
    (swiperight)="handleEvent($event)" (swipeup)="handleEvent($event)" (swipedown)="handleEvent($event)">foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
    fireEvent('topTouchStart', target, 0, [[0, 0]]);
    fireEvent('topTouchMove', target, 10, [[25, 0]]);
    fireEvent('topTouchMove', target, 20, [[50, 0]]);
    fireEvent('topTouchMove', target, 30, [[75, 0]]);
    fireEvent('topTouchEnd', target, 40, [[100, 0]]);
    fixture.detectChanges();

    expect(fixture.componentInstance.log.join(',')).toEqual('swiperight,swipe');
  });

  it('should support press', async(() => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<native-text (press)="handleEvent($event)" (pressup)="handleEvent($event)">foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
    fireEvent('topTouchStart', target, 0);
    fixture.detectChanges();

    setTimeout(() => {
      fireEvent('topTouchEnd', target, 300);
      expect(fixture.componentInstance.log.join(',')).toEqual('press,pressup');
    }, 300);
  }));

  it('should support pinch', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<native-text (pinch)="handleEvent($event)" (pinchstart)="handleEvent($event)"
    (pinchmove)="handleEvent($event)" (pinchend)="handleEvent($event)" (pinchcancel)="handleEvent($event)"
    (pinchin)="handleEvent($event)" (pinchout)="handleEvent($event)">foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
    fireEvent('topTouchStart', target, 0, [[0,0], [0, 150]], [0, 1]);
    fireEvent('topTouchMove', target, 10, [[0,0], [0, 100]], [1]);
    fireEvent('topTouchMove', target, 20, [[0,0], [0, 50]], [1]);
    fireEvent('topTouchEnd', target, 30, [[0,0], [0, 0]], [1]);
    fixture.detectChanges();

    expect(fixture.componentInstance.log.join(',')).toEqual('pinchstart,pinch,pinchin,pinchmove,pinch,pinchin,pinch,pinchin,pinchend');
  });

  it('should support rotate', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<native-text (rotate)="handleEvent($event)" (rotatestart)="handleEvent($event)"
    (rotatemove)="handleEvent($event)" (rotateend)="handleEvent($event)" (rotatecancel)="handleEvent($event)">foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
    fireEvent('topTouchStart', target, 0, [[0,0], [0, 150]], [0, 1]);
    fireEvent('topTouchMove', target, 10, [[0,0], [0, 100]], [1]);
    fireEvent('topTouchMove', target, 20, [[0,0], [0, 50]], [1]);
    fireEvent('topTouchEnd', target, 30, [[0,0], [0, 0]], [1]);
    fixture.detectChanges();

    expect(fixture.componentInstance.log.join(',')).toEqual('rotatestart,rotate,rotatemove,rotate,rotatemove,rotate,rotate,rotateend');
  });

  it('should support multiple gestures', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<native-text (tap)="handleEvent($event)" (swipe)="handleEvent($event)">foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
    fireEvent('topTouchStart', target, 0, [[0, 0]]);
    fireEvent('topTouchMove', target, 10, [[25, 0]]);
    fireEvent('topTouchMove', target, 20, [[50, 0]]);
    fireEvent('topTouchMove', target, 30, [[75, 0]]);
    fireEvent('topTouchEnd', target, 40, [[100, 0]]);
    fixture.detectChanges();

    expect(fixture.componentInstance.log.join(',')).toEqual('swipe');
  });

  it('should support multiple gestures', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<native-text (tap)="handleEvent($event)" (swipe)="handleEvent($event)">foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
    fireEvent('topTouchStart', target, 0, [[0, 0]]);
    fireEvent('topTouchMove', target, 10, [[25, 0]]);
    fireEvent('topTouchMove', target, 20, [[50, 0]]);
    fireEvent('topTouchMove', target, 30, [[75, 0]]);
    fireEvent('topTouchEnd', target, 40, [[100, 0]]);
    fixture.detectChanges();

    expect(fixture.componentInstance.log.join(',')).toEqual('swipe');
  });

  it('should always emit tap events', () => {
    const {fixture, rootRenderer} = initTest(TestComponent,
      `<native-text (pan)="handleEvent($event)" (tapstart)="handleEvent($event)" (tapcancel)="handleEvent($event)">foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
    fireEvent('topTouchStart', target, 0, [[0, 0]]);
    fireEvent('topTouchMove', target, 10, [[25, 0]]);
    fireEvent('topTouchEnd', target, 40, [[50, 0]]);
    fixture.detectChanges();

    expect(fixture.componentInstance.log.join(',')).toEqual('tapstart,pan,tapcancel,pan');
  });

  it('should add and remove event listeners', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<native-text>foo</native-text>`);

    const target = fixture.elementRef.nativeElement.children[0];
    const handler = () => {};
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

  it('should propagates event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<native-view (tap)="handleEvent($event)"><native-text (tap)="handleEvent($event)">foo</native-text></native-view>`);

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireEvent('topTouchStart', target, 0, [[0,0]]);
    fireEvent('topTouchEnd', target, 1000, [[0,5]]);
    fixture.detectChanges();
    expect(fixture.componentInstance.log.join(',')).toEqual('tap,tap');
  });

  it('should not propagate events after stopPropagation() call', () => {
    const {fixture, rootRenderer} = initTest(TestComponent,
      `<native-view (tap)="handleEvent($event)"><native-text (tap)="handleEventWithStop($event)">foo</native-text></native-view>`);

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireEvent('topTouchStart', target, 0, [[0,0]]);
    fireEvent('topTouchEnd', target, 1000, [[0,5]]);
    fixture.detectChanges();
    expect(fixture.componentInstance.log.join(',')).toEqual('tapWithStop');
  });

});



@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  log: Array<string> = [];

  handleEvent(evt: any) {
    this.log.push(evt.type);
  }

  handleEventWithStop(evt: any) {
    this.log.push(evt.type + 'WithStop');
    evt.stopPropagation();
  }
}