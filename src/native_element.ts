var NativeModules = require('NativeModules');
var ReactNativeTagHandles = require('ReactNativeTagHandles');
import {RenderFragmentRef} from 'angular2/src/render/api';

//Taken from a search of react-native for file names that match: /(RCT[^/]*)Manager\.m
const RCT_VIEW_NAMES = {
	"actionsheet": "RCTActionSheet",
	"activityindicatorview": "RCTActivityIndicatorView",
	"alert": "RCTAlert",
	"animationexperimental": "RCTAnimationExperimental",
	"cameraroll": "RCTCameraRoll",
	"data": "RCTData",
	"datepicker": "RCTDatePicker",
	"exceptions": "RCTExceptions",
	"linking": "RCTLinking",
	"map": "RCTMap",
	"navigator": "RCTNavigator",
	"navitem": "RCTNavItem",
	"networkimageview": "RCTNetworkImageView",
	"picker": "RCTPicker",
	"progressview": "RCTProgressView",
	"pushnotification": "RCTPushNotification",
	"rawtext": "RCTRawText",
	"scrollview": "RCTScrollView",
	"segmentedcontrol": "RCTSegmentedControl",
	"settings": "RCTSettings",
	"slider": "RCTSlider",
	"staticimage": "RCTStaticImage",
	"statusbar": "RCTStatusBar",
	"switch": "RCTSwitch",
	"tabbar": "RCTTabBar",
	"tabbaritem": "RCTTabBarItem",
	"text": "RCTText",
	"textfield": "RCTTextField",
	"textview": "RCTTextView",
	"ui": "RCTUI",
	"view": "RCTView",
	"websocket": "RCTWebSocket",
	"webview": "RCTWebView"
}

