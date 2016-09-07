import {NgModule, ApplicationModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ActivityIndicator} from "../components/android/_activity_indicator";
import {Image} from "../components/android/_image";
import {Picker} from "../components/android/_picker";
import {RefreshControl} from "../components/android/_refresh_control";
import {ScrollView} from "../components/android/_scrollview";
import {Slider} from "../components/android/_slider";
import {Switch} from "../components/android/_switch";
import {Text} from "../components/android/_text";
import {TextInput} from "../components/android/_textinput";
import {View} from "../components/android/_view";
import {WebView} from "../components/android/_webview";

import {DrawerLayout, DrawerLayoutContent, DrawerLayoutSide} from "../components/android/drawer_layout";
import {PagerLayout} from "../components/android/pager_layout";
import {ProgressBar} from "../components/android/progress_bar";
import {Toolbar} from "../components/android/toolbar";

import {OpacityFeedback} from "../directives/opacity_feedback";
import {RippleFeedback} from "../directives/android/ripple_feedback";

@NgModule({
  declarations: [ActivityIndicator, Image, Picker, RefreshControl, ScrollView, Slider, Switch, Text, TextInput, View, WebView,
    DrawerLayout, DrawerLayoutContent, DrawerLayoutSide, PagerLayout, ProgressBar, Toolbar, OpacityFeedback, RippleFeedback],
  exports: [ActivityIndicator, Image, Picker, RefreshControl, ScrollView, Slider, Switch, Text, TextInput, View, WebView,
    DrawerLayout, DrawerLayoutContent, DrawerLayoutSide, PagerLayout, ProgressBar, Toolbar, OpacityFeedback, RippleFeedback],
  imports: [CommonModule, ApplicationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReactNativeAndroidModule {}



