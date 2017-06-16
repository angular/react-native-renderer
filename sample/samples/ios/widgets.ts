import {Component} from '@angular/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'widgets-list',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `
<TabBar tintColor="white" barTintColor="#005eb8">
  <TabBarItem systemIcon="history" badge="5" [selected]="selectedTab == 'one'" (select)="selectedTab='one'" [style]="{alignItems: 'center'}">
    <Text [styleSheet]="styles.title">Vertical scroll view</Text>
    <ScrollView [style]="{height: 120, width: 400}">
      <RefreshControl tintColor="#ce0058" title="Refreshing..."></RefreshControl>
      <View [styleSheet]="styles.odd" [style]="{height: 100}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 100}"></View>
      <View [styleSheet]="styles.odd" [style]="{height: 100}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 100}"></View>
    </ScrollView>
    <Text [styleSheet]="styles.title">Horizontal scroll view</Text>
    <ScrollView horizontal="true" [style]="{height: 120, width: 400}">
      <View [styleSheet]="styles.odd" [style]="{height: 120, width: 300}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 120, width: 300}"></View>
      <View [styleSheet]="styles.odd" [style]="{height: 120, width: 300}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 120, width: 300}"></View>
    </ScrollView>
    <Text [styleSheet]="styles.title">Nested text</Text>
    <Text [style]="{color: '#ce0058'}">Normal text<Text [style]="{color: '#00a9e0',fontSize: 20}">Nested one</Text></Text>
  </TabBarItem>

  <TabBarItem systemIcon="favorites" [selected]="selectedTab == 'two'" (select)="selectedTab='two'" [style]="{alignItems: 'center'}">
    <Text [styleSheet]="styles.title">Text input {{typed.length > 0 ? '-> ' + typed : ''}}</Text>
    <TextInput [style]="{width: 200, borderColor: 'gray', borderWidth: 1}" (submit)="typed=$event"></TextInput>
    <Text [styleSheet]="styles.title">Switch ({{switched}})</Text>
    <Switch (change)="switched=$event"></Switch>
    <Text [styleSheet]="styles.title">Slider ({{sliderValue}})</Text>
    <Slider value="0.6" [style]="{width: 200}" (valueChange)="sliderValue=$event"></Slider>
    <Text [styleSheet]="styles.title">Picker ({{selectedPicker}})</Text>
    <Picker [selectedValue]="selectedPicker" [items]="items" [style]="{width: 80}" (select)="selectedPicker=$event"></Picker>
  </TabBarItem>

  <TabBarItem systemIcon="more" [selected]="selectedTab == 'three'" (select)="selectedTab='three'" [style]="{alignItems: 'center'}">
    <Text [styleSheet]="styles.title">Activity indicators</Text>
    <View [style]="{flexDirection: 'row'}">
      <ActivityIndicator color="#ce0058"></ActivityIndicator>
      <ActivityIndicator color="#ce0058" size="large"></ActivityIndicator>
    </View>
    <Text [styleSheet]="styles.title">Progress view</Text>
    <ProgressView progress="0.6" progressTintColor="#ce0058" [style]="{width: 200}"></ProgressView>
    <Text [styleSheet]="styles.title">Segmented control ({{selected}})</Text>
    <SegmentedControl [values]="['One', 'Two','Three']" [selectedIndex]="selected" tintColor="#ce0058" [style]="{width: 200}" (change)="selected=$event.selectedIndex"></SegmentedControl>
    <Text [styleSheet]="styles.title">Date picker ({{selectedDate}})</Text>
    <DatePicker date="2016-03-18" (change)="selectedDate=$event"></DatePicker>
  </TabBarItem>
</TabBar>
`
})
export class WidgetsList {
  styles: any;
  selectedTab: string = 'one';
  typed: string = "";
  switched: boolean = false;
  selected: number = 1;
  selectedPicker: number = 2;
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