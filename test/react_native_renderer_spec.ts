import {
  injectAsync, TestComponentBuilder, inject
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe
  expect
} from 'angular2/testing';
import {Component, View, Renderer, provide, NgIf, NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault} from 'angular2/angular2';
import {ReactNativeRenderer} from '../src/react_native_renderer.ts';

var result: Object;

describe('ReactNativeRenderer', () => {

  beforeEach(() => {
    result = {};
  });
  beforeEachProviders(() => [
    ReactNativeRenderer,
    provide(Renderer, {useExisting: ReactNativeRenderer})
  ]);


  it('should render text', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `foo`)
      .createAsync(TestComponent).then(() => {
        expect(result.richText).toEqual('foo');
      });
  }));

  it('should render element', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `<a>foo</a>`)
      .createAsync(TestComponent).then(() => {
        expect(result.richText).toEqual('<a>foo</a>');
      });
  }));

  it('should render element with attributes', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `<a c="d" e="f">foo</a>`)
      .createAsync(TestComponent).then(() => {
        expect(result.richText).toEqual('<a c="d" e="f">foo</a>');
      });
  }));

  it('should render component', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `1<sub></sub>2`)
      .createAsync(TestComponent).then(() => {
        expect(result.richText).toEqual('1sub2');
      });
  }));

  it('should support interpolation', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `1{{s}}2`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        expect(result.richText).toEqual('1bar2');
      });
  }));

  it('should not support binding to interpolated properties', inject([TestComponentBuilder], (tcb) => {
    expect(tcb.overrideTemplate(TestComponent, `<a b="{{s}}">foo</a>`)
      .createAsync(TestComponent).then(() => {})).toThrowErrorWith("");
  }));

  it('should not support binding to properties', inject([TestComponentBuilder], (tcb) => {
    expect(tcb.overrideTemplate(TestComponent, `<a [b]="s">foo</a>`)
      .createAsync(TestComponent).then(() => {})).toThrowErrorWith("");
  }));

  it('should support binding to attributes', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `<a [attr.b]="s">foo</a>`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        expect(result.richText).toEqual('<a b="bar">foo</a>');

        fixture.debugElement.componentInstance.s = 'baz';
        fixture.detectChanges();
        expect(result.richText).toEqual('<a b="baz">foo</a>');
      });
  }));

  it('should support NgIf', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `1<a *ng-if="b">foo</a>2`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        expect(result.richText).toEqual('1<a>foo</a>2');

        fixture.debugElement.componentInstance.b = false;
        fixture.detectChanges();
        expect(result.richText).toEqual('12');
      });
  }));

  it('should support NgFor', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `0<template ng-for #item [ng-for-of]="a">{{item}}</template>4`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        expect(result.richText).toEqual('01234');

        fixture.debugElement.componentInstance.a.pop();
        fixture.detectChanges();
        expect(result.richText).toEqual('0124');

        fixture.debugElement.componentInstance.a = [];
        fixture.detectChanges();
        expect(result.richText).toEqual('04');

        fixture.debugElement.componentInstance.a.push(8);
        fixture.detectChanges();
        expect(result.richText).toEqual('084');
      });
  }));

  it('should support NgFor with several children and right order', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `-<template ng-for #item [ng-for-of]="d"><a>{{item.a}}</a><b>{{item.b}}</b></template>-`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        expect(result.richText).toEqual('-<a>0</a><b>1</b><a>8</a><b>9</b>-');
      });
  }));

  it('should support ng-content', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `-<proj><a>a</a><b>b</b></proj>-`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        expect(result.richText).toEqual('-0<b>b</b>1<a>a</a>2-');
      });
  }));

});

@Component({
  selector: 'sub',
  template: `sub`
})
class SubComponent {
}
@Component({
  selector: 'proj',
  template: `0<ng-content select="b"></ng-content>1<ng-content></ng-content>2`
})
class SubComponentWithProjection {
}
@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [SubComponent, SubComponentWithProjection, NgIf, NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault]
})
class TestComponent {
  s: string = 'bar';
  b: boolean = true;
  a: Array<number> = [1,2,3];
  d: Array<Object> = [{a:0,b:1}, {a:8, b:9}]
  n: number = 0;
}