import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {Switch} from "../../src/components/common/switch";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('Switch component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<Switch></Switch>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-switch+{"on":false,"enabled":true,"height":31,"width":51},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<Switch [accessible]="true" testID="foo" thumbTintColor="#ABC123"></Switch>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-switch+{"on":false,"enabled":true,"accessible":true,"testID":"foo","height":31,"width":51},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<Switch [styleSheet]="20" [style]="{width: 100}"></Switch>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-switch+{"on":false,"enabled":true,"height":31,"width":100,"flex":1,"collapse":true},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire change event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Switch (change)="handleChange($event)"></Switch>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topChange', target, {value: true});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-switch+{"on":true}');
    });
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(Switch) switch: Switch;
  log: Array<boolean> = [];

  handleChange(state: boolean) {
    this.log.push(state);
  }
}