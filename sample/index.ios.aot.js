import {bootstrapReactNativeAOT} from 'angular-react-native/aot';
import {KitchenSinkModuleNgFactory} from "./samples/ios/module.ngfactory";

bootstrapReactNativeAOT('ngReactNative', KitchenSinkModuleNgFactory);