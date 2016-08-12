import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {View} from "./../../../src/components/view";
import {fireEvent, configureTestingModule, initTest} from "../../../src/test_helpers/utils";

describe('Ripple feedback', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should send commands during a tap', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View rippleFeedback></View>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[0];
    fireEvent('topTouchStart', target, 0, [[50, 0]]);
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'COMMAND+3+hotspotUpdate+50,0,COMMAND+3+setPressed+true');
    mock.clearLogs();

    fireEvent('topTouchEnd', target, 40, [[100, 0]]);
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'COMMAND+3+hotspotUpdate+100,0,COMMAND+3+setPressed+false');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(View) view: View
}