import {MockApplicationRef} from "./mock_application_ref";
import {RootRenderer, ApplicationRef, Sanitizer, CUSTOM_ELEMENTS_SCHEMA, NgZone} from "@angular/core";
import {TestBed, getTestBed, ComponentFixture} from "@angular/core/testing";
import {LocationStrategy} from "@angular/common";
import {ElementSchemaRegistry} from "@angular/compiler";
import {
  ReactNativeRootRenderer,
  ReactNativeRootRenderer_,
  ReactNativeElementSchemaRegistry,
  ReactNativeSanitizer,
  REACT_NATIVE_WRAPPER
} from "../renderer/renderer";
import {ReactNativeLocationStrategy} from "../router/location_strategy";
import {ReactNativeWrapper} from "../wrapper/wrapper";
import {Node} from "../renderer/node";
import {ReactNativeAndroidModule} from "../modules/android_module";
import {DatePicker} from "./../components/ios/date_picker";
import {MapView} from "./../components/ios/map_view";
import {Navigator, NavigatorItem} from "./../components/ios/navigator";
import {ProgressView} from "./../components/ios/progress_view";
import {SegmentedControl} from "./../components/ios/segmented_control";
import {TabBar} from "./../components/ios/tabbar";
import {TabBarItem} from "./../components/ios/tabbar_item";

export function configureTestingModule(mock: ReactNativeWrapper, testCpt: any, declarations: Array<any> = [], modules: Array<any> = []): typeof TestBed {
  const tb = TestBed.configureTestingModule({
    imports: [ReactNativeAndroidModule].concat(modules),
    providers: getTestingProviders(mock, testCpt),
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [DatePicker, MapView, Navigator, NavigatorItem, ProgressView, SegmentedControl, TabBar, TabBarItem, testCpt].concat(declarations)
  });
  //
  return tb;
}

export function initTest(testCpt: any, tpl: string): {fixture: ComponentFixture<any>, rootRenderer: ReactNativeRootRenderer} {
  TestBed.overrideComponent(testCpt, {set: {template: tpl}});
  const rootRenderer: ReactNativeRootRenderer = getTestBed().get(ReactNativeRootRenderer);
  rootRenderer.zone = getTestBed().get(NgZone);
  const fixture: ComponentFixture<any> = TestBed.createComponent(testCpt);
  fixture.autoDetectChanges();
  rootRenderer.executeCommands();
  return {fixture: fixture, rootRenderer: rootRenderer};
}

function getTestingProviders(mock: ReactNativeWrapper, testCpt: any): Array<any> {
  return [
    {provide: ApplicationRef, useClass: MockApplicationRef},
    {provide: LocationStrategy, useClass: ReactNativeLocationStrategy },
    {provide: REACT_NATIVE_WRAPPER, useValue: mock},
    ReactNativeElementSchemaRegistry,
    {provide: ElementSchemaRegistry, useExisting: ReactNativeElementSchemaRegistry},
    ReactNativeSanitizer,
    {provide: Sanitizer, useExisting: ReactNativeSanitizer},
    {provide: ReactNativeRootRenderer, useClass: ReactNativeRootRenderer_},
    {provide: RootRenderer, useExisting: ReactNativeRootRenderer}
  ];
}

export function fireEvent(name: string, target: Node, timeStamp: number = 0, touches: Array<Array<number>> = [[0,0]], changedIndices: Array<Number> = [0]) {
  var t: any[] = [];
  for (var i = 0; i < touches.length; i++) {
    t.push({clientX: touches[i][0], clientY: touches[i][1]});
  }
  var event = {
    type: name,
    clientX: touches[0][0],
    clientY: touches[0][1],
    touches: t,
    changedIndices: changedIndices,
    timeStamp: timeStamp,
    target: target,
    preventDefault: () => {},
    _stop: false
  };
  event['stopPropagation'] = () => {
    event._stop = true;
  };
  target.fireEvent(name, event);

}

export function fireFunctionalEvent(name: string, target: Node, data: any) {
  data._stop = true;
  data.type = name;
  data.target = target;
  target.fireEvent(name, data);
}

export function fireGesture(name: string, target: Node) {
  switch(name) {
    case 'tap':
      fireEvent('topTouchStart', target, 0);
      fireEvent('topTouchEnd', target, 10);
      break;
    case 'doubletap':
      fireEvent('topTouchStart', target, 0);
      fireEvent('topTouchEnd', target, 10);
      fireEvent('topTouchStart', target, 20);
      fireEvent('topTouchEnd', target, 30);
      break;
    case 'swipe':
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchMove', target, 20, [[50, 0]]);
      fireEvent('topTouchMove', target, 30, [[75, 0]]);
      fireEvent('topTouchEnd', target, 40, [[100, 0]]);
      break;
  }
}
