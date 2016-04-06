import {TestComponentBuilder, MockApplicationRef} from 'angular2/testing';
import {RootRenderer, provide, ApplicationRef} from 'angular2/core';
import {ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT, LocationStrategy} from 'angular2/router';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../renderer/renderer';
import {CustomTestComponentBuilder} from "./test_component_builder";
import {ReactNativeLocationStrategy} from "../router/location_strategy";
import {ReactNativeWrapper} from "../wrapper/wrapper";
import {getAmbientComponents} from "../renderer/utils";
import {Node} from "../renderer/node";

export function getTestingProviders(mock: ReactNativeWrapper, testCpt: any): Array<any> {
  return [
    provide(ApplicationRef, {useClass: MockApplicationRef}),
    ROUTER_PROVIDERS,
    provide(LocationStrategy, { useClass: ReactNativeLocationStrategy }),
    provide(ROUTER_PRIMARY_COMPONENT, {useValue: testCpt}),
    provide(REACT_NATIVE_WRAPPER, {useValue: mock}),
    ReactNativeElementSchemaRegistry,
    provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
    provide(ReactNativeRootRenderer, {useClass: ReactNativeRootRenderer_}),
    provide(RootRenderer, {useExisting: ReactNativeRootRenderer}),
    CustomTestComponentBuilder,
    provide(TestComponentBuilder, {useExisting: CustomTestComponentBuilder})
  ].concat(getAmbientComponents());
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
