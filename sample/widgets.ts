import {Component, ElementRef} from 'angular2/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'widgets-list',
  host: {flex: '1'},
  template: `
<PagerLayout flex="1" justifyContent="center" alignItems="center" selectedPage="0">
  <View [style]="styles.container">
    <Text [style]="styles.title">Scroll views</Text>
    <Text margin="10">Vertical</Text>
    <ScrollView height="150" width="400" backgroundColor="#FF0000">
      <View collapsable="false">
        <View [style]="styles.odd" height="120"></View>
        <View [style]="styles.even" height="120"></View>
        <View [style]="styles.odd" height="120"></View>
        <View [style]="styles.even" height="120"></View>
      </View>
    </ScrollView>
    <Text margin="10">Horizontal</Text>
    <HorizontalScrollView height="150" width="400">
      <View collapsable="false" alignSelf="flex-start" flexDirection="row">
        <View [style]="styles.odd" height="150" width="300"></View>
        <View [style]="styles.even" height="150" width="300"></View>
        <View [style]="styles.odd" height="150" width="300"></View>
        <View [style]="styles.even" height="150" width="300"></View>
      </View>
    </HorizontalScrollView>
  </View>
  <View [style]="styles.container">
    <Text [style]="styles.title">Inputs and text</Text>
    <Text margin="10">Text input {{typed.length > 0 ? '-> ' + typed : ''}}</Text>
    <TextInput placeholder="Type in" (topTouchEnd)="$event.target.dispatchCommand('focusTextInput')" (topSubmitEditing)="typed=$event.text; $event.target.dispatchCommand('blurTextInput')"></TextInput>
    <Text margin="10">Switch ({{switched}})</Text>
    <Switch height="27" width="50" (topChange)="switched=$event.value; $event.target.setProperty('on', $event.value)"></Switch>
    <Text margin="10">Pickers ({{selected}})</Text>
    <DropdownPicker [selected]="selected" prompt="Please select an item" [items]="items" height="30" width="80" (topSelect)="selected=$event.position"></DropdownPicker>
    <DialogPicker [selected]="selected" prompt="Please select an item" [items]="items" height="30" width="80" (topSelect)="selected=$event.position"></DialogPicker>
    <Text margin="10">Virtual text</Text>
    <Text color="#ce0058">NormalText<VirtualText fontSize="20" color="#00a9e0">VirtualText</VirtualText></Text>
  </View>
  <View [style]="styles.container">
    <Text [style]="styles.title">Progress bars</Text>
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