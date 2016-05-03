import {
  async, inject, beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {Component, ViewChild} from '@angular/core';
import {ReactNativeRootRenderer} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {View} from "./../../src/components/view";
import {OpacityFeedback} from "../../src/directives/opacity_feedback";
import {fireEvent, getTestingProviders} from '../../src/test_helpers/utils';

describe('Opacity feedback', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should change opacity during a tap', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<View opacityFeedback></View>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
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
  })));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [View, OpacityFeedback]
})
class TestComponent {
  @ViewChild(View) view: View
}