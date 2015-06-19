import {MapWrapper} from 'angular2/src/facade/collection';
import {DomProtoView, resolveInternalDomProtoView} from 'angular2/src/render/dom/view/proto_view';
import {Renderer, RenderProtoViewRef, RenderViewRef, EventDispatcher} from 'angular2/src/render/api';
import {NG_BINDING_CLASS} from 'angular2/src/render/dom/util';
import {DOM} from 'angular2/src/dom/dom_adapter';

import {resolveInternalReactNativeView, ReactNativeViewRef, ReactNativeView} from './view';
import {ReactNativeElement} from './native_element';

//Taken from a search of react-native for file names that match: /(RCT[^/]*)Manager\.m

export class ReactNativeRenderer extends Renderer {

	constructor() {
		super();
		console.log("constructor", arguments);
	}

	createRootHostView(hostProtoViewRef: RenderProtoViewRef): RenderViewRef {
		console.log("createRootHostView", arguments);
		var hostProtoView = resolveInternalDomProtoView(hostProtoViewRef);
		return new ReactNativeViewRef(this._createView(hostProtoView, true));
	}
	detachFreeHostView(parentHostViewRef: RenderViewRef, hostViewRef: RenderViewRef) {
		console.log("detachFreeHostView", arguments);
	}

	createView(protoViewRef: RenderProtoViewRef): RenderViewRef {
		console.log("createView", arguments);
		var protoView = resolveInternalDomProtoView(protoViewRef);
		return new ReactNativeViewRef(this._createView(protoView));
	}

	destroyView(viewRef: RenderViewRef) {
		console.log("destroyView", arguments);
	}

	attachComponentView(hostViewRef: RenderViewRef, elementIndex: number,
		componentViewRef: RenderViewRef) {
		console.log("attachComponentView", arguments);
		var hostView = resolveInternalReactNativeView(hostViewRef);
		var componentView = resolveInternalReactNativeView(componentViewRef);
		var parent = hostView.boundElements[elementIndex];
		var children = componentView.rootChildElements;
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			parent.insertChildAtIndex(child, i);
		}
	}

	detachComponentView(hostViewRef: RenderViewRef, boundElementIndex: number, componentViewRef: RenderViewRef) {
		console.log("detachComponentView", arguments);
	}

	attachViewInContainer(parentViewRef: RenderViewRef, boundElementIndex: number, atIndex: number, viewRef: RenderViewRef) {
		console.log("attachViewInContainer", arguments);
		var parentView = resolveInternalReactNativeView(parentViewRef);
		var view = resolveInternalReactNativeView(viewRef);
		var siblingElement = parentView.boundElements[boundElementIndex];
		var siblingIndex = siblingElement.parent.children.indexOf(siblingElement);
		var desiredIndex = (siblingIndex + 1) + atIndex;
		if (view.rootChildElements.length != 1) {
			console.log("%cExpected one element, got " + view.rootChildElements.length, "color: #FF0000");
		}
		var elementToInsert = view.rootChildElements[0];
		siblingElement.parent.insertChildAtIndex(elementToInsert, desiredIndex);
	}

	detachViewInContainer(parentViewRef: RenderViewRef, boundElementIndex: number, atIndex: number, viewRef: RenderViewRef) {
		console.log("detachViewInContainer", arguments);
		var parentView = resolveInternalReactNativeView(parentViewRef);
		var view = resolveInternalReactNativeView(viewRef);
		var siblingElement = parentView.boundElements[boundElementIndex];
		var siblingIndex = siblingElement.parent.children.indexOf(siblingElement);
		var desiredIndex = (siblingIndex + 1) + atIndex;
		siblingElement.parent.removeAtIndex(desiredIndex);
	}

	hydrateView(viewRef: RenderViewRef) {
		console.log("hydrateView", arguments);
		var view = resolveInternalReactNativeView(viewRef);
		if (view.hydrated) throw 'The view is already hydrated.';
		view.hydrated = true;
		//TODO: actually hydrate anything.
	}

	dehydrateView(viewRef: RenderViewRef) {
		console.log("dehydrateView", arguments);
		var view = resolveInternalReactNativeView(viewRef);
		view.hydrated = false;
		//TODO: actually dehydrate anything.
	}

	setElementProperty(viewRef: RenderViewRef, elementIndex: number, propertyName: string, propertyValue: any) {
		console.log("setElementProperty", arguments);
		var view = resolveInternalReactNativeView(viewRef);
		var element = view.boundElements[elementIndex];
		element.setProperty(propertyName, propertyValue);
	}

	callAction(viewRef: RenderViewRef, elementIndex: number, actionExpression: string, actionArgs: any) {
		console.log("callAction", arguments);
	}

	setText(viewRef: RenderViewRef, textNodeIndex: number, text: string) {
		console.log("setText", arguments);
		var view = resolveInternalReactNativeView(viewRef);
		view.boundTextNodes[textNodeIndex].setProperty("text", text);
	}

	setEventDispatcher(viewRef: RenderViewRef, dispatcher: EventDispatcher) {
		console.log("setEventDispatcher", arguments);
		var view = resolveInternalReactNativeView(viewRef);
		view.eventDispatcher = dispatcher;
	}

	_createView(proto: DomProtoView, isRoot = false): ReactNativeView {
		console.log(proto);
		var nativeElements;
		var boundElements = [];
		if (proto.element.name == "template") {
			nativeElements = this._dfsAndCreateNativeElements(proto.element.children[0].children, boundElements);
		} else {
			nativeElements = this._dfsAndCreateNativeElements([proto.element], boundElements);
		}

		if (isRoot) {
			nativeElements[0].attachToNative();
		}
		var boundTextNodes = this._createBoundTextNodes(proto, boundElements);
		var view = new ReactNativeView(proto, nativeElements, boundElements, boundTextNodes);

		for (var i = 0; i < view.boundElements.length; i++) {
			this._initElementEventListener(i, view.boundElements[i], view);
		}

		return view;
	}

	_dfsAndCreateNativeElements(childrenParam, boundElements) {
		var resultingNativeChildren = [];
		for (var i = 0; i < childrenParam.length; i++) {
			var node = childrenParam[i];
			var nativeElement;
			if (node.type == "tag") {
				nativeElement = new ReactNativeElement(node.name, node.attribs);
			} else if (node.type == "text") {
				nativeElement = new ReactNativeElement("rawtext", {text:node.data});
			}

			if (DOM.hasClass(node, NG_BINDING_CLASS)) {
				boundElements.push(nativeElement);
			}

			//create and then attach children
			if (node.children && node.name != "template") {
				var children = this._dfsAndCreateNativeElements(node.children, boundElements);
				for (var j = 0; j < children.length; j++) {
					var child = children[j];
					nativeElement.insertChildAtIndex(child, j);
				}
			}
			resultingNativeChildren.push(nativeElement)
		}
		return resultingNativeChildren;
	}

	_initElementEventListener(bindingIndex: number, element: ReactNativeElement, view: ReactNativeView) {
		element.setEventListener(global.zone.bind(function(name, event) {
			var locals = MapWrapper.create();
			MapWrapper.set(locals, '$event', event);
			view.eventDispatcher.dispatchEvent(bindingIndex, name, locals);
			console.log("%cEvent dispatched: ", "color: #22dd22", name, locals);
		}));
	}

	_createBoundTextNodes(proto: DomProtoView, boundElements) {
		//expecting boundElements to already be filled out, and be an array of ReactNativeElements
		var boundTextNodes = [];
		var elementBinders = proto.elementBinders;
		for (var i = 0; i < elementBinders.length; i++) {
			var indicies = elementBinders[i].textNodeIndices;
			var nativeNodes = boundElements[i].children;
			for (var j = 0; j < indicies.length; j++) {
				var index = indicies[j];
				boundTextNodes.push(nativeNodes[index]);
			}
		}
		return boundTextNodes;
	}
}