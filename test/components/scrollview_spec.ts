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
import {fireFunctionalEvent, getTestingProviders} from '../../src/test_helpers/utils';
import {ScrollView} from "../../src/components/scrollview";

describe('ScrollView component', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should render vertically', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<ScrollView></ScrollView>`)
    tcb.overrideTemplate(TestComponent, `<ScrollView></ScrollView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-scrollview+{"flexDirection":"column"},CREATE+4+native-view+{"collapsable":false,"flexDirection":null},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  })));

  it('should render horizontally', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<ScrollView horizontal="true"></ScrollView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-horizontalscrollview+{"horizontal":true,"flexDirection":"row"},CREATE+4+native-view+{"collapsable":false,"flexDirection":"row"},' +
          'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  })));

  it('should switch direction', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<ScrollView [horizontal]="isHorizontal"></ScrollView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-scrollview+{"horizontal":false,"flexDirection":"column"},CREATE+4+native-view+{"collapsable":false,"flexDirection":null},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');

        mock.clearLogs();
        fixture.componentInstance.isHorizontal = true;
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-horizontalscrollview+{"horizontal":true,"flexDirection":"row"},UPDATE+4+native-view+{"flexDirection":"row"}');
      });
  })));

  it('should render with properties', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<ScrollView scrollEnabled="{{false}}" removeClippedSubviews="true"></ScrollView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-scrollview+{"scrollEnabled":false,"flexDirection":"column","removeClippedSubviews":true},' +
          'CREATE+4+native-view+{"collapsable":false,"removeClippedSubviews":true,"flexDirection":null},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  })));

  it('should render with styles', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<ScrollView [styleSheet]="20" [style]="{fontSize: 42}" [contentContainerStyle]="20"></ScrollView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-scrollview+{"flexDirection":"column","flex":1,"collapse":true,"fontSize":42},' +
          'CREATE+4+native-view+{"collapsable":false,"flexDirection":null,"flex":1,"collapse":true},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  })));

  it('should fire scroll events', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<ScrollView (scroll)="handleChange($event)"></ScrollView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.autoDetectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[1];
        fireFunctionalEvent('topScroll', target, {title: 'foo'});

        fixture.whenStable().then(() => {
          rootRenderer.executeCommands();
          expect(fixture.componentInstance.log.join(',')).toEqual('foo');
        });

      });
  })));

  it('should dispatch commands', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<ScrollView></ScrollView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        fixture.componentInstance.scrollView.scrollTo(42);
        expect(mock.commandLogs.toString()).toEqual(
          'COMMAND+3+scrollTo+42');
      });
  })));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [ScrollView]
})
class TestComponent {
  @ViewChild(ScrollView) scrollView: ScrollView
  log: Array<any> = [];
  isHorizontal: boolean = false;

  handleChange(event: any) {
    this.log.push(event.title);
  }
}