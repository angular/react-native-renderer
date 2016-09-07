import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {RefreshControl} from "../../src/components/common/refresh_control";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('RefreshControl component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<RefreshControl></RefreshControl>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-refreshcontrol+{},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent,  `<RefreshControl refreshing="{{true}}"></RefreshControl>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-refreshcontrol+{"refreshing":true},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<RefreshControl [styleSheet]="20" [style]="{fontSize: 42}"></RefreshControl>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-refreshcontrol+{"flex":1,"collapse":true,"fontSize":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire events', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<RefreshControl (refresh)="handleChange($event)"></RefreshControl>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topRefresh', target, {});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(fixture.componentInstance.log.join(',')).toEqual('foo');
      expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-refreshcontrol+{"refreshing":false}');
    });
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(RefreshControl) refreshControl: RefreshControl
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push('foo');
  }
}