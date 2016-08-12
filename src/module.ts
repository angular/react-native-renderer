import {NgModule, CUSTOM_ELEMENTS_SCHEMA, ApplicationModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HTTP_PROVIDERS} from "./http/http";
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES} from "./router/router";
import {ActivityIndicator} from "./components/activity_indicator";
import {Image} from "./components/image";
import {Picker} from "./components/picker";
import {RefreshControl} from "./components/refresh_control";
import {ScrollView} from "./components/scrollview";
import {Switch} from "./components/switch";
import {Text} from "./components/text";
import {TextInput} from "./components/textinput";
import {View} from "./components/view";
import {WebView} from "./components/webview";
import {DrawerLayout, DrawerLayoutContent, DrawerLayoutSide} from "./components/android/drawer_layout";
import {PagerLayout} from "./components/android/pager_layout";
import {ProgressBar} from "./components/android/progress_bar";
import {Toolbar} from "./components/android/toolbar";
import {DatePicker} from "./components/ios/date_picker";
import {MapView} from "./components/ios/map_view";
import {Navigator, NavigatorItem} from "./components/ios/navigator";
import {ProgressView} from "./components/ios/progress_view";
import {SegmentedControl} from "./components/ios/segmented_control";
import {Slider} from "./components/slider";
import {TabBar} from "./components/ios/tabbar";
import {TabBarItem} from "./components/ios/tabbar_item";
import {OpacityFeedback} from "./directives/opacity_feedback";
import {RippleFeedback} from "./directives/android/ripple_feedback";
export {ActivityIndicator} from './components/activity_indicator';
export {Image} from './components/image';
export {Picker} from './components/picker';
export {RefreshControl} from './components/refresh_control';
export {ScrollView} from './components/scrollview';
export {Switch} from './components/switch';
export {Text} from './components/text';
export {TextInput} from './components/textinput';
export {View} from './components/view';
export {WebView} from './components/webview';

export {DrawerLayout} from './components/android/drawer_layout';
export {PagerLayout} from './components/android/pager_layout';
export {ProgressBar} from './components/android/progress_bar';
export {Toolbar} from './components/android/toolbar';

export {DatePicker} from './components/ios/date_picker';
export {MapView} from './components/ios/map_view';
export {Navigator} from './components/ios/navigator';
export {ProgressView} from './components/ios/progress_view';
export {SegmentedControl} from './components/ios/segmented_control';
export {Slider} from './components/slider';
export {TabBar} from './components/ios/tabbar';
export {TabBarItem} from './components/ios/tabbar_item';

export {OpacityFeedback} from './directives/opacity_feedback';
export {RippleFeedback} from './directives/android/ripple_feedback';

@NgModule({
  declarations: [ActivityIndicator, Image, Picker, RefreshControl, ScrollView, Switch, Text, TextInput, View, WebView,
    DrawerLayout, DrawerLayoutContent, DrawerLayoutSide, PagerLayout, ProgressBar, Toolbar,
    DatePicker, MapView, Navigator, ProgressView, SegmentedControl, Slider, TabBar, TabBarItem,
    OpacityFeedback, RippleFeedback, ROUTER_DIRECTIVES,
    NavigatorItem],
  exports: [ActivityIndicator, Image, Picker, RefreshControl, ScrollView, Switch, Text, TextInput, View, WebView,
   DrawerLayout, DrawerLayoutContent, DrawerLayoutSide, PagerLayout, ProgressBar, Toolbar,
   DatePicker, MapView, Navigator, ProgressView, SegmentedControl, Slider, TabBar, TabBarItem,
   OpacityFeedback, RippleFeedback, ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, ROUTER_PROVIDERS],
  imports: [ApplicationModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReactNativeModule {

}



