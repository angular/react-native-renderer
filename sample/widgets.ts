import {Component, ElementRef} from 'angular2/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'cpt-list',
  host: {flex: '1'},
  template: `
<Text>Vertical scroll view</Text>
<ScrollView height="100">
  <View collapsable="false">
    <View [style]="styles.odd" height="60"></View>
    <View [style]="styles.even" height="60"></View>
    <View [style]="styles.odd" height="60"></View>
    <View [style]="styles.even" height="60"></View>
  </View>
</ScrollView>

<Text>Horizontal scroll view</Text>
<HorizontalScrollView height="100">
  <View collapsable="false" alignSelf="flex-start" flexDirection="row">
    <View [style]="styles.odd" height="100" width="300"></View>
    <View [style]="styles.even" height="100" width="300"></View>
    <View [style]="styles.odd" height="100" width="300"></View>
    <View [style]="styles.even" height="100" width="300"></View>
  </View>
</HorizontalScrollView>

<Text>Text input {{typed.length > 0 ? '-> ' + typed : ''}}</Text>
<TextInput placeholder="Type in" (topTouchEnd)="$event.target.dispatchCommand('focusTextInput')" (topSubmitEditing)="typed=$event.text; $event.target.dispatchCommand('blurTextInput')"></TextInput>

<Text>Virtual text</Text>
<Text>NormalText<VirtualText fontSize="20">VirtualText</VirtualText></Text>

<Text>Switch ({{switched}})</Text>
<Switch height="27" width="50" marginLeft="50" (topChange)="switched=$event.value; $event.target.setProperty('on', $event.value)"></Switch>

<Text>Progress bar</Text>
<ProgressBar styleAttr="Large"></ProgressBar>
`
})
export class ComponentsList {
  styles: any;
  typed: string = "";
  switched: boolean = false;
  constructor() {
    this.styles = StyleSheet.create({
      odd: {
        backgroundColor: '#005eb8',
      },
      even: {
        backgroundColor: '#ce0058',
      }
    });
  }
}