import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {Image} from "../../src/components/image";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('Image component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<Image></Image>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-image+{"loadingIndicatorSrc":null,"src":null},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<Image [source]="{uri: 'icon.png'}"></Image>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-image+{"loadingIndicatorSrc":null,"src":[{"uri":"icon.png"}]},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<Image [styleSheet]="20" [style]="{fontSize: 42}"></Image>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-image+{"loadingIndicatorSrc":null,"src":null,"flex":1,"collapse":true,"fontSize":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire events', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Image (load)="handleChange($event)"></Image>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topLoad', target, {});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(fixture.componentInstance.log.join(',')).toEqual('foo');
    });
  });

  it('should support nested Image in Text', () => {
    initTest(TestComponent, `<Text>foo<Image></Image></Text>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-text+{},CREATE+4+native-rawtext+{"text":"foo"},CREATE+5+native-inlineimage+{"loadingIndicatorSrc":null,"src":null},' +
      'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(Image) image: Image
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push('foo');
  }
}