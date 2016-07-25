import {async, inject, addProviders} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {Component, ViewChild} from '@angular/core';
import {ReactNativeRootRenderer} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {Switch} from "./../../src/components/switch";
import {fireFunctionalEvent, getTestingProviders} from '../../src/test_helpers/utils';

describe('Switch component', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    addProviders(getTestingProviders(mock, TestComponent));
  });

  it('should render', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Switch></Switch>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-switch+{"on":false,"enabled":true,"height":31,"width":51},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should render with properties', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Switch [accessible]="true" testID="foo" thumbTintColor="#ABC123"></Switch>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-switch+{"on":false,"enabled":true,"accessible":true,"testID":"foo","height":31,"width":51},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should render with styles', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Switch [styleSheet]="20" [style]="{width: 100}"></Switch>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-switch+{"on":false,"enabled":true,"height":31,"width":100,"flex":1,"collapse":true},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should fire change event', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Switch (change)="handleChange($event)"></Switch>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.autoDetectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topChange', target, {value: true});

        fixture.whenStable().then(() => {
          rootRenderer.executeCommands();
          expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-switch+{"on":true}');
        });

      });
  })));
});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [Switch]
})
class TestComponent {
  @ViewChild(Switch) switch: Switch;
  log: Array<boolean> = [];

  handleChange(state: boolean) {
    this.log.push(state);
  }
}