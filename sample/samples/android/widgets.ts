import {Component, ElementRef} from 'angular2/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'widgets-list',
  host: {flex: '1'},
  template: `
<PagerLayout initialPage="0" [style]="{flex: 1, justifyContent: 'center', alignItems: 'center'}">
  <View [styleSheet]="styles.container">
    <Text [styleSheet]="styles.title">Scroll views</Text>
    <Text [style]="{margin: 10}">Vertical</Text>
    <ScrollView [style]="{height: 150, width: 400}">
      <View [styleSheet]="styles.odd" [style]="{height: 120}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 120}"></View>
      <View [styleSheet]="styles.odd" [style]="{height: 120}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 120}"></View>
    </ScrollView>
    <Text [style]="{margin: 10}">Horizontal</Text>
    <ScrollView horizontal="true" [style]="{height: 150, width: 400}">
      <View [styleSheet]="styles.odd" [style]="{height: 150, width: 300}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 150, width: 300}"></View>
      <View [styleSheet]="styles.odd" [style]="{height: 150, width: 300}"></View>
      <View [styleSheet]="styles.even" [style]="{height: 150, width: 300}"></View>
    </ScrollView>
  </View>
  <View [styleSheet]="styles.container">
    <Text [styleSheet]="styles.title">Inputs and text</Text>
    <Text [style]="{margin: 10}">Text input {{typed.length > 0 ? '-> ' + typed : ''}}</Text>
    <TextInput placeholder="Type in" (submit)="typed=$event"></TextInput>
    <Text [style]="{margin: 10}">Switch ({{switched}})</Text>
    <Switch (change)="switched=$event"></Switch>
    <Text margin="10">Pickers ({{selected}})</Text>
    <Picker [selectedValue]="selected" prompt="Please select an item" [items]="items" [style]="{width: 80}" (select)="selected=$event"></Picker>
    <Picker mode="dropdown" [selectedValue]="selected" [items]="items" [style]="{width: 80}" (select)="selected=$event"></Picker>
    <Text [style]="{margin: 10}">Nested text</Text>
    <Text [style]="{color: '#ce0058'}">Normal text<Text [style]="{color: '#00a9e0',fontSize: 20}">Nested one</Text></Text>
  </View>
  <View [styleSheet]="styles.container">
    <Text [styleSheet]="styles.title">Progress bars</Text>
    <ProgressBar styleAttr="Large"></ProgressBar>
    <ProgressBar styleAttr="Inverse" color="#ce0058"></ProgressBar>
    <ProgressBar styleAttr="Small"></ProgressBar>
    <ProgressBar styleAttr="Horizontal"></ProgressBar>
  </View>
</PagerLayout>
`
})
export class WidgetsList {
  styles: any;
  typed: string = "";
  switched: boolean = false;
  selected: number = 0;
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
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
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