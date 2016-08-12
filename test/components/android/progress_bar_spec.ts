import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {ProgressBar} from "./../../../src/components/android/progress_bar";
import {configureTestingModule, initTest} from "../../../src/test_helpers/utils";

describe('ProgressBar component (Android)', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<ProgressBar>foo</ProgressBar>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-progressbar+{},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<ProgressBar [accessible]="true" testID="foo" styleAttr="{{'foo'}}">foo</ProgressBar>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-progressbar+{"styleAttr":"Normal","accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<ProgressBar [styleSheet]="20" [style]="{margin: 42}">foo</ProgressBar>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-progressbar+{"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(ProgressBar) progressBar: ProgressBar
}