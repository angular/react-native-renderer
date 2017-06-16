import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {DrawerLayout} from "../../../src/components/android/drawer_layout";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../../src/test_helpers/utils";

describe('DrawerLayout component (Android)', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<DrawerLayout drawerWidth="250"><DrawerLayoutSide><View></View></DrawerLayoutSide><DrawerLayoutContent><View></View></DrawerLayoutContent></DrawerLayout>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-drawerlayout+{"drawerWidth":250},CREATE+4+native-view+{"bottom":0,"collapsable":false,"left":0,"position":"absolute","right":0,"top":0},' +
      'CREATE+5+native-view+{"bottom":0,"collapsable":false,"position":"absolute","top":0,"width":250},CREATE+6+native-view+{},CREATE+7+native-view+{},' +
      'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1,ATTACH+4+6+0,ATTACH+5+7+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<DrawerLayout [accessible]="true" testID="foo" drawerPosition="left"></DrawerLayout>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-drawerlayout+{"drawerPosition":-1,"accessible":true,"testID":"foo"},' +
      'CREATE+4+native-view+{"bottom":0,"collapsable":false,"left":0,"position":"absolute","right":0,"top":0},' +
      'CREATE+5+native-view+{"bottom":0,"collapsable":false,"position":"absolute","top":0},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<DrawerLayout [styleSheet]="20" [style]="{margin: 42}"></DrawerLayout>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-drawerlayout+{"flex":1,"collapse":true,"margin":42},' +
      'CREATE+4+native-view+{"bottom":0,"collapsable":false,"left":0,"position":"absolute","right":0,"top":0},' +
      'CREATE+5+native-view+{"bottom":0,"collapsable":false,"position":"absolute","top":0},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1');
  });

  it('should fire drawerSlide event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<DrawerLayout (drawerSlide)="handleChange($event)"></DrawerLayout>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topDrawerSlide', target, {position: 1});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(fixture.componentInstance.log.join(',')).toEqual('1');
    });
  });

  it('should dismiss keyboard on drawerSlide event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<DrawerLayout keyboardDismissMode="on-drag"></DrawerLayout>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topDrawerSlide', target, {offset: 0.75, position: 0});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual('DISMISS_KEYBOARD+-1+');
    });
  });

  it('should dispatch commands', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<DrawerLayout></DrawerLayout>`);
    mock.clearLogs();

    fixture.componentInstance.drawerLayout.closeDrawer();
    expect(mock.commandLogs.toString()).toEqual(
      'COMMAND+3+closeDrawer');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(DrawerLayout) drawerLayout: DrawerLayout;
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push(event.position);
  }
}