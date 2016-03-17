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
</View>
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