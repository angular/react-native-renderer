import {bootstrapReactNativeAOT} from 'angular-react-native/aot';
import {KitchenSinkModuleNgFactory} from "./samples/android/module.ngfactory";

bootstrapReactNativeAOT('ngReactNative', KitchenSinkModuleNgFactory);