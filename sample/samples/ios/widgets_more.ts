import {Component, ElementRef} from 'angular2/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'widgets-list',
  host: {flex: '1'},
  template: `

<View [styleSheet]="styles.container">
  <Text [styleSheet]="styles.title">Activity indicators</Text>
  <View [style]="{flexDirection: 'row'}">
    <ActivityIndicator color="#ce0058"></ActivityIndicator>
    <ActivityIndicator color="#ce0058" size="large"></ActivityIndicator>
  </View>
  <Text [styleSheet]="styles.title">Progress view</Text>
  <ProgressView progress="0.6" progressTintColor="#ce0058" [style]="{width: 200}"></ProgressView>
  <Text [styleSheet]="styles.title">Segmented control ({{selected}})</Text>
  <SegmentedControl [values]="['One', 'Two','Three']" selectedIndex="0" tintColor="#ce0058" [style]="{width: 200}" (change)="selected=$event.selectedIndex"></SegmentedControl>
  <Text [styleSheet]="styles.title">Slider ({{sliderValue}})</Text>
  <Slider value="0.6" [style]="{width: 200}" (valueChange)="sliderValue=$event"></Slider>
  <Text [styleSheet]="styles.title">Map view</Text>
  <MapView [annotations]="[{latitude: 43.62, longitude: 7.07, title: 'Hello', tintColor: '#ce0058'}]" [region]="{latitude: 43.62, longitude: 7.07}"
    [overlays]="[{coordinates: [{latitude: 42, longitude: 2}, {latitude: 42, longitude: 12}], lineWidth: 2, strokeColor: '#ce0058'}]" [style]="{width: 320, height: 150}"></MapView>
  <Text [styleSheet]="styles.title">Date picker ({{selectedDate}})</Text>
  <DatePicker date="2016-03-18" (change)="selectedDate=$event"></DatePicker>
</View>
`
})
export class WidgetsList {
  styles: any;
  selected: number = 0;
  sliderValue: number = 0.6;
  selectedDate: Date = new Date('2016-03-18');
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