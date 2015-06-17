/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import {tagElementMap} from "./native_element";

var AppRegistry = require('AppRegistry');
var ReactNativeEventEmitter = require('ReactNativeEventEmitter');
//replacing the event handlers.
//This is better than replacing the module itself, because
//react native's packager gets confused if you have two packages 
//with the same name.
ReactNativeEventEmitter.receiveEvent = function(
	tag: number,
	topLevelType: string,
	nativeEventParam: Object
) {
	console.log(tag, topLevelType.toLowerCase(), nativeEventParam);
	tagElementMap[tag].listenerCallback(topLevelType.toLowerCase(), nativeEventParam);
	// TODO: Don't call detectChanges on events that are not listened to.
	detectChanges();
}
ReactNativeEventEmitter.receiveTouches = function(
	eventTopLevelType: string,
	touches: Array<Object>,
	changedIndices: Array<number>
) {
	console.log(eventTopLevelType, touches, changedIndices)
	// TODO: detectChanges();
}

var NativeModules = require('NativeModules');
var ReactNativeTagHandles = require('ReactNativeTagHandles');

// required for angular:
var parse5Adapter = require('angular2/src/dom/parse5_adapter.js');
require('traceur/bin/traceur-runtime.js');
require('reflect-metadata/Reflect.js');

import {Component, View, bootstrap, bind, Renderer, appComponentRefToken} from 'angular2/angular2';
import {internalView} from 'angular2/src/core/compiler/view_ref';

import {ReactNativeRenderer} from './renderer'

@Component({
	selector: 'hello-world',
	hostAttributes: {
		"flex": 1,
		"justifyContent": "center",
		"alignItems": "center",
		"backgroundColor": "#F5FCFF"
	}
})
@View({
	template:
		  "<TextField height='40' fontSize='40' (topChange)='myText = $event.text' alignSelf='stretch' placeholder='Name'></TextField>"
		+ "<Text>Hello, {{myText}}!</Text>",
	directives: []
})
class HelloWorldComponent {
	myText = "";
}

var detectChanges = () => { };

AppRegistry.registerRunnable("dist", function() {
	parse5Adapter.Parse5DomAdapter.makeCurrent();

	bootstrap(HelloWorldComponent, [
		ReactNativeRenderer,
		bind(Renderer).toAlias(ReactNativeRenderer)
	]).then( (appRef) => {
		var componentRef = appRef.injector.get(appComponentRefToken);
		var rootView = internalView(componentRef.location.parentView);
		detectChanges = () => rootView.changeDetector.detectChanges();
	});
});