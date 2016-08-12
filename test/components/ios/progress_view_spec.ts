import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {ProgressView} from "../../../src/components/ios/progress_view";
import {configureTestingModule, initTest} from "../../../src/test_helpers/utils";

describe('ProgressView component (iOS)', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });


  it('should render', () => {
    initTest(TestComponent, `<ProgressView></ProgressView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-progressview+{"height":2},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<ProgressView [accessible]="true" testID="foo" progress="0.6"></ProgressView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-progressview+{"progress":0.6,"accessible":true,"testID":"foo","height":2},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<ProgressView [styleSheet]="20" [style]="{margin: 42}"></ProgressView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-progressview+{"height":2,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(ProgressView) progressView: ProgressView
}