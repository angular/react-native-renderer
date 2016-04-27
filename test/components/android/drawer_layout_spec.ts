import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component, ViewChild} from 'angular2/core';
import {ReactNativeRootRenderer} from '../../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {DrawerLayout, DrawerLayoutSide, DrawerLayoutContent} from "../../../src/components/android/drawer_layout";
import {View} from "../../../src/components/view";
import {fireFunctionalEvent, getTestingProviders} from '../../../src/test_helpers/utils';

describe('DrawerLayout component (Android)', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should render', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<DrawerLayout drawerWidth="250"><DrawerLayoutSide><View></View></DrawerLayoutSide><DrawerLayoutContent><View></View></DrawerLayoutContent></DrawerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-drawerlayout+{"drawerWidth":250},CREATE+4+native-view+{"bottom":0,"collapsable":false,"left":0,"position":"absolute","right":0,"top":0},' +
          'CREATE+5+native-view+{},CREATE+6+native-view+{"bottom":0,"collapsable":false,"position":"absolute","top":0,"width":250},CREATE+7+native-view+{},' +
          'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+6+1,ATTACH+4+5+0,ATTACH+6+7+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<DrawerLayout [accessible]="true" testID="foo" drawerPosition="left"></DrawerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-drawerlayout+{"drawerPosition":-1,"accessible":true,"testID":"foo"},' +
          'CREATE+4+native-view+{"bottom":0,"collapsable":false,"left":0,"position":"absolute","right":0,"top":0},' +
          'CREATE+5+native-view+{"bottom":0,"collapsable":false,"position":"absolute","top":0},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<DrawerLayout [styleSheet]="20" [style]="{margin: 42}"></DrawerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-drawerlayout+{"flex":1,"collapse":true,"margin":42},' +
          'CREATE+4+native-view+{"bottom":0,"collapsable":false,"left":0,"position":"absolute","right":0,"top":0},' +
          'CREATE+5+native-view+{"bottom":0,"collapsable":false,"position":"absolute","top":0},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1');
      });
  }));

  it('should fire drawerSlide event', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<DrawerLayout (drawerSlide)="handleChange($event)"></DrawerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topDrawerSlide', target, {position: 1});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(fixture.componentInstance.log.join(',')).toEqual('1');
            resolve();
          }, 150);
        });

      });
  }));

  it('should dismiss keyboard on drawerSlide event', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<DrawerLayout keyboardDismissMode="on-drag"></DrawerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topDrawerSlide', target, {offset: 0.75, position: 0});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(mock.commandLogs.toString()).toEqual('DISMISS_KEYBOARD+-1+');
            resolve();
          }, 150);
        });

      });
  }));

  it('should dispatch commands', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<DrawerLayout></DrawerLayout>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        fixture.componentInstance.drawerLayout.closeDrawer();
        expect(mock.commandLogs.toString()).toEqual(
          'COMMAND+3+closeDrawer');
      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [DrawerLayout, DrawerLayoutSide, DrawerLayoutContent, View]
})
class TestComponent {
  @ViewChild(DrawerLayout) drawerLayout: DrawerLayout;
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push(event.position);
  }
}