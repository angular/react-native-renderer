import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {View} from "../../src/components/common/view";
import {configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('View component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<View></View>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<View [accessible]="true" testID="foo" pointerEvents="{{'foo'}}" collapsable="true" shouldRasterizeIOS="true"></View>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{"accessible":true,"testID":"foo","pointerEvents":"auto","collapsable":true},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<View [styleSheet]="20" [style]="{margin: 42}"></View>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should dispatch commands', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View></View>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0');

    mock.clearLogs();
    fixture.componentInstance.view.setPressed(true);
    expect(mock.commandLogs.toString()).toEqual(
      'COMMAND+3+setPressed+true');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(View) view: View
}