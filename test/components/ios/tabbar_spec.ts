import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {TabBar} from "../../../src/components/ios/tabbar";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../../src/test_helpers/utils";

describe('TabBar component (iOS)', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<TabBar></TabBar>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-tabbar+{"flex":1},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<TabBar [accessible]="true" testID="foo" translucent="true"></TabBar>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-tabbar+{"translucent":true,"accessible":true,"testID":"foo","flex":1},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<TabBar [styleSheet]="20" [style]="{margin: 42}"></TabBar>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-tabbar+{"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with items', () => {
    initTest(TestComponent, `
    <TabBar>
      <TabBarItem selected="true"><View [style]="{margin: 1}"></View></TabBarItem>
      <TabBarItem><View [style]="{margin: 2}"></View></TabBarItem>
    </TabBar>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-tabbar+{"flex":1},CREATE+4+native-tabbaritem+{"onPress":true,"selected":true,"position":"absolute","top":0,"right":0,"bottom":0,"left":0},' +
      'CREATE+5+native-tabbaritem+{"onPress":true,"position":"absolute","top":0,"right":0,"bottom":0,"left":0},CREATE+6+native-view+{"margin":1},' +
      'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1,ATTACH+4+6+0');
  });

  it('should fire select event and switch tab', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `
    <TabBar>
      <TabBarItem [selected]="s == 1" (select)="s = 1"><View [style]="{margin: 1}"></View></TabBarItem>
      <TabBarItem [selected]="s == 2" (select)="s = 2"><View [style]="{margin: 2}"></View></TabBarItem>
    </TabBar>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[1].children[0].children[3].children[0];
    fireFunctionalEvent('topPress', target, {});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(fixture.componentInstance.s).toEqual(2);
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+7+native-view+{"margin":2},UPDATE+4+native-tabbaritem+{"selected":false},UPDATE+5+native-tabbaritem+{"selected":true},ATTACH+5+7+0');
    });
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(TabBar) tabBar: TabBar
  s: number = 1;
}