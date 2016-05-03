import {
  async, inject, beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {NgIf, NgFor} from '@angular/common';
import {ReactNativeRootRenderer} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {Picker} from "../../src/components/picker";
import {View} from "./../../src/components/view";
import {Text} from './../../src/components/text';
import {getTestingProviders} from "../../src/testing";


describe('Component without host', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));


  it('should render', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View></View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0');
    });
  })));

  it('should support nesting', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View><View></View></View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  })));

  it('should support heavy nesting', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View><View><View><View><View></View></View></View></View></View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},' +
          'CREATE+5+native-view+{},CREATE+6+native-view+{},CREATE+7+native-view+{},' +
          'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+4+5+0,ATTACH+3+4+0');
      });
  })));

  it('should support sub-components', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View><sub></sub></View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+sub+{},CREATE+5+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+4+5+0,ATTACH+3+4+0');
      });
  })));

  it('should support ngIf', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View *ngIf="b"></View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0');

        mock.clearLogs();
        fixture.componentInstance.b = false;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('DETACH+2+0');

        mock.clearLogs();
        fixture.componentInstance.b = true;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('CREATE+4+native-view+{},ATTACH+2+4+0');
      });
  })));

  it('should support nested ngIf', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View> <View *ngIf="b"> </View> </View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');

        mock.clearLogs();
        fixture.componentInstance.b = false;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('DETACH+3+0');

        mock.clearLogs();
        fixture.componentInstance.b = true;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('CREATE+5+native-view+{},ATTACH+3+5+0');
      });
  })));

  it('should support ngFor', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View *ngFor="let item of a"></View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+2+4+1');

        mock.clearLogs();
        fixture.componentInstance.a.pop();
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('DETACH+2+1');
      });
  })));

  it('should support ngFor on an element next to a component', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View></View><native-view *ngFor="let item of a"></native-view>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},CREATE+5+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+2+4+1,ATTACH+2+5+2');

        mock.clearLogs();
        fixture.componentInstance.a.pop();
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('DETACH+2+2');
      });
  })));

  it('should support projection', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<proj><sub></sub><Text></Text></proj>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+proj+{},CREATE+4+native-text+{},CREATE+5+sub+{},CREATE+6+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1,ATTACH+5+6+0');
      });
  })));

  it('should support components with ngIf in their templates', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View></View><Picker></Picker>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-dialogpicker+{"items":[],"mode":"dialog","height":50},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+2+4+1');
      });
  })));

  it('should support sub-components with ngIf in their templates', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<sub-with-if></sub-with-if>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+sub-with-if+{},CREATE+4+native-view+{},CREATE+5+native-view+{},CREATE+6+native-text+{},' +
          'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+2,ATTACH+3+6+1');
      });
  })));

  it('should not attach twice components with ngIf in their templates', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View><View></View><Picker></Picker><View></View></View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},CREATE+5+native-view+{},CREATE+6+native-dialogpicker+{"items":[],"mode":"dialog","height":50},' +
          'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+2,ATTACH+3+6+1');
      });
  })));

});

@Component({
  selector: 'sub',
  template: `<View></View>`,
  directives: [View]
})
class SubComponent {
}
@Component({
  selector: 'sub-with-if',
  template: `<View></View><Text *ngIf="b"></Text><View></View>`,
  directives: [View, Text, NgIf]
})
class SubComponentWithIf {
  b: boolean = true;
}
@Component({
  selector: 'proj',
  template: `<ng-content select="Text"></ng-content><ng-content></ng-content>`
})
class SubComponentWithProjection {
}
@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [View, Picker, Text, SubComponent, SubComponentWithIf, SubComponentWithProjection, NgIf, NgFor]
})
class TestComponent {
  s: string = 'bar';
  b: boolean = true;
  a: Array<number> = [1,2];
  d: Array<Object> = [{a:0,b:1}, {a:8, b:9}];
  n: number = 20;

  handleEvent(evt: any) {
    this.b = false;
  }
}