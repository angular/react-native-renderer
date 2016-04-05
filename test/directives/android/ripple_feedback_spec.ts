import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component, ViewChild} from 'angular2/core';
import {ReactNativeRootRenderer} from '../../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {View} from "./../../../src/components/view";
import {RippleFeedback} from "../../../src/directives/android/ripple_feedback";
import {fireEvent, getTestingProviders} from '../../../src/test_helpers/utils';

describe('Ripple feedback', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should send commands during a tap', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View rippleFeedback></View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
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
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [View, RippleFeedback]
})
class TestComponent {
  @ViewChild(View) view: View
}