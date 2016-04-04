import {bootstrapReactNative, ROUTER_PROVIDERS, HTTP_PROVIDERS} from 'angular2-react-native';
import {KitchenSinkApp} from "./samples/ios/kitchensink";

bootstrapReactNative('ngReactNative', KitchenSinkApp, [ROUTER_PROVIDERS, HTTP_PROVIDERS]);