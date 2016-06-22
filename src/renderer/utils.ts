import {provide, PLATFORM_DIRECTIVES} from '@angular/core';

import {View} from "./../components/view";
import {Text} from "../components/text";
import {Switch} from "../components/switch";
import {TextInput} from "../components/textinput";
import {WebView} from "../components/webview";
import {ProgressBar} from "../components/android/progress_bar";
import {PagerLayout} from "../components/android/pager_layout";
import {DrawerLayout, DrawerLayoutSide, DrawerLayoutContent} from "../components/android/drawer_layout";
import {RefreshControl} from "../components/refresh_control";
import {Toolbar} from "../components/android/toolbar";
import {Image} from '../components/image';
import {ScrollView} from "../components/scrollview";
import {Picker} from "../components/picker";
import {ActivityIndicator} from '../components/activity_indicator';
import {Navigator} from '../components/ios/navigator';
import {ProgressView} from "../components/ios/progress_view";
import {SegmentedControl} from "../components/ios/segmented_control";
import {Slider} from "../components/slider";
import {DatePicker} from "../components/ios/date_picker";
import {MapView} from "../components/ios/map_view";
import {TabBar} from "../components/ios/tabbar";
import {TabBarItem} from "../components/ios/tabbar_item";

export function getAmbientComponents(): Array<any> {
  return [
    //Common components
    provide(PLATFORM_DIRECTIVES, {useValue: [Image], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [Picker], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [RefreshControl], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [ScrollView], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [Switch], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [Text], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [TextInput], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [View], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [WebView], multi:true}),
    //Android components
    provide(PLATFORM_DIRECTIVES, {useValue: [DrawerLayout], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [DrawerLayoutSide], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [DrawerLayoutContent], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [PagerLayout], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [ProgressBar], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [Toolbar], multi:true}),
    //iOS components
    provide(PLATFORM_DIRECTIVES, {useValue: [ActivityIndicator], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [DatePicker], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [MapView], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [Navigator], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [ProgressView], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [SegmentedControl], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [Slider], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [TabBar], multi:true}),
    provide(PLATFORM_DIRECTIVES, {useValue: [TabBarItem], multi:true})
  ];
}