const RCT_PROPERTY_NAMES = {
	"accessibilitylabel": "accessibilityLabel",
	"accessibilitytraits": "accessibilityTraits",
	"accessible": "accessible",
	"alignitems": "alignItems",
	"alignment": "alignment",
	"alignself": "alignSelf",
	"alwaysbouncehorizontal": "alwaysBounceHorizontal",
	"alwaysbouncevertical": "alwaysBounceVertical",
	"animating": "animating",
	"annotations": "annotations",
	"autocapitalize": "autoCapitalize",
	"autocorrect": "autoCorrect",
	"automaticallyadjustcontentinsets": "automaticallyAdjustContentInsets",
	"backbuttonicon": "backButtonIcon",
	"backbuttontitle": "backButtonTitle",
	"backgroundcolor": "backgroundColor",
	"badge": "badge",
	"bartintcolor": "barTintColor",
	"border": "border",
	"borderbottomwidth": "borderBottomWidth",
	"bordercolor": "borderColor",
	"borderleftwidth": "borderLeftWidth",
	"borderradius": "borderRadius",
	"borderrightwidth": "borderRightWidth",
	"bordertopwidth": "borderTopWidth",
	"borderwidth": "borderWidth",
	"bottom": "bottom",
	"bounces": "bounces",
	"bounceszoom": "bouncesZoom",
	"cancancelcontenttouches": "canCancelContentTouches",
	"capinsets": "capInsets",
	"carethidden": "caretHidden",
	"centercontent": "centerContent",
	"clearbuttonmode": "clearButtonMode",
	"cleartextonfocus": "clearTextOnFocus",
	"color": "color",
	"containerbackgroundcolor": "containerBackgroundColor",
	"contentinset": "contentInset",
	"contentoffset": "contentOffset",
	"d": "d",
	"date": "date",
	"decelerationrate": "decelerationRate",
	"defaultimagesrc": "defaultImageSrc",
	"directionallockenabled": "directionalLockEnabled",
	"disabled": "disabled",
	"editable": "editable",
	"enabled": "enabled",
	"enablesreturnkeyautomatically": "enablesReturnKeyAutomatically",
	"fill": "fill",
	"flex": "flex",
	"flexdirection": "flexDirection",
	"flexwrap": "flexWrap",
	"fontfamily": "fontFamily",
	"fontsize": "fontSize",
	"fontstyle": "fontStyle",
	"fontweight": "fontWeight",
	"frame": "frame",
	"height": "height",
	"hideswhenstopped": "hidesWhenStopped",
	"html": "html",
	"icon": "icon",
	"imagetag": "imageTag",
	"ishighlighted": "isHighlighted",
	"items": "items",
	"justifycontent": "justifyContent",
	"keyboarddismissmode": "keyboardDismissMode",
	"keyboardtype": "keyboardType",
	"left": "left",
	"leftbuttonicon": "leftButtonIcon",
	"leftbuttontitle": "leftButtonTitle",
	"legallabelinsets": "legalLabelInsets",
	"letterspacing": "letterSpacing",
	"lineheight": "lineHeight",
	"margin": "margin",
	"marginbottom": "marginBottom",
	"marginhorizontal": "marginHorizontal",
	"marginleft": "marginLeft",
	"marginright": "marginRight",
	"margintop": "marginTop",
	"marginvertical": "marginVertical",
	"maxdelta": "maxDelta",
	"maximumdate": "maximumDate",
	"maximumtracktintcolor": "maximumTrackTintColor",
	"maximumvalue": "maximumValue",
	"maximumzoomscale": "maximumZoomScale",
	"mindelta": "minDelta",
	"minimumdate": "minimumDate",
	"minimumtracktintcolor": "minimumTrackTintColor",
	"minimumvalue": "minimumValue",
	"minimumzoomscale": "minimumZoomScale",
	"minuteinterval": "minuteInterval",
	"mode": "mode",
	"momentary": "momentary",
	"mycustomproperty": "myCustomProperty",
	"name": "name",
	"navigationbarhidden": "navigationBarHidden",
	"numberoflines": "numberOfLines",
	"oldname": "oldName",
	"onaccessibilitytap": "onAccessibilityTap",
	"onlayout": "onLayout",
	"onmagictap": "onMagicTap",
	"ontintcolor": "onTintColor",
	"opacity": "opacity",
	"overflow": "overflow",
	"padding": "padding",
	"paddingbottom": "paddingBottom",
	"paddinghorizontal": "paddingHorizontal",
	"paddingleft": "paddingLeft",
	"paddingright": "paddingRight",
	"paddingtop": "paddingTop",
	"paddingvertical": "paddingVertical",
	"pagingenabled": "pagingEnabled",
	"password": "password",
	"pitchenabled": "pitchEnabled",
	"placeholder": "placeholder",
	"placeholdertextcolor": "placeholderTextColor",
	"pointerevents": "pointerEvents",
	"position": "position",
	"progress": "progress",
	"progressimage": "progressImage",
	"progresstintcolor": "progressTintColor",
	"progressviewstyle": "progressViewStyle",
	"region": "region",
	"removeclippedsubviews": "removeClippedSubviews",
	"requestedtopofstack": "requestedTopOfStack",
	"resizemode": "resizeMode",
	"returnkeytype": "returnKeyType",
	"right": "right",
	"rightbuttonicon": "rightButtonIcon",
	"rightbuttontitle": "rightButtonTitle",
	"rotateenabled": "rotateEnabled",
	"scrollenabled": "scrollEnabled",
	"scrolleventthrottle": "scrollEventThrottle",
	"scrollindicatorinsets": "scrollIndicatorInsets",
	"scrollstotop": "scrollsToTop",
	"securetextentry": "secureTextEntry",
	"selected": "selected",
	"selectedicon": "selectedIcon",
	"selectedindex": "selectedIndex",
	"selecttextonfocus": "selectTextOnFocus",
	"shadowcolor": "shadowColor",
	"shadowoffset": "shadowOffset",
	"shadowopacity": "shadowOpacity",
	"shadowradius": "shadowRadius",
	"shouldinjectajaxhandler": "shouldInjectAJAXHandler",
	"showshorizontalscrollindicator": "showsHorizontalScrollIndicator",
	"showsuserlocation": "showsUserLocation",
	"showsverticalscrollindicator": "showsVerticalScrollIndicator",
	"size": "size",
	"src": "src",
	"stickyheaderindices": "stickyHeaderIndices",
	"stroke": "stroke",
	"strokecap": "strokeCap",
	"strokedash": "strokeDash",
	"strokejoin": "strokeJoin",
	"strokewidth": "strokeWidth",
	"testid": "testID",
	"text": "text",
	"textalign": "textAlign",
	"throttlescrollcallbackms": "throttleScrollCallbackMS",
	"thumbtintcolor": "thumbTintColor",
	"timezoneoffsetinminutes": "timeZoneOffsetInMinutes",
	"tintcolor": "tintColor",
	"title": "title",
	"titletextcolor": "titleTextColor",
	"top": "top",
	"trackimage": "trackImage",
	"tracktintcolor": "trackTintColor",
	"transform": "transform",
	"transformmatrix": "transformMatrix",
	"url": "url",
	"value": "value",
	"values": "values",
	"width": "width",
	"writingdirection": "writingDirection",
	"zoomenabled": "zoomEnabled",
	"zoomscale": "zoomScale",
}

