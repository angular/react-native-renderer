import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {WebView} from "../../src/components/common/webview";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('WebView component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<WebView></WebView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-webview+{},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<WebView automaticallyAdjustContentInsets="{{true}}" [source]="{uri: 'https://www.angular.io'}">foo</WebView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-webview+{"automaticallyAdjustContentInsets":true,"source":{"uri":"https://www.angular.io"}},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<WebView [styleSheet]="20" [style]="{fontSize: 42}">foo</WebView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-webview+{"flex":1,"collapse":true,"fontSize":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire events', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<WebView (loadingFinish)="handleChange($event)"></WebView>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topLoadingFinish', target, {title: 'foo'});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(fixture.componentInstance.log.join(',')).toEqual('foo');
    });
  });

  it('should dispatch commands', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<WebView></WebView>`);
    mock.clearLogs();

    fixture.componentInstance.webView.goBack();
    expect(mock.commandLogs.toString()).toEqual(
      'COMMAND+3+goBack');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(WebView) webView: WebView
  log: Array<boolean> = [];

  handleChange(event: any) {
    this.log.push(event.title);
  }
}