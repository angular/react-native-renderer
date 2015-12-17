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
import {MockReactNativeWrapper} from "./mock_react_native_wrapper";

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


  it('should render element', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text>foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0');
      });
  }));

  it('should render element with attributes', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text fontSize="20">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{"fontSize":20},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0');
    });
  }));

  it('should render component', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<View><sub></sub></View>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+View+{},ATTACH+2+3+0,' +
        'CREATE+4+sub+{},ATTACH+3+4+0,CREATE+5+Text+{},ATTACH+4+5+0,CREATE+6+RawText+{"text":"foo"},ATTACH+5+6+0');
    });
  }));

  it('should support interpolation', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text>{{s}}</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},ATTACH+2+3+0,' +
        'CREATE+4+RawText+{"text":""},ATTACH+3+4+0,UPDATE+4+RawText+{"text":"bar"}');
    });
  }));

  it('should support binding to interpolated properties', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text foo="{{s}}">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0,' +
        'UPDATE+3+Text+{"foo":"bar"}');
    });
  }));

  it('should support binding to properties', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text [fontSize]="n">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0,' +
        'UPDATE+3+Text+{"fontSize":20}');
    });
  }));

  it('should support binding to attributes (same as interpolated properties)', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text [attr.foo]="s">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0,' +
        'UPDATE+3+Text+{"foo":"bar"}');
    });
  }));

  it('should support NgIf', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text *ngIf="b">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0,ATTACH+2+3+0');

      mock.clearLogs();
      fixture.debugElement.componentInstance.b = false;
      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual('DETACH+2+0');
    });
  }));

  it('should support NgFor', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text *ngFor="#item of a">{{item}}</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('1,2,3');

      fixture.debugElement.componentInstance.a.pop();
      fixture.detectChanges();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('1,2');

      fixture.debugElement.componentInstance.a = [];
      fixture.detectChanges();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('');

      fixture.debugElement.componentInstance.a.push(8);
      fixture.detectChanges();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('8');
    });
  }));

  it('should support NgFor with several children and right order', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<template ngFor #item [ngForOf]="d"><Text>{{item.a}}</Text><Text>{{item.b}}</Text></template>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('0,1,8,9');
    });
  }));

  it('should support ng-content', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<proj><Text>foo</Text><View></View></proj>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+proj+{},ATTACH+2+3+0,' +
        'CREATE+4+Text+{},CREATE+5+RawText+{"text":"foo"},ATTACH+4+5+0,CREATE+6+View+{},' +
        'ATTACH+3+6+0,ATTACH+3+4+1');
    });
  }));

  it('should support events', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.overrideTemplate(TestComponent, `<Text *ngIf="b" (someEvent)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0,ATTACH+2+3+0');

      mock.clearLogs();
      fixture.debugElement.nativeElement.children[1].fireEvent('someEvent', {});

      fixture.detectChanges();
      expect(mock.commandLogs.toString()).toEqual('DETACH+2+0');
    });
  }));

});


@Component({
  selector: 'sub',
  template: `<Text>foo</Text>`
})
class SubComponent {
}
@Component({
  selector: 'proj',
  template: `<ng-content select="View"></ng-content><ng-content></ng-content>`
})
class SubComponentWithProjection {
}
@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [SubComponent, SubComponentWithProjection, NgIf, NgFor]
})
class TestComponent {
  s: string = 'bar';
  b: boolean = true;
  a: Array<number> = [1,2,3];
  d: Array<Object> = [{a:0,b:1}, {a:8, b:9}]
  n: number = 20;

  handleEvent(evt) {
    this.b = false;
  }
}