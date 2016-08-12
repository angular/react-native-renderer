import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "../../src/wrapper/wrapper_mock";
import {ActivityIndicator} from "../../src/components/activity_indicator";
import {configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('ActivityIndicator component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<ActivityIndicator>foo</ActivityIndicator>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-activityindicator+{"indeterminate":true,"styleAttr":"Normal","animating":true,"hidesWhenStopped":true,"height":20,"width":20},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<ActivityIndicator [accessible]="true" testID="foo" size="{{'large'}}">foo</ActivityIndicator>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-activityindicator+{"indeterminate":true,"styleAttr":"Normal","animating":true,"hidesWhenStopped":true,"size":"large","accessible":true,"testID":"foo","height":36,"width":36},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<ActivityIndicator [styleSheet]="20" [style]="{margin: 42}">foo</ActivityIndicator>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-activityindicator+{"indeterminate":true,"styleAttr":"Normal","animating":true,"hidesWhenStopped":true,"height":20,"width":20,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(ActivityIndicator) activityIndicator: ActivityIndicator
}