import {
  injectAsync, TestComponentBuilder,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component, RootRenderer, provide, Injector} from 'angular2/core';
import {NgIf, NgFor} from 'angular2/common';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {View} from "./../../src/components/view"
import {CustomTestComponentBuilder} from "../../src/testing/test_component_builder";

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('Component without host', () => {

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
    return tcb.overrideTemplate(TestComponent, `<View></View>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},CREATE+3+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0');
    });
  }));

  it('should support nesting', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View><View></View></View>`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  }));

  it('should support heavy nesting', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View><View><View><View><View></View></View></View></View></View>`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},' +
          'CREATE+5+native-view+{},CREATE+6+native-view+{},CREATE+7+native-view+{},' +
          'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+4+5+0,ATTACH+3+4+0');
      });
  }));

  it('should support sub-components', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View><sub></sub></View>`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+sub+{},CREATE+5+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+4+5+0,ATTACH+3+4+0');
      });
  }));

  it('should support ngIf', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View *ngIf="b"></View>`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0');

        mock.clearLogs();
        fixture.debugElement.componentInstance.b = false;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('DETACH+2+0');

        mock.clearLogs();
        fixture.debugElement.componentInstance.b = true;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('CREATE+4+native-view+{},ATTACH+2+4+0');
      });
  }));

  it('should support nested ngIf', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View> <View *ngIf="b"> </View> </View>`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');

        mock.clearLogs();
        fixture.debugElement.componentInstance.b = false;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('DETACH+3+0');

        mock.clearLogs();
        fixture.debugElement.componentInstance.b = true;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('CREATE+5+native-view+{},ATTACH+3+5+0');
      });
  }));

  it('should support ngFor', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View *ngFor="#item of a"></View>`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+2+4+1');

        mock.clearLogs();
        fixture.debugElement.componentInstance.a.pop();
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('DETACH+2+1');
      });
  }));

  it('should support projection', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<proj><sub></sub><View></View></proj>`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+proj+{},CREATE+4+native-view+{},CREATE+5+sub+{},CREATE+6+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+5+6+0,ATTACH+3+5+1');
      });
  }));

});

@Component({
  selector: 'sub',
  template: `<View></View>`,
  directives: [View]
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
  directives: [View, SubComponent, SubComponentWithProjection, NgIf, NgFor]
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