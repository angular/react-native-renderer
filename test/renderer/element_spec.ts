import {async, inject, addProviders} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {NgIf, NgFor} from '@angular/common';
import {ReactNativeRootRenderer} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {NativeElement} from "../../src/wrapper/wrapper_mock";
import {getTestingProviders} from "../../src/test_helpers/utils";


describe('Element', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    addProviders(getTestingProviders(mock, TestComponent));
  });

  it('should render element', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-text>foo</native-text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();

        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-text+{},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  })));

  it('should ignore invalid text nodes (only permitted in Text and VirtualText)', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
   var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-view> <native-view> {{s}} </native-view> a <native-view> b </native-view> {{s}} </native-view>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();

      return new Promise((resolve: any) => {
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},CREATE+5+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1');
        resolve();
      });
    });
  })));

  it('should render element with attributes', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-text fontSize="20">foo</native-text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-text+{"fontSize":20},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
    });
  })));

  it('should render element with style', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-text [style]="n">foo</native-text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-text+{"flex":1,"collapse":true},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
    });
  })));

  it('should render component', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-view><sub></sub></native-view>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+sub+{"flex":1},CREATE+5+native-text+{},CREATE+6+native-rawtext+{"text":"foo"},' +
        'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+4+5+0,ATTACH+5+6+0');
    });
  })));

  it('should render component with statement', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-view><sub *ngIf="b"></sub></native-view>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+sub+{"flex":1},CREATE+5+native-text+{},CREATE+6+native-rawtext+{"text":"foo"},' +
        'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+5+6+0,ATTACH+4+5+0,ATTACH+3+4+0');
    });
  })));

  it('should support interpolation', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-text>{{s}}</native-text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-text+{},CREATE+4+native-rawtext+{"text":"bar"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
    });
  })));

  it('should support binding to interpolated properties', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-text foo="{{s}}">foo</native-text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-text+{"foo":"bar"},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
    });
  })));

  it('should support binding to properties', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-text [fontSize]="n">foo</native-text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-text+{"fontSize":20},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
    });
  })));

  it('should support binding to attributes (same as interpolated properties)', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-text [attr.foo]="s">foo</native-text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-text+{"foo":"bar"},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
    });
  })));

  it('should support NgIf', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-text *ngIf="b">foo</native-text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-text+{},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+3+4+0,ATTACH+2+3+0');

      mock.clearLogs();
      fixture.componentInstance.b = false;
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual('DETACH+2+0');

      mock.clearLogs();
      fixture.componentInstance.b = true;
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual('CREATE+5+native-text+{},CREATE+6+native-rawtext+{"text":"foo"},ATTACH+5+6+0,ATTACH+2+5+0');
    });
  })));

  it('should support NgFor', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-text *ngFor="let item of a">{{item}}</native-text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a: NativeElement) => a.children[0].properties['text']).join(',')).toEqual('1,2,3');

      mock.clearLogs();
      fixture.componentInstance.a.splice(1, 1);
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual('DETACH+2+1'); //MOVE+2+1+1 is removed for optimization
      expect(mock.nativeElementMap.get(1).children[0].children.map((a: NativeElement) => a.children[0].properties['text']).join(',')).toEqual('1,3');

      fixture.componentInstance.a.pop();
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a: NativeElement) => a.children[0].properties['text']).join(',')).toEqual('1');

      fixture.componentInstance.a = [];
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a: NativeElement) => a.children[0].properties['text']).join(',')).toEqual('');

      fixture.componentInstance.a.push(8);
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a: NativeElement) => a.children[0].properties['text']).join(',')).toEqual('8');
    });
  })));

  it('should support NgFor in a <template> and with line return', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `
<native-view>
  <template ngFor let-item [ngForOf]="a">
    <native-text>{{item}}</native-text>
  </template>
</native-view>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children[0].children.map((a: NativeElement) => a.children[0].properties['text']).join(',')).toEqual('1,2,3');
    });
  })));

  it('should support NgFor with several children and right order', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<template ngFor let-item [ngForOf]="d"><native-text>{{item.a}}</native-text><native-text>{{item.b}}</native-text></template>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.nativeElementMap.get(1).children[0].children.map((a: NativeElement) => a.children[0].properties['text']).join(',')).toEqual('0,1,8,9');
    });
  })));

  it('should support ng-content', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<proj><native-text>foo</native-text><native-view></native-view></proj>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+proj+{},CREATE+4+native-view+{},CREATE+5+native-text+{},CREATE+6+native-rawtext+{"text":"foo"},' +
        'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1,ATTACH+5+6+0');
    });
  })));

  it('should support events', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<native-text *ngIf="b" (someEvent)="handleEvent($event)">foo</native-text>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-text+{},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+3+4+0,ATTACH+2+3+0');

      mock.clearLogs();
      fixture.elementRef.nativeElement.children[1].fireEvent('someEvent', {});

      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual('DETACH+2+0');
    });
  })));

});


@Component({
  selector: 'sub',
  host: {flex: '1'},
  template: `
<native-text>foo</native-text>
`
})
class SubComponent {
}
@Component({
  selector: 'proj',
  template: `<ng-content select="native-view"></ng-content><ng-content></ng-content>`
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
  d: Array<Object> = [{a:0,b:1}, {a:8, b:9}];
  n: number = 20;

  handleEvent(evt: any) {
    this.b = false;
  }
}