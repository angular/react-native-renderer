'use strict';



var AppRegistry = require('AppRegistry');
var shims = require('es6-shim');
import {tagElementMap, RCT_PROPERTY_NAMES} from "./native_element";
var ReactNativeEventEmitter = require('ReactNativeEventEmitter');

// required for angular:
import { Parse5DomAdapter } from 'angular2/src/dom/parse5_adapter';
import { setRootDomAdapter } from 'angular2/src/dom/dom_adapter';
require('traceur/bin/traceur-runtime.js');
require('reflect-metadata/Reflect.js');

require('./reactnative_zone')

// intentionlly overriding here because this is the easiest way to intercept events from React Native
ReactNativeEventEmitter.receiveEvent = function(
	tag: number,
	topLevelType: string,
	nativeEventParam
) {
	var element = tagElementMap[tag];
	if (nativeEventParam.target) {
		nativeEventParam.target = tagElementMap[nativeEventParam.target];
	}
	// console.log(tag, topLevelType.toLowerCase(), nativeEventParam);
	element.fireEvent(topLevelType.toLowerCase(), nativeEventParam);
	// TODO: Don't call detectChanges on events that are not listened to.
}

// intentionlly overriding here because this is the easiest way to intercept events from React Native
ReactNativeEventEmitter.receiveTouches = function(
	eventTopLevelType: string,
	touches: Array<any>,
	changedIndices: Array<number>
) {
	for (var i = 0; i < touches.length; i++) {
		var element = tagElementMap[touches[i].target];
		if (touches[i].target) {
			touches[i].target = tagElementMap[touches[i].target];
		}
		// console.log(eventTopLevelType, touches, changedIndices)

		while (element) {
			element.fireEvent(eventTopLevelType.toLowerCase(), touches[i]);
			element = element.parent;
		}
	}
};

import {bind, Renderer, bootstrap, NgZone} from "angular2/angular2";
import {internalView} from 'angular2/src/core/compiler/view_ref';
import {ReactNativeRenderer} from './renderer'

class CustomParse5DomAdapter extends Parse5DomAdapter {
	static makeCurrent() { setRootDomAdapter(new CustomParse5DomAdapter()); }
	hasProperty(element, name: string): boolean {
		console.log(name);
		return RCT_PROPERTY_NAMES[name] !== undefined;
	}
}

export function reactNativeBootstrap(component, bindings = []) {
	AppRegistry.registerRunnable("dist", function() {
		CustomParse5DomAdapter.makeCurrent();

		bootstrap(component, [
			ReactNativeRenderer,
			bind(Renderer).toAlias(ReactNativeRenderer)
		].concat(bindings)).then(function(appRef) {
			var zone = appRef._injector.get(NgZone)._innerZone;
			require('ReactUpdates').batchedUpdates = zone.bind(require('ReactUpdates').batchedUpdates);
		});
	});
}