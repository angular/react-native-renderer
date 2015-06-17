import {DomProtoView} from 'angular2/src/render/dom/view/proto_view';
import {RenderViewRef, EventDispatcher} from 'angular2/src/render/api';
import {NG_BINDING_CLASS} from 'angular2/src/render/dom/util';
import {ReactNativeElement} from './native_element';

export function resolveInternalReactNativeView(viewRef: RenderViewRef) {
	return (<ReactNativeViewRef>viewRef)._view;
}

export class ReactNativeViewRef extends RenderViewRef {
	_view: ReactNativeView;
	constructor(view: ReactNativeView) {
		super();
		this._view = view;
	}
}

export class ReactNativeView {
	hydrated: boolean;
	eventDispatcher: EventDispatcher;

	renderTree;

	constructor(public proto: DomProtoView, public rootChildElements, public boundElements: Array<ReactNativeElement>, public boundTextNodes) {
		this.hydrated = false;
	}
}