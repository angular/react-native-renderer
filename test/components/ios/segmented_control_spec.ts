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
import {SegmentedControl} from "../../../src/components/ios/segmented_control";
import {fireFunctionalEvent, getTestingProviders} from "../../../src/test_helpers/utils";

describe('SegmentedControl component (iOS)', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should render', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<SegmentedControl></SegmentedControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-segmentedcontrol+{"onChange":true,"height":28},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<SegmentedControl [accessible]="true" testID="foo" [values]="['a','b']"></SegmentedControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-segmentedcontrol+{"onChange":true,"values":["a","b"],"accessible":true,"testID":"foo","height":28},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<SegmentedControl [styleSheet]="20" [style]="{margin: 42}"></SegmentedControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-segmentedcontrol+{"onChange":true,"height":28,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should fire change event', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<SegmentedControl (change)="handleChange($event)"></SegmentedControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topChange', target, {selectedSegmentIndex: 0, value: 'a'});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            expect(fixture.componentInstance.log.join(',')).toEqual('0');
            resolve();
          }, 30);
        });

      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [SegmentedControl]
})
class TestComponent {
  @ViewChild(SegmentedControl) segmentedControl: SegmentedControl;
  log: Array<boolean> = [];

  handleChange(event: any) {
    this.log.push(event.selectedIndex);
  }
}