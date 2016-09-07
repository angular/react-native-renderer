import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {View} from "../../src/components/common/view";
import {fireEvent, configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('Opacity feedback', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should change opacity during a tap', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View opacityFeedback></View>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireEvent('topTouchStart', target, 0, [[0, 0]]);
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'UPDATE+3+native-view+{"opacity":0.5}');
    mock.clearLogs();

    fireEvent('topTouchEnd', target, 40, [[100, 0]]);
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'UPDATE+3+native-view+{"opacity":1}');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(View) view: View
}