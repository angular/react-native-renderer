import {Component} from 'angular2/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'kitchensink-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
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
<TextInput placeholder="Type in" (topTouchEnd)="$event.target.focus()" (topSubmitEditing)="typed=$event.text; $event.target.blur()"></TextInput>

<Text>Virtual text</Text>
<Text>NormalText<VirtualText fontSize="20">VirtualText</VirtualText></Text>

<Text>Switch ({{switched}})</Text>
<Switch height="27" width="40" (topChange)="switched=$event.value; $event.target.setProperty('on', $event.value)"></Switch>

<Text>Progress bar</Text>
<ProgressBar styleAttr="Large"></ProgressBar>
`
})
export class KitchenSinkApp {
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