import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component, RootRenderer, provide, Injector, ViewChild} from 'angular2/core';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {CustomTestComponentBuilder} from "../../../src/testing/test_component_builder";
import {PagerLayout} from "../../../src/components/android/pager_layout";
import {View} from "../../../src/components/view";
import {fireFunctionalEvent} from './../../utils';

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('PagerLayout component (Android)', () => {

  beforeEach(() => {
    mock.reset();
  });
  beforeEachProviders(() => [
    provide(REACT_NATIVE_WRAPPER, {useValue: mock}),
    ReactNativeElementSchemaRegistry,
    provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
    provide(ReactNativeRootRenderer, {useClass: ReactNativeRootRenderer_}),
    provide(RootRenderer, {useExisting: ReactNativeRootRenderer}),
    CustomTestComponentBuilder,
    provide(TestComponentBuilder, {useExisting: CustomTestComponentBuilder})
  ]);


  it('should render', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<PagerLayout><View></View></PagerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-pagerlayout+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<PagerLayout [accessible]="true" testID="foo"></PagerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-pagerlayout+{"accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<PagerLayout [styleSheet]="20" [style]="{margin: 42}"></PagerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-pagerlayout+{"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should fire pageSelected event', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<PagerLayout (pageSelected)="handleChange($event)"></PagerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topPageSelected', target, {position: 1});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(fixture.componentInstance.log.join(',')).toEqual('1');
            resolve();
          }, 30);
        });

      });
  }));

  it('should dismiss keyboard on pageScroll event', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<PagerLayout keyboardDismissMode="on-drag"></PagerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topPageScroll', target, {offset: 0.75, position: 0});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(mock.commandLogs.toString()).toEqual('DISMISS_KEYBOARD+-1+');
            resolve();
          }, 30);
        });

      });
  }));

  it('should dispatch commands', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<PagerLayout></PagerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        fixture.debugElement.componentInstance.pagerLayout.setPage(1);
        expect(mock.commandLogs.toString()).toEqual('COMMAND+3+setPage+1');
      });
  }));

  it('should set initial page', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<PagerLayout [initialPage]="1"></PagerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            fixture.detectChanges();
            expect(mock.commandLogs.toString()).toEqual('COMMAND+3+setPageWithoutAnimation+1');
            resolve();
          }, 50);
        });
      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [PagerLayout, View]
})
class TestComponent {
  @ViewChild(PagerLayout) pagerLayout: PagerLayout
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push(event.position);
  }
}