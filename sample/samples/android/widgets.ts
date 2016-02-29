import {Component, ElementRef} from 'angular2/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'widgets-list',
  host: {flex: '1'},
  template: `
<PagerLayout initialPage="0" [style]="{flex: 1, justifyContent: 'center', alignItems: 'center'}">
  <native-view [style]="styles.container">
    <native-text [style]="styles.title">Scroll views</native-text>
    <native-text margin="10">Vertical</native-text>
    <ScrollView [style]="{height: 150, width: 400}">
      <native-view [style]="styles.odd" height="120"></native-view>
      <native-view [style]="styles.even" height="120"></native-view>
      <native-view [style]="styles.odd" height="120"></native-view>
      <native-view [style]="styles.even" height="120"></native-view>
    </ScrollView>
    <native-text margin="10">Horizontal</native-text>
    <ScrollView horizontal="true" [style]="{height: 150, width: 400}">
      <native-view [style]="styles.odd" height="150" width="300"></native-view>
      <native-view [style]="styles.even" height="150" width="300"></native-view>
      <native-view [style]="styles.odd" height="150" width="300"></native-view>
      <native-view [style]="styles.even" height="150" width="300"></native-view>
    </ScrollView>
  </native-view>
  <native-view [style]="styles.container">
    <native-text [style]="styles.title">Inputs and text</native-text>
    <native-text margin="10">Text input {{typed.length > 0 ? '-> ' + typed : ''}}</native-text>
    <native-textinput placeholder="Type in" (topTouchEnd)="$event.target.dispatchCommand('focusTextInput')" (topSubmitEditing)="typed=$event.text; $event.target.dispatchCommand('blurTextInput')"></native-textinput>
    <native-text margin="10">Switch ({{switched}})</native-text>
    <Switch (change)="switched=$event"></Switch>
    <native-text margin="10">Pickers ({{selected}})</native-text>
    <Picker [selectedValue]="selected" prompt="Please select an item" [items]="items" [style]="{width: 80}" (select)="selected=$event"></Picker>
    <Picker mode="dropdown" [selectedValue]="selected" [items]="items" [style]="{width: 80}" (select)="selected=$event"></Picker>
    <native-text margin="10">Nested text</native-text>
    <Text [style]="{color: '#ce0058'}">Normal text<Text [style]="{color: '#00a9e0',fontSize: 20}">Nested one</Text></Text>
  </native-view>
  <native-view [style]="styles.container">
    <native-text [style]="styles.title">Progress bars</native-text>
    <ProgressBar styleAttr="Large"></ProgressBar>
    <ProgressBar styleAttr="Inverse" color="#ce0058"></ProgressBar>
    <ProgressBar styleAttr="Small"></ProgressBar>
    <ProgressBar styleAttr="Horizontal"></ProgressBar>
  </native-view>
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