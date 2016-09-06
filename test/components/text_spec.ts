import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {Text} from "../../src/components/common/text";
import {configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('Text component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<Text>foo</Text>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-text+{},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<Text [accessible]="true" testID="foo" selectable="{{true}}">foo</Text>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-text+{"accessible":true,"testID":"foo","selectable":true},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<Text [styleSheet]="20" [style]="{fontSize: 42}">foo</Text>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-text+{"flex":1,"collapse":true,"fontSize":42},CREATE+4+native-rawtext+{"text":"foo"},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
  });

  it('should support nested Text', () => {
    initTest(TestComponent, `<Text>foo<Text>bar</Text></Text>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-text+{},CREATE+4+native-rawtext+{"text":"foo"},CREATE+5+native-virtualtext+{},CREATE+6+native-rawtext+{"text":"bar"},' +
      'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1,ATTACH+5+6+0');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(Text) text: Text
}