export var tagElementMap = {};

export function resolveInternalReactNativeFragment(fragmentRef: RenderFragmentRef) {
	return (<ReactNativeFragmentRef>fragmentRef)._nodes;
}

export class ReactNativeFragmentRef extends RenderFragmentRef {
  constructor(public _nodes: ReactNativeElement[]) { super(); }
}


export class ReactNativeElement {
	tag;
	viewName;
	parent: ReactNativeElement;
	children:Array<ReactNativeElement> = [];
	listenerCallback = (name, event) => {};
	//Keeping track of native properties so that we can re-create
	//the element when re-attaching it.
	props = {};
	_created = false;
	constructor(viewName: string, properties = {}) {
		var nativeViewName = RCT_VIEW_NAMES[viewName];
		if (nativeViewName == undefined) {
			// console.log("%cNode viewName invalid: " + viewName + ". defaulting to RCTView", "background: #FFFF00");
			nativeViewName = RCT_VIEW_NAMES["view"];
		}
		this.viewName = nativeViewName;

		this.tag = ReactNativeTagHandles.allocateTag();

		this._mergeInProps(properties);

		this._createIfNeeded();
		tagElementMap[this.tag] = this;
	}

	insertChildAtIndex(node: ReactNativeElement, index: number) {
		this.children.splice(index, 0, node);
		node.parent = this;
		node._createIfNeeded();
		NativeModules.UIManager.manageChildren(this.tag, null, null, [node.tag], [index], null);
	}

	removeAtIndex(index: number) {
		var removedElement = this.children.splice(index, 1)[0];
		NativeModules.UIManager.manageChildren(this.tag, null, null, null, null, [index])
		removedElement.parent = null;
		removedElement._destroy();
	}

	setProperty(prop, value) {
		this.props[RCT_PROPERTY_NAMES[prop] || prop] = value;
		NativeModules.UIManager.updateView(this.tag, this.viewName, this.props);
	}

	attachToNative() {
		NativeModules.UIManager.manageChildren(1, null, null, [this.tag], [0], null);
	}

	focus() {
		NativeModules.UIManager.focus(this.tag);
	}

	setEventListener(listener) {
		this.listenerCallback = listener;
	}

	fireEvent(name, event) {
		this.listenerCallback(name, event);
	}

	_mergeInProps(properties) {
		for (var i in properties) {
			this.props[RCT_PROPERTY_NAMES[i] || i] = properties[i];
		}
	}

	_createIfNeeded() {
		if (!this._created) {
			NativeModules.UIManager.createView(this.tag, this.viewName, null, this.props);
			for (var i = 0; i < this.children.length; i++) {
				var node = this.children[i];
				node._createIfNeeded();
				NativeModules.UIManager.manageChildren(this.tag, null, null, [node.tag], [i], null);
			}
			this._created = true;
		}
	}

	_destroy() {
		this._created = false;
		for (var i = 0; i < this.children.length; i++) {
			this.children[i]._destroy();
		}
	}
}