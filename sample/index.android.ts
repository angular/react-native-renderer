import {bootstrapReactNative, HTTP_PROVIDERS, ROUTER_PROVIDERS} from 'react-native-renderer/react-native-renderer';
import {KitchenSinkApp} from "./samples/android/kitchensink";

bootstrapReactNative('ngReactNative', KitchenSinkApp, [HTTP_PROVIDERS, ROUTER_PROVIDERS]);