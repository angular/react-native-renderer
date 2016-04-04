import {bootstrapReactNative, HTTP_PROVIDERS, ROUTER_PROVIDERS} from 'angular2-react-native';
import {KitchenSinkApp} from "./samples/android/kitchensink";

bootstrapReactNative('ngReactNative', KitchenSinkApp, [HTTP_PROVIDERS, ROUTER_PROVIDERS]);