### Todo
- Http
- Router
- query selector on nodes
- measure & measureLayout on Nodes
- Refactor source
- Clarify the needed polyfill and remove es6-shim if possible
- High-level Components
- Mac
- iOS
- documentation
- typings
- testability (unit & e2e tests)

### APIs

Info APIs (see details at https://facebook.github.io/react-native/docs ):
  Platform -> Object {OS: "android", Version: 22}
  NetInfo
  PixelRatio

Useful APIs:
 Alert
 AsyncStorage
 BackAndroid
 Clipboard
 GeoLocation
 IntentAndroid
 ToastAndroid
 StyleSheet

 CameraRoll


Animation APIs:
 Animated
 Dimensions
 InteractionManager
 LayoutAnimation

iOS APIs:
 ActionSheetIOS
 AdSupportIOS
 AlertIOS
 AppStateIOS
 ImagePickerIOS
 LinkingIOS
 PushNotificationIOS
 Settings
 StatusBarIOS
 VibrationIOS

Low level APIs:
 NativeMethodsMixin: to be done in Node
 PanResponder: gestures already done with hammer.js
 AppRegistry: for renderer only
 UIManager: for renderer only
 Dimensions: ???

### Misc

At run time:
```
 NativeModules.UIManager.RCTText.NativeProps =
 {"opacity":"number","renderToHardwareTextureAndroid":"boolean","numberOfLines":"number","borderBottomWidth":"number","scaleY":"number","position":"String","paddingTop":"number","borderWidth":"number","color":"number","marginLeft":"number","fontFamily":"String","marginHorizontal":"number","fontStyle":"String","paddingBottom":"number","paddingHorizontal":"number","scaleX":"number","onLayout":"boolean","flexWrap":"String","borderTopWidth":"number","borderRightWidth":"number","marginTop":"number","translateX":"number","rotation":"number","accessibilityLiveRegion":"String","alignItems":"String","accessibilityComponentType":"String","paddingVertical":"number","flex":"number","marginBottom":"number","bottom":"number","textAlign":"String","justifyContent":"String","fontWeight":"String","padding":"number","alignSelf":"String","backgroundColor":"number","right":"number","borderLeftWidth":"number","height":"number","left":"number","translateY":"number","paddingRight":"number","lineHeight":"number","flexDirection":"String","importantForAccessibility":"String","marginVertical":"number","fontSize":"number","accessibilityLabel":"String","width":"number","paddingLeft":"number","text":"String","top":"number","margin":"number","decomposedMatrix":"Map","marginRight":"number","testID":"String"}
```

Style:
`ReactNativeViewAttributes.RCTView`