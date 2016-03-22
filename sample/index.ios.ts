import {bootstrapReactNative, ROUTER_PROVIDERS} from 'react-native-renderer/react-native-renderer';
import {KitchenSinkApp} from "./samples/ios/kitchensink";

bootstrapReactNative('ngReactNative', KitchenSinkApp, [ROUTER_PROVIDERS]);