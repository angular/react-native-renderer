// Zone.js
import {Zone} from 'zone.js/lib/core';
global.zone = new Zone();
import {patchSetClearFunction} from 'zone.js/lib/patch/functions';
patchSetClearFunction(global, ['timeout', 'interval', 'immediate']);

export function getGlobalZone() {
  return global.zone;
}

//ReactNative
var ReactNative = require('react-native');
var AppRegistry = ReactNative.AppRegistry;
var UIManager = ReactNative.NativeModules.UIManager;
export var StyleSheet = ReactNative.StyleSheet;

var ReactUpdates =  require('ReactUpdates');
var ReactNativeEventEmitter = require('ReactNativeEventEmitter');
var ReactNativeTagHandles = require('ReactNativeTagHandles');
var ReactNativeAttributePayload = require('ReactNativeAttributePayload');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');

const RCT_VIEW_NAMES: { [s: string]: string } = {
  "ImageView": "RCTImageView",
  "ScrollView": "RCTScrollView",
  "RawText": "RCTRawText",
  "Text": "RCTText",
  "TextInput": "AndroidTextInput",
  "View": "RCTView",
}

export class ReactNativeWrapper {
  static registerApp(name: string, callback: Function) {
    AppRegistry.registerRunnable(name, callback);
  }

  static computeStyle(styles: Object): Object {
    return ReactNativeAttributePayload.create({style: styles}, ReactNativeViewAttributes.RCTView)
  }

  static createView(tagName: string, root: number, properties: Object) {
    var tag = ReactNativeTagHandles.allocateTag();
    var viewName = RCT_VIEW_NAMES[tagName] || RCT_VIEW_NAMES['View'];
    console.log(`Creating a ${viewName} with tag ${tag} and attribs:`, properties);
    UIManager.createView(tag, viewName, 1, properties);
    return tag;
  }

  static updateView(tag: number, tagName: string, properties: Object) {
    var viewName = RCT_VIEW_NAMES[tagName] || RCT_VIEW_NAMES['View'];
    console.log(`Updating property ${viewName} in ${tag} to`, properties);
    UIManager.updateView(tag, viewName, properties);
  }

  static manageChildren(parentTag: number, moveFrom: Array<number>, moveTo: Array<number>, addTags: Array<number>, addAt: Array<number>, removeAt: Array<number>) {
    UIManager.manageChildren(parentTag, moveFrom, moveTo, addTags, addAt, removeAt);
  }

  static dispatchCommand(tag: number, command: string) {
    //TODO: generalize
    var commands: {[s: string]: number} = {
      'blur': UIManager.AndroidTextInput.Commands.blurTextInput,
      'focus':UIManager.AndroidTextInput.Commands.focusTextInput
    };
    //iOS: NativeModules.UIManager.blur(this.nativeTag);
    UIManager.dispatchViewManagerCommand(tag, commands[command], null);
  }

  static patchReactUpdates(zone: any) {
    ReactUpdates.batchedUpdates = zone.bind(ReactUpdates.batchedUpdates);
  }

  static patchReactNativeEventEmitter(nodeMap: Map<number, any>) {
    ReactNativeEventEmitter.receiveEvent = function(nativeTag: number, topLevelType: string, nativeEventParam: any) {
      console.log('receiveEvent', nativeTag, topLevelType, nativeEventParam);
      var element = nodeMap.get(nativeTag);
      if (nativeEventParam.target) {
        nativeEventParam.target = nodeMap.get(nativeEventParam.target);
      }
      if (element) {
        element.fireEvent(topLevelType, nativeEventParam);
      }
    }

    ReactNativeEventEmitter.receiveTouches = function(eventTopLevelType: string, touches: Array<any>, changedIndices: Array<number>) {
      console.log('receiveTouches', eventTopLevelType, touches, changedIndices);
      for (var i = 0; i < touches.length; i++) {
        var element = nodeMap.get(touches[i].target);
        if (touches[i].target) {
          touches[i].target = nodeMap.get(touches[i].target);
        }
        while (element) {
          element.fireEvent(eventTopLevelType, touches[i]);
          element = element.parent;
        }
      }
    };
  }
}

/*
 At run time:

 NativeModules.UIManager.RCTText.NativeProps =
 {"opacity":"number","renderToHardwareTextureAndroid":"boolean","numberOfLines":"number","borderBottomWidth":"number","scaleY":"number","position":"String","paddingTop":"number","borderWidth":"number","color":"number","marginLeft":"number","fontFamily":"String","marginHorizontal":"number","fontStyle":"String","paddingBottom":"number","paddingHorizontal":"number","scaleX":"number","onLayout":"boolean","flexWrap":"String","borderTopWidth":"number","borderRightWidth":"number","marginTop":"number","translateX":"number","rotation":"number","accessibilityLiveRegion":"String","alignItems":"String","accessibilityComponentType":"String","paddingVertical":"number","flex":"number","marginBottom":"number","bottom":"number","textAlign":"String","justifyContent":"String","fontWeight":"String","padding":"number","alignSelf":"String","backgroundColor":"number","right":"number","borderLeftWidth":"number","height":"number","left":"number","translateY":"number","paddingRight":"number","lineHeight":"number","flexDirection":"String","importantForAccessibility":"String","marginVertical":"number","fontSize":"number","accessibilityLabel":"String","width":"number","paddingLeft":"number","text":"String","top":"number","margin":"number","decomposedMatrix":"Map","marginRight":"number","testID":"String"}

 Style:
 ReactNativeViewAttributes.RCTView

 Android:
 AccessibilityEventTypes: Object
 AndroidDrawerLayout: Object
 AndroidHorizontalScrollView: Object
 AndroidProgressBar: Object
 AndroidSwitch: Object
 AndroidTextInput: Object
 AndroidViewPager: Object
 Dimensions: Object
 PopupMenu: Object
 RCTImageView: Object
 RCTRawText: Object
 RCTScrollView: Object
 RCTText: Object
 RCTView: Object
 RCTVirtualText: Object
 StyleConstants: Object
 ToolbarAndroid: Object
 UIText: Object
 UIView: Object
 */