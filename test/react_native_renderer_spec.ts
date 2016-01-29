import {
  inject, TestComponentBuilder,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe
  expect
} from 'angular2/testing';
import {Component, RootRenderer, provide, Injector} from 'angular2/core';
import {NgIf, NgFor} from 'angular2/common';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../src/react_native_renderer';
import {MockReactNativeWrapper} from "./mock_react_native_wrapper";

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
var rootRenderer: ReactNativeRootRenderer = null;

describe('ReactNativeRenderer', () => {

  beforeEach(() => {
    mock.reset();
    rootRenderer = null;
  });
  beforeEachProviders(() => [
    provide(REACT_NATIVE_WRAPPER, {useValue: mock}),
    ReactNativeElementSchemaRegistry,
    provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
    provide(ReactNativeRootRenderer, {useClass: ReactNativeRootRenderer_}),
    provide(RootRenderer, {useExisting: ReactNativeRootRenderer})
  ]);


  it('should render element', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Text>foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0');
      });
  }));

  it('should ignore invalid text nodes (only permitted in Text and VirtualText)', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View> <View> {{s}} </View> a <View> b </View> {{s}} </View>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+View+{},ATTACH+2+3+0,CREATE+4+View+{},ATTACH+3+4+0,CREATE+5+View+{},ATTACH+3+5+1');
    });
  }));

  it('should render element with attributes', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Text fontSize="20">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{"fontSize":20},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0');
    });
  }));

  it('should render element with style', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Text [style]="n">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{"flex":1,"collapse":true},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0');
    });
  }));

  it('should render component', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View><sub></sub></View>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+View+{},ATTACH+2+3+0,' +
        'CREATE+4+sub+{"flex":1},ATTACH+3+4+0,CREATE+5+Text+{},ATTACH+4+5+0,CREATE+6+RawText+{"text":"foo"},ATTACH+5+6+0');
    });
  }));

  it('should render component with statement', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View><sub *ngIf="b"></sub></View>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+View+{},ATTACH+2+3+0,CREATE+4+sub+{"flex":1},CREATE+5+Text+{},CREATE+6+RawText+{"text":"foo"},ATTACH+5+6+0,ATTACH+4+5+0,ATTACH+3+4+0');
    });
  }));

  it('should support interpolation', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Text>{{s}}</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},ATTACH+2+3+0,CREATE+4+RawText+{"text":"bar"},ATTACH+3+4+0');
    });
  }));

  it('should support binding to interpolated properties', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Text foo="{{s}}">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{"foo":"bar"},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0');
    });
  }));

  it('should support binding to properties', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Text [fontSize]="n">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{"fontSize":20},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0');
    });
  }));

  xit('should support binding to attributes (same as interpolated properties)', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Text [attr.foo]="s">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{"foo":"bar"},ATTACH+2+3+0,CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0');
    });
  }));

  it('should support NgIf', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Text *ngIf="b">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0,ATTACH+2+3+0');

      mock.clearLogs();
      fixture.debugElement.componentInstance.b = false;
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual('DETACH+2+0');

      mock.clearLogs();
      fixture.debugElement.componentInstance.b = true;
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual('CREATE+5+Text+{},CREATE+6+RawText+{"text":"foo"},ATTACH+5+6+0,ATTACH+2+5+0');
    });
  }));

  it('should support NgFor', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Text *ngFor="#item of a">{{item}}</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('1,2,3');

      fixture.debugElement.componentInstance.a.pop();
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('1,2');

      fixture.debugElement.componentInstance.a = [];
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('');

      fixture.debugElement.componentInstance.a.push(8);
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('8');
    });
  }));

  it('should support NgFor in a <template> and with line return', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<template ngFor #item [ngForOf]="a">
    <Text>{{item}}</Text>
    </template>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('1,2,3');
    });
  }));

  it('should support NgFor with several children and right order', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<template ngFor #item [ngForOf]="d"><Text>{{item.a}}</Text><Text>{{item.b}}</Text></template>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a) => a.children[0].properties['text']).join(',')).toEqual('0,1,8,9');
    });
  }));

  it('should support ng-content', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<proj><Text>foo</Text><View></View></proj>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+proj+{},ATTACH+2+3+0,' +
        'CREATE+4+View+{},ATTACH+3+4+0,CREATE+5+Text+{},CREATE+6+RawText+{"text":"foo"},ATTACH+5+6+0,ATTACH+3+5+1');
    });
  }));

  it('should support events', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Text *ngIf="b" (someEvent)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+Text+{},CREATE+4+RawText+{"text":"foo"},ATTACH+3+4+0,ATTACH+2+3+0');

      mock.clearLogs();
      fixture.debugElement.nativeElement.children[1].fireEvent('someEvent', {});

      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual('DETACH+2+0');
    });
  }));

});


@Component({
  selector: 'sub',
  host: {flex: '1'},
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