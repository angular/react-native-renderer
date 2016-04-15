import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component, ViewChild} from 'angular2/core';
import {ReactNativeRootRenderer} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {TextInput} from "./../../src/components/textinput";
import {fireFunctionalEvent, getTestingProviders} from '../../src/test_helpers/utils';

describe('TextInput component', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should render', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<TextInput></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-textinput+{},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<TextInput [accessible]="true" testID="foo" defaultValue="bar"></TextInput>
    <TextInput [accessible]="true" testID="foo" defaultValue="bar" value="{{'baz'}}"></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-textinput+{"text":"bar","accessible":true,"testID":"foo"},' +
          'CREATE+4+native-textinput+{"text":"baz","accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+2+4+1');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<TextInput [styleSheet]="20" [style]="{width: 100}"></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-textinput+{"flex":1,"collapse":true,"width":100},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should fire change event', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<TextInput value="bar" (change)="handleChange($event)"></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topChange', target, {text: "foo"});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(fixture.componentInstance.log.join(',')).toEqual('foo');
            expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-textinput+{"text":"bar"}');
            resolve();
          }, 150);
        });

      });
  }));

  it('should dispatch commands', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<TextInput></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        fixture.debugElement.componentInstance.textInput.focusTextInput();
        expect(mock.commandLogs.toString()).toEqual(
          'COMMAND+3+focusTextInput');
      });
  }));

  it('should autofocus', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<TextInput [autoFocus]="true"></TextInput>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            fixture.detectChanges();
            expect(mock.commandLogs.toString()).toEqual('COMMAND+3+focusTextInput');
            resolve();
          }, 150);
        });
      });
  }));

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