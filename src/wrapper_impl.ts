// Zone.js
import {Zone} from 'zone.js/lib/core';
global.zone = new Zone();
import {patchSetClearFunction} from 'zone.js/lib/patch/functions';
patchSetClearFunction(global, ['timeout', 'interval', 'immediate']);

//ReactNative
import {ReactNativeWrapper} from "./wrapper";
var ReactNative = require('react-native');
var AppRegistry = ReactNative.AppRegistry;
var UIManager = ReactNative.NativeModules.UIManager;

var ReactUpdates =  require('ReactUpdates');
var ReactNativeEventEmitter = require('ReactNativeEventEmitter');
var ReactNativeTagHandles = require('ReactNativeTagHandles');
var ReactNativeAttributePayload = require('ReactNativeAttributePayload');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');

const RCT_VIEW_NAMES: { [s: string]: string } = {
  "DrawerLayout": "AndroidDrawerLayout",
  "Image": "RCTImageView",
  "PagerLayout": "AndroidViewPager",
  "ProgressBar": "AndroidProgressBar",
  "ScrollView": "RCTScrollView",
  "HorizontalScrollView" : "AndroidHorizontalScrollView",
  "RawText": "RCTRawText",
  "Switch": "AndroidSwitch",
  "Text": "RCTText",
  "InlineImage": "RCTTextInlineImage",
  "VirtualText": "RCTVirtualText",
  "TextInput": "AndroidTextInput",
  "View": "RCTView",
  "WebView": "RCTWebView"
}

export class ReactNativeWrapperImpl extends ReactNativeWrapper {
  static registerApp(name: string, callback: Function) {
    AppRegistry.registerRunnable(name, callback);
  }

  computeStyle(styles: Object): Object {
    return ReactNativeAttributePayload.create({style: styles}, ReactNativeViewAttributes.RCTView);
  }

  processColor(color: string): number {
    return ReactNative.processColor(color);
  }

  createView(tagName: string, root: number, properties: Object): number {
    var tag = ReactNativeTagHandles.allocateTag();
    var viewName = RCT_VIEW_NAMES[tagName] || RCT_VIEW_NAMES['View'];
    this.$log(`Creating a ${viewName} with tag ${tag} and attribs:`, properties);
    UIManager.createView(tag, viewName, 1, properties);
    return tag;
  }

  updateView(tag: number, tagName: string, properties: Object) {
    var viewName = RCT_VIEW_NAMES[tagName] || RCT_VIEW_NAMES['View'];
    this.$log(`Updating property ${viewName} in ${tag} to`, properties);
    UIManager.updateView(tag, viewName, properties);
  }

  manageChildren(parentTag: number, moveFrom: Array<number>, moveTo: Array<number>, addTags: Array<number>, addAt: Array<number>, removeAt: Array<number>) {
    this.$log(`Managing children of ${parentTag}:`, moveFrom, moveTo, addTags, addAt, removeAt);
    UIManager.manageChildren(parentTag, moveFrom, moveTo, addTags, addAt, removeAt);
  }

  dispatchCommand(tag: number, command: string, params: any = null) {
    var commands: {[s: string]: number} = {
      'blurTextInput': UIManager.AndroidTextInput.Commands.blurTextInput,
      'focusTextInput': UIManager.AndroidTextInput.Commands.focusTextInput,
      'openDrawer': UIManager.AndroidDrawerLayout.Commands.openDrawer,
      'closeDrawer': UIManager.AndroidDrawerLayout.Commands.closeDrawer,
      'hotspotUpdate': UIManager.RCTView.Commands.hotspotUpdate,
      'setPressed': UIManager.RCTView.Commands.setPressed,
      'setPage': UIManager.AndroidViewPager.Commands.setPage,
      'setPageWithoutAnimation': UIManager.AndroidViewPager.Commands.setPageWithoutAnimation,
      'goForward': UIManager.RCTWebView.Commands.goForward,
      'reload': UIManager.RCTWebView.Commands.reload,
      'goBack': UIManager.RCTWebView.Commands.goBack
    };
    this.$log(`Dispatching command to ${tag}: ${command} with ${params}`);
    UIManager.dispatchViewManagerCommand(tag, commands[command], params);
  }

  patchReactUpdates(zone: any): void {
    ReactUpdates.batchedUpdates = zone.bind(ReactUpdates.batchedUpdates);
  }

  patchReactNativeEventEmitter(nodeMap: Map<number, any>): void {
    ReactNativeEventEmitter.receiveEvent = (nativeTag: number, topLevelType: string, nativeEventParam: any) => {
      this.$log('receiveEvent', nativeTag, topLevelType, nativeEventParam);
      var element = nodeMap.get(nativeTag);
      if (nativeEventParam.target) {
        nativeEventParam.target = nodeMap.get(nativeEventParam.target);
        nativeEventParam.type = topLevelType;
        nativeEventParam.clientX = nativeEventParam.pageX;
        nativeEventParam.clientY = nativeEventParam.pageY;
        nativeEventParam.preventDefault = () => {};
        nativeEventParam._stop = true;
        nativeEventParam.stopPropagation = () => {
          nativeEventParam._stop = true;
        };
      }
      if (element) {
        element.fireEvent(topLevelType, nativeEventParam);
      }
    }

    ReactNativeEventEmitter.receiveTouches = (eventTopLevelType: string, touches: Array<any>, changedIndices: Array<number>) => {
      this.$log('receiveTouches', eventTopLevelType, touches, changedIndices);
      var event = touches[0];
      if (event.target) {
        event.target = nodeMap.get(event.target);
        event.type = eventTopLevelType;
        event.clientX = event.pageX;
        event.clientY = event.pageY;
        event.preventDefault = () => {};
        event._stop = false;
        event.stopPropagation = () => {
          event._stop = true;
        };
      }

      for (var i = 0; i < touches.length; i++) {
        if (touches[i].target) {
          touches[i].clientX = touches[i].pageX;
          touches[i].clientY = touches[i].pageY;
        }
      }
      event.touches = touches;
      event.changedIndices = changedIndices;
      if (event.target) {
        event.target.fireEvent(eventTopLevelType, event);
      } else {
        //TODO: manage global event on "window" ?
      }

    };
  }
  
  $log(...args: any[]) {
    console.log(...args);
  }
}

/*
 At run time:

 NativeModules.UIManager.RCTText.NativeProps =
 {"opacity":"number","renderToHardwareTextureAndroid":"boolean","numberOfLines":"number","borderBottomWidth":"number","scaleY":"number","position":"String","paddingTop":"number","borderWidth":"number","color":"number","marginLeft":"number","fontFamily":"String","marginHorizontal":"number","fontStyle":"String","paddingBottom":"number","paddingHorizontal":"number","scaleX":"number","onLayout":"boolean","flexWrap":"String","borderTopWidth":"number","borderRightWidth":"number","marginTop":"number","translateX":"number","rotation":"number","accessibilityLiveRegion":"String","alignItems":"String","accessibilityComponentType":"String","paddingVertical":"number","flex":"number","marginBottom":"number","bottom":"number","textAlign":"String","justifyContent":"String","fontWeight":"String","padding":"number","alignSelf":"String","backgroundColor":"number","right":"number","borderLeftWidth":"number","height":"number","left":"number","translateY":"number","paddingRight":"number","lineHeight":"number","flexDirection":"String","importantForAccessibility":"String","marginVertical":"number","fontSize":"number","accessibilityLabel":"String","width":"number","paddingLeft":"number","text":"String","top":"number","margin":"number","decomposedMatrix":"Map","marginRight":"number","testID":"String"}

 Style:
 ReactNativeViewAttributes.RCTView

 Android:
   AndroidSwipeRefreshLayout
   ToolbarAndroid

   AccessibilityEventTypes: Object
   Dimensions: Object
   PopupMenu: Object
   StyleConstants: Object
   UIText: Object
   UIView: Object
 */