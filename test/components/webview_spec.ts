import {
  async, inject, beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {Component, ViewChild} from '@angular/core';
import {ReactNativeRootRenderer} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {WebView} from "./../../src/components/webview";
import {fireFunctionalEvent, getTestingProviders} from '../../src/test_helpers/utils';

describe('WebView component', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should render', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<WebView></WebView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-webview+{},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should render with properties', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<WebView automaticallyAdjustContentInsets="{{true}}" [source]="{uri: 'https://www.angular.io'}">foo</WebView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-webview+{"automaticallyAdjustContentInsets":true,"source":{"uri":"https://www.angular.io"}},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should render with styles', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<WebView [styleSheet]="20" [style]="{fontSize: 42}">foo</WebView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-webview+{"flex":1,"collapse":true,"fontSize":42},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should fire events', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<WebView (loadingFinish)="handleChange($event)"></WebView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topLoadingFinish', target, {title: 'foo'});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(fixture.componentInstance.log.join(',')).toEqual('foo');
            resolve();
          }, 150);
        });

      });
  })));

  it('should dispatch commands', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<WebView></WebView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        fixture.componentInstance.webView.goBack();
        expect(mock.commandLogs.toString()).toEqual(
          'COMMAND+3+goBack');
      });
  })));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [WebView]
})
class TestComponent {
  @ViewChild(WebView) webView: WebView
  log: Array<boolean> = [];

  handleChange(event: any) {
    this.log.push(event.title);
  }
}