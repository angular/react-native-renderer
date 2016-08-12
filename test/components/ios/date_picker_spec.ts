import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../../src/test_helpers/utils";
import {DatePicker} from "../../../src/components/ios/date_picker";

describe('DatePicker component (iOS)', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<DatePicker></DatePicker>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-datepicker+{"onChange":true,"height":216,"width":320},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<DatePicker [accessible]="true" testID="foo" [date]="0"></DatePicker>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-datepicker+{"onChange":true,"date":0,"accessible":true,"testID":"foo","height":216,"width":320},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<DatePicker [styleSheet]="20" [style]="{margin: 42}"></DatePicker>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-datepicker+{"onChange":true,"height":216,"width":320,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire change event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<DatePicker (change)="handleChange($event)"></DatePicker>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topChange', target, {timestamp: 42});

    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.log.join(',')).toEqual('42');
    });
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(DatePicker) datePicker: DatePicker;
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push(event.getTime());
  }
}