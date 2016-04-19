import {Component} from 'angular2/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'widgets-list',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `
<TabBar tintColor="white" barTintColor="#005eb8">
  <TabBarItem systemIcon="history" badge="5" [selected]="selectedTab == 'one'" (select)="selectedTab='one'" [style]="{alignItems: 'center'}">
    <Text [styleSheet]="styles.title">Vertical scroll view</Text>
    <ScrollView [style]="{height: 100, width: 400}">
      <RefreshControl tintColor="#ce0058" title="Refreshing..."></RefreshControl>
      <View [styleSheet]="styles.odd" [style]="{height: 120}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 120}"></View>
      <View [styleSheet]="styles.odd" [style]="{height: 120}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 120}"></View>
    </ScrollView>
    <Text [styleSheet]="styles.title">Horizontal scroll view</Text>
    <ScrollView horizontal="true" [style]="{height: 100, width: 400}">
      <View [styleSheet]="styles.odd" [style]="{height: 150, width: 300}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 150, width: 300}"></View>
      <View [styleSheet]="styles.odd" [style]="{height: 150, width: 300}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 150, width: 300}"></View>
    </ScrollView>
    <Text [styleSheet]="styles.title">Activity indicators</Text>
    <View [style]="{flexDirection: 'row'}">
      <ActivityIndicator color="#ce0058"></ActivityIndicator>
      <ActivityIndicator color="#ce0058" size="large"></ActivityIndicator>
    </View>
    <Text [styleSheet]="styles.title">Progress view</Text>
    <ProgressView progress="0.6" progressTintColor="#ce0058" [style]="{width: 200}"></ProgressView>
    <Text [styleSheet]="styles.title">Nested text</Text>
    <Text [style]="{color: '#ce0058'}">Normal text<Text [style]="{color: '#00a9e0',fontSize: 20}">Nested one</Text></Text>
  </TabBarItem>

  <TabBarItem systemIcon="favorites" [selected]="selectedTab == 'two'" (select)="selectedTab='two'" [style]="{alignItems: 'center'}">
    <Text [styleSheet]="styles.title">Text input {{typed.length > 0 ? '-> ' + typed : ''}}</Text>
    <TextInput [style]="{width: 200, borderColor: 'gray', borderWidth: 1}" (submit)="typed=$event"></TextInput>
    <Text [styleSheet]="styles.title">Switch ({{switched}})</Text>
    <Switch (change)="switched=$event"></Switch>
    <Text [styleSheet]="styles.title">Segmented control ({{selected}})</Text>
    <SegmentedControl [values]="['One', 'Two','Three']" selectedIndex="0" tintColor="#ce0058" [style]="{width: 200}" (change)="selected=$event.selectedIndex"></SegmentedControl>
    <Text [styleSheet]="styles.title">Slider ({{sliderValue}})</Text>
    <Slider value="0.6" [style]="{width: 200}" (valueChange)="sliderValue=$event"></Slider>
  </TabBarItem>

  <TabBarItem systemIcon="more" [selected]="selectedTab == 'three'" (select)="selectedTab='three'" [style]="{alignItems: 'center'}">
    <Text margin="10">Pickers ({{selected}})</Text>
    <Picker [selectedValue]="selected" [items]="items" [style]="{width: 80}" (select)="selected=$event"></Picker>
    <Text [styleSheet]="styles.title">Date picker ({{selectedDate}})</Text>
    <DatePicker date="2016-03-18" (change)="selectedDate=$event"></DatePicker>
  </TabBarItem>

  <TabBarItem systemIcon="search" [selected]="selectedTab == 'four'" (select)="selectedTab='four'" [style]="{alignItems: 'center'}">
    <Text [styleSheet]="styles.title">Map view</Text>
    <MapView [annotations]="[{latitude: 43.62, longitude: 7.07, title: 'Hello', tintColor: '#ce0058'}]" [region]="{latitude: 43.62, longitude: 7.07}"
      [overlays]="[{coordinates: [{latitude: 42, longitude: 2}, {latitude: 42, longitude: 12}], lineWidth: 2, strokeColor: '#ce0058'}]" [style]="{width: 320, height: 500}"></MapView>
  </TabBarItem>
</TabBar>
`
})
export class WidgetsList {
  styles: any;
  selectedTab: string = 'one';
  typed: string = "";
  switched: boolean = false;
  selected: number = 2;
  sliderValue: number = 0.6;
  selectedDate: Date = new Date('2016-03-18');
  items: Array<any> = [{label: 'aaa', value: 'a'}, {label: 'bbb', value: 'b'}, {label: 'ccc', value: 'c'}, {label: 'ddd', value: 'd'}, {label: 'eee', value: 'e'}];
  constructor() {
    this.styles = StyleSheet.create({
      odd: {
        backgroundColor: '#005eb8',
      },
      even: {
        backgroundColor: '#ce0058',
      },
      container: {
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
      },
      title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      }
    });
  }
}