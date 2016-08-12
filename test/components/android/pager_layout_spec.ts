import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {PagerLayout} from "../../../src/components/android/pager_layout";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../../src/test_helpers/utils";

describe('PagerLayout component (Android)', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<PagerLayout><View></View></PagerLayout>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-pagerlayout+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<PagerLayout [accessible]="true" testID="foo"></PagerLayout>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-pagerlayout+{"accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<PagerLayout [styleSheet]="20" [style]="{margin: 42}"></PagerLayout>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-pagerlayout+{"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire pageSelected event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<PagerLayout (pageSelected)="handleChange($event)"></PagerLayout>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topPageSelected', target, {position: 1});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(fixture.componentInstance.log.join(',')).toEqual('1');
    });
  });

  it('should dismiss keyboard on pageScroll event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<PagerLayout keyboardDismissMode="on-drag"></PagerLayout>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topPageScroll', target, {offset: 0.75, position: 0});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual('DISMISS_KEYBOARD+-1+');
    });
  });

  it('should dispatch commands', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<PagerLayout></PagerLayout>`);
    mock.clearLogs();

    fixture.componentInstance.pagerLayout.setPage(1);
    expect(mock.commandLogs.toString()).toEqual('COMMAND+3+setPage+1');
  });

  it('should set initial page', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<PagerLayout [initialPage]="1"></PagerLayout>`);
    mock.clearLogs();

    fixture.whenStable().then(() => {
      expect(mock.commandLogs.toString()).toEqual('COMMAND+3+setPageWithoutAnimation+1');
    });
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(PagerLayout) pagerLayout: PagerLayout
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push(event.position);
  }
}