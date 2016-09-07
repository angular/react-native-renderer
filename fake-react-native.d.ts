//TODO: switch to react-native.d.ts form typings

declare module "react-native" {
  export var StyleSheet: any;
  export var Alert: any;
  export var Linking: any;
  export var Clipboard: any
  export var Platform: any;
  export var PixelRatio: any;
  export var NetInfo: any;
  export var AppState: any;
  export var NativeModules: any;
  export var processColor: any;
  export var AsyncStorage: any;

  export var DatePickerAndroid: any;
  export var TimePickerAndroid: any;
  export var BackAndroid: any;
  export var ToastAndroid: any;

  export var ActionSheetIOS: any;
  export var AlertIOS: any;
}