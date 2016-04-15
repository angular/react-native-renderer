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
import {fireFunctionalEvent, getTestingProviders} from "../../../src/test_helpers/utils";
import {MapView} from "../../../src/components/ios/map_view";

describe('DatePicker component (iOS)', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should render', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<MapView></MapView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-mapview+{"onChange":true,"onPress":false,"onAnnotationDragStateChange":false,"onAnnotationFocus":false,"onAnnotationBlur":false},' +
          'ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<MapView [accessible]="true" testID="foo" [annotations]="[{longitude:1, latitude: 2, tintColor: '#123456'}]"></MapView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-mapview+{"onChange":true,' +
          '"annotations":[{"longitude":1,"latitude":2,"tintColor":42,"id":"%7B%22longitude%22%3A1%2C%22latitude%22%3A2%2C%22tintColor%22%3A%22%23123456%22%7D"}],' +
          '"onPress":true,"onAnnotationDragStateChange":true,"onAnnotationFocus":true,"onAnnotationBlur":true,"accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<MapView [styleSheet]="20" [style]="{margin: 42}"></MapView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-mapview+{"onChange":true,"onPress":false,"onAnnotationDragStateChange":false,' +
          '"onAnnotationFocus":false,"onAnnotationBlur":false,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should fire change event', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<MapView (change)="handleChange($event)"></MapView>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topChange', target, {annotation: {}, action: 'click'});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            expect(fixture.componentInstance.log.join(',')).toEqual('click');
            resolve();
          }, 150);
        });

      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [MapView]
})
class TestComponent {
  @ViewChild(MapView) mapView: MapView;
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push(event.action);
  }
}