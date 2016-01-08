import {Component} from 'angular2/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'hello-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `
<View [style]="styles.container">
  <Text [style]="styles.welcome">
    Welcome to ngReactNative!
  </Text>
  <Text [style]="styles.instructions">
    To get started, use the drawer menu on the left
  </Text>
  <Text [style]="styles.instructions">
    Shake or press menu button for dev menu
  </Text>
</View>
`
})
export class HelloApp {

  styles: any;
  constructor() {
    this.styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      },
      welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      },
      instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
      }
    });
  }
}

