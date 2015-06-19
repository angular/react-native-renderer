'use strict';

import {tagElementMap} from "./native_element";

var AppRegistry = require('AppRegistry');
var ReactNativeEventEmitter = require('ReactNativeEventEmitter');

// required for angular:
var parse5Adapter = require('angular2/src/dom/parse5_adapter.js');
require('traceur/bin/traceur-runtime.js');
require('reflect-metadata/Reflect.js');

require('./reactnative_zone')

// intentionlly overriding here because this is the easiest way to intercept events from React Native
ReactNativeEventEmitter.receiveEvent = function(
	tag: number,
	topLevelType: string,
	nativeEventParam
) {
	if (!nativeEventParam.target) {
		throw "Expected all events to have a target!";
	}
	var element = tagElementMap[tag];
	nativeEventParam.target = element;
	console.log(tag, topLevelType.toLowerCase(), nativeEventParam);
	element.fireEvent(topLevelType.toLowerCase(), nativeEventParam);
	// TODO: Don't call detectChanges on events that are not listened to.
}

// intentionlly overriding here because this is the easiest way to intercept events from React Native
ReactNativeEventEmitter.receiveTouches = function(
	eventTopLevelType: string,
	touches: Array<Object>,
	changedIndices: Array<number>
) {
	console.log(eventTopLevelType, touches, changedIndices)
};

import {bind, Renderer, appComponentRefToken, bootstrap} from "angular2/angular2";
import {internalView} from 'angular2/src/core/compiler/view_ref';
import {ReactNativeRenderer} from './renderer'

export function reactNativeBootstrap(component, bindings = []) {
	AppRegistry.registerRunnable("dist", function() {
		parse5Adapter.Parse5DomAdapter.makeCurrent();

		bootstrap(component, [
			ReactNativeRenderer,
			bind(Renderer).toAlias(ReactNativeRenderer)
		].concat(bindings))
	});
}