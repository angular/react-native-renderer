import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {Toolbar} from "../../../src/components/android/toolbar";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../../src/test_helpers/utils";

describe('Toolbar component (Android)', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<Toolbar></Toolbar>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-toolbar+{"subtitle":null},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<Toolbar [accessible]="true" testID="foo" [actions]="[{title:'foo', icon: 'require(icon.png)', show: 'ifRoom'}]" rtl="{{true}}"></Toolbar>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-toolbar+{"nativeActions":[{"title":"foo","icon":"require(icon.png)","show":1}],"rtl":true,"subtitle":null,"accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<Toolbar [styleSheet]="20" [style]="{margin: 42}"></Toolbar>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-toolbar+{"subtitle":null,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire select event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Toolbar (select)="handleChange($event)"></Toolbar>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topSelect', target, {position: 1});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(fixture.componentInstance.log.join(',')).toEqual('1');
    });
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(Toolbar) toolbar: Toolbar
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push(event.position);
  }
}