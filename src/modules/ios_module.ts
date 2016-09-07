import {NgModule, ApplicationModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";


import {ActivityIndicator} from "../components/ios/_activity_indicator";
import {Image} from "../components/ios/_image";
import {Picker} from "../components/ios/_picker";
import {RefreshControl} from "../components/ios/_refresh_control";
import {ScrollView} from "../components/ios/_scrollview";
import {Slider} from "../components/ios/_slider";
import {Switch} from "../components/ios/_switch";
import {Text} from "../components/ios/_text";
import {TextInput} from "../components/ios/_textinput";
import {View} from "../components/ios/_view";
import {WebView} from "../components/ios/_webview";

import {DatePicker} from "../components/ios/date_picker";
import {MapView} from "../components/ios/map_view";
import {Navigator, NavigatorItem} from "../components/ios/navigator";
import {ProgressView} from "../components/ios/progress_view";
import {SegmentedControl} from "../components/ios/segmented_control";
import {TabBar} from "../components/ios/tabbar";
import {TabBarItem} from "../components/ios/tabbar_item";

@NgModule({
  declarations: [ActivityIndicator, Image, Picker, RefreshControl, ScrollView, Slider, Switch, Text, TextInput, View, WebView,
    DatePicker, MapView, Navigator, NavigatorItem, ProgressView, SegmentedControl, TabBar, TabBarItem],
  exports: [ActivityIndicator, Image, Picker, RefreshControl, ScrollView, Slider, Switch, Text, TextInput, View, WebView,
    DatePicker, MapView, Navigator, ProgressView, SegmentedControl, TabBar, TabBarItem],
  imports: [CommonModule, ApplicationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReactNativeiOSModule {}



