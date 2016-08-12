import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {TextInput} from "./../../src/components/textinput";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('TextInput component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<TextInput></TextInput>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-textinput+{"mostRecentEventCount":0},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<TextInput [accessible]="true" testID="foo" defaultValue="bar"></TextInput>
    <TextInput [accessible]="true" testID="foo" defaultValue="bar" value="{{'baz'}}"></TextInput>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-textinput+{"mostRecentEventCount":0,"text":"bar","accessible":true,"testID":"foo"},' +
      'CREATE+4+native-textinput+{"mostRecentEventCount":0,"text":"baz","accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+2+4+1');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<TextInput [styleSheet]="20" [style]="{width: 100}"></TextInput>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-textinput+{"mostRecentEventCount":0,"flex":1,"collapse":true,"width":100},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire change event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<TextInput value="bar" (change)="handleChange($event)"></TextInput>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topChange', target, {text: "foo", eventCount: 1});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(fixture.componentInstance.log.join(',')).toEqual('foo');
      expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-textinput+{"mostRecentEventCount":1},UPDATE+3+native-textinput+{"text":"foo"}');
    });

  });

  it('should dispatch commands', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<TextInput></TextInput>`);
    mock.clearLogs();

    fixture.componentInstance.textInput.focusTextInput();
    expect(mock.commandLogs.toString()).toEqual(
      'COMMAND+3+focusTextInput');
  });

  it('should autofocus', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<TextInput [autoFocus]="true"></TextInput>`);
    mock.clearLogs();

    fixture.whenStable().then(() => {
      expect(mock.commandLogs.toString()).toEqual('COMMAND+3+focusTextInput');
    });
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(TextInput) textInput: TextInput;
  log: Array<boolean> = [];

  handleChange(state: boolean) {
    this.log.push(state);
  }
}