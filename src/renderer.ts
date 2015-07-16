import {MapWrapper} from 'angular2/src/facade/collection';
import {DomProtoView, resolveInternalDomProtoView} from 'angular2/src/render/dom/view/proto_view';
import {Renderer, RenderProtoViewRef, RenderViewWithFragments, RenderViewRef, RenderFragmentRef, RenderElementRef, RenderEventDispatcher} from 'angular2/src/render/api';
import {NG_BINDING_CLASS} from 'angular2/src/render/dom/util';
import {DOM} from 'angular2/src/dom/dom_adapter';

import {resolveInternalReactNativeView, ReactNativeViewRef, ReactNativeView} from './view';
import {ReactNativeElement, ReactNativeFragmentRef, resolveInternalReactNativeFragment} from './native_element';


export class ReactNativeRenderer extends Renderer {

	constructor() {
		super();
		console.log("constructor", arguments);
	}

	createRootHostView(hostProtoViewRef: RenderProtoViewRef, fragmentCount: number,
		hostElementSelector: string): RenderViewWithFragments {
		console.log("createRootHostView", arguments);
		var hostProtoView = resolveInternalDomProtoView(hostProtoViewRef);
		return this._createView(hostProtoView, true);
	}
	detachFreeHostView(parentHostViewRef: RenderViewWithFragments, hostViewRef: RenderViewWithFragments) {
		console.log("detachFreeHostView", arguments);
	}

	createView(protoViewRef: RenderProtoViewRef, fragmentCount: number): RenderViewWithFragments {
		console.log("createView", arguments);
		var protoView = resolveInternalDomProtoView(protoViewRef);
		return this._createView(protoView);
	}

	destroyView(viewRef: RenderViewRef) {
		console.log("destroyView", arguments);
	}

	attachFragmentAfterFragment(previousFragmentRef: RenderFragmentRef,
		fragmentRef: RenderFragmentRef) {
		console.log("attachFragmentAfterFragment", arguments);
		var previousFragmentNodes = resolveInternalReactNativeFragment(previousFragmentRef);
		var sibling = previousFragmentNodes[previousFragmentNodes.length - 1];
		moveNodesAfterSibling(sibling, resolveInternalReactNativeFragment(fragmentRef));
	}

	attachFragmentAfterElement(elementRef: RenderElementRef, fragmentRef: RenderFragmentRef) {
		console.log("attachFragmentAfterElement", arguments);
		var view = resolveInternalReactNativeView(elementRef.renderView);
		var element = view.boundElements[elementRef.renderBoundElementIndex];
		moveNodesAfterSibling(element, resolveInternalReactNativeFragment(fragmentRef));
	}

	detachFragment(fragmentRef: RenderFragmentRef) {
		console.log("detachFragment", arguments);
		var fragment = resolveInternalReactNativeFragment(fragmentRef);
		for (var i = 0; i < fragment.length; i++) {
			var element = fragment[i];
			element.parent.removeAtIndex(element.parent.children.indexOf(element));
		}
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

	getNativeElementSync(location: RenderElementRef): any {
		console.log("getNativeElementSync", arguments);
		var view = resolveInternalReactNativeView(location.renderView);
		return view.boundElements[location.renderBoundElementIndex];
	}

	setElementProperty(location: RenderElementRef, propertyName: string, propertyValue: any) {
		console.log("setElementProperty", arguments);
		// var view = resolveInternalReactNativeView(viewRef);
		// var element = view.boundElements[elementIndex];
		// element.setProperty(propertyName, propertyValue);
	}

	setElementAttribute(location: RenderElementRef, attributeName: string, attributeValue: string) {
		console.log("setElementAttribute", arguments);
	}

	setElementClass(location: RenderElementRef, className: string, isAdd: boolean) {
		console.log("setElementClass", arguments);
	}

	setElementStyle(location: RenderElementRef, styleName: string, styleValue: string) {
		console.log("setElementStyle", arguments);
	}

	invokeElementMethod(location: RenderElementRef, methodName: string, args: List<any>) {
		console.log("invokeElementMethod", arguments);
	}

	setText(viewRef: RenderViewRef, textNodeIndex: number, text: string) {
		console.log("setText", arguments);
		var view = resolveInternalReactNativeView(viewRef);
		view.boundTextNodes[textNodeIndex].setProperty("text", text);
	}

	setEventDispatcher(viewRef: RenderViewRef, dispatcher: RenderEventDispatcher) {
		console.log("setEventDispatcher", arguments);
		var view = resolveInternalReactNativeView(viewRef);
		view.eventDispatcher = dispatcher;
	}
	
	_createView(proto: DomProtoView, isRoot = false): RenderViewWithFragments {
		console.log(proto);
		var nativeElements;
		var boundElements = [];
		if (proto.rootElement.tagName == "template") {
			nativeElements = this._dfsAndCreateNativeElements(proto.rootElement.childNodes[0].childNodes, boundElements);
		} else {
			nativeElements = this._dfsAndCreateNativeElements([proto.rootElement], boundElements);
		}

		var fragments = [];
		var currentRootIndex = 0;
		for (var i = 0; i < proto.fragmentsRootNodeCount.length; i++) {
			var rootNodeCount = proto.fragmentsRootNodeCount[i];
			var fragmentElements = [];
			for (var j = 0; j < rootNodeCount; j++) {
				fragmentElements.push(nativeElements[currentRootIndex++])
			}
			fragments.push(new ReactNativeFragmentRef(fragmentElements));
		}

		if (isRoot) {
			nativeElements[0].attachToNative();
		}
		var boundTextNodes = this._createBoundTextNodes(proto, boundElements);
		var view = new ReactNativeView(proto, nativeElements, boundElements, boundTextNodes);

		for (var i = 0; i < view.boundElements.length; i++) {
			this._initElementEventListener(i, view.boundElements[i], view);
		}

		return new RenderViewWithFragments(new ReactNativeViewRef(view), fragments);
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
			var locals = new Map<string, any>();
			locals.set('$event', event);
			view.eventDispatcher.dispatchRenderEvent(bindingIndex, name, locals);
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

function moveNodesAfterSibling(sibling: ReactNativeElement, nodes: ReactNativeElement[]) {
	if (sibling.parent) {
		var destIndex = sibling.parent.children.indexOf(sibling) + 1;
		for (var i = 0; i < nodes.length; i++) {
			sibling.parent.insertChildAtIndex(nodes[i], destIndex);
		}
	}
}