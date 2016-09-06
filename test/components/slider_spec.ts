import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../src/test_helpers/utils";
import {Slider} from "../../src/components/common/slider";

describe('Slider component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render', () => {
    initTest(TestComponent, `<Slider></Slider>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-slider+{"onSlidingComplete":true,"onValueChange":true,"disabled":false,"maximumValue":1,"minimumValue":0,"step":0},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<Slider [accessible]="true" testID="foo" value="0.6"></Slider>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-slider+{"onSlidingComplete":true,"onValueChange":true,"disabled":false,"maximumValue":1,"minimumValue":0,"step":0,"value":0.6,"accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<Slider [styleSheet]="20" [style]="{margin: 42}"></Slider>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-slider+{"onSlidingComplete":true,"onValueChange":true,"disabled":false,"maximumValue":1,"minimumValue":0,"step":0,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire change event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Slider (valueChange)="handleChange($event)"></Slider>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireFunctionalEvent('topChange', target, {value: 0.55, fromUser: true});

    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.log.join(',')).toEqual('0.55');
    });
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(Slider) slider: Slider;
  log: Array<boolean> = [];

  handleChange(event: any) {
    this.log.push(event);
  }
}