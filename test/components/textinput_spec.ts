import {
  async, inject, beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {Component, ViewChild} from '@angular/core';
import {ReactNativeRootRenderer} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {TextInput} from "./../../src/components/textinput";
import {fireFunctionalEvent, getTestingProviders} from '../../src/test_helpers/utils';

describe('TextInput component', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should render', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<TextInput></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-textinput+{"mostRecentEventCount":0},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should render with properties', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<TextInput [accessible]="true" testID="foo" defaultValue="bar"></TextInput>
    <TextInput [accessible]="true" testID="foo" defaultValue="bar" value="{{'baz'}}"></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-textinput+{"mostRecentEventCount":0,"text":"bar","accessible":true,"testID":"foo"},' +
          'CREATE+4+native-textinput+{"mostRecentEventCount":0,"text":"baz","accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+2+4+1');
      });
  })));

  it('should render with styles', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<TextInput [styleSheet]="20" [style]="{width: 100}"></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-textinput+{"mostRecentEventCount":0,"flex":1,"collapse":true,"width":100},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should fire change event', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<TextInput value="bar" (change)="handleChange($event)"></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topChange', target, {text: "foo", eventCount: 1});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(fixture.componentInstance.log.join(',')).toEqual('foo');
            expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-textinput+{"mostRecentEventCount":1},UPDATE+3+native-textinput+{"text":"foo"}');
            resolve();
          }, 0);
        });

      });
  })));

  it('should dispatch commands', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<TextInput></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        fixture.componentInstance.textInput.focusTextInput();
        expect(mock.commandLogs.toString()).toEqual(
          'COMMAND+3+focusTextInput');
      });
  })));

  it('should autofocus', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<TextInput [autoFocus]="true"></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            fixture.detectChanges();
            expect(mock.commandLogs.toString()).toEqual('COMMAND+3+focusTextInput');
            resolve();
          }, 0);
        });
      });
  })));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [TextInput]
})
class TestComponent {
  @ViewChild(TextInput) textInput: TextInput;
  log: Array<boolean> = [];

  handleChange(state: boolean) {
    this.log.push(state);
  }
}