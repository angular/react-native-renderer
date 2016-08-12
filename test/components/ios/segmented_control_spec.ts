import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {SegmentedControl} from "../../../src/components/ios/segmented_control";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../../src/test_helpers/utils";

describe('SegmentedControl component (iOS)', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<SegmentedControl></SegmentedControl>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-segmentedcontrol+{"onChange":true,"height":28},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<SegmentedControl [accessible]="true" testID="foo" [values]="['a','b']"></SegmentedControl>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-segmentedcontrol+{"onChange":true,"values":["a","b"],"accessible":true,"testID":"foo","height":28},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<SegmentedControl [styleSheet]="20" [style]="{margin: 42}"></SegmentedControl>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-segmentedcontrol+{"onChange":true,"height":28,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire change event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<SegmentedControl (change)="handleChange($event)"></SegmentedControl>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topChange', target, {selectedSegmentIndex: 0, value: 'a'});

    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.log.join(',')).toEqual('0');
    });
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(SegmentedControl) segmentedControl: SegmentedControl;
  log: Array<boolean> = [];

  handleChange(event: any) {
    this.log.push(event.selectedIndex);
  }
}