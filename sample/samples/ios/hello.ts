import {Component} from '@angular/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'hello-app',
  host: {flex: '1'},
  template: `
<View [styleSheet]="styles.container">
  <Text [styleSheet]="styles.welcome">
    Welcome to ngReactNative!
  </Text>
  <Text [styleSheet]="styles.instructions">
    To get started, use the buttons below
  </Text>
  <Text [styleSheet]="styles.instructions">
    Shake or press cmd + D for dev menu
  </Text>
  <View [style]="{flexDirection: 'row', marginTop: 20}">
    <Text [styleSheet]="styles.button" opacityFeedback routerLink="widgets">Components</Text>
    <Text [styleSheet]="styles.button" opacityFeedback routerLink="webview">Webview</Text>
  </View>
  <View [style]="{flexDirection: 'row', marginTop: 10}">
    <Text [styleSheet]="styles.button" opacityFeedback routerLink="apis">APIs</Text>
    <Text [styleSheet]="styles.button" opacityFeedback routerLink="todomvc">TodoMVC</Text>
  </View>
  <View [style]="{flexDirection: 'row', marginTop: 10}">
    <Text [styleSheet]="styles.button" opacityFeedback routerLink="gestures">Gestures</Text>
    <Text [styleSheet]="styles.button" opacityFeedback routerLink="http">Http</Text>
  </View>
  <View [style]="{flexDirection: 'row', marginTop: 10}">
    <Text [styleSheet]="styles.button" opacityFeedback routerLink="animation">Animation</Text>
  </View>
</View>
<Image [styleSheet]="styles.image" [style]="{left: 0}" [source]="angularLogo"></Image>
<Image [styleSheet]="styles.image" [style]="{right: 0}" [source]="reactLogo" ></Image>
`
})
export class HelloApp {
  angularLogo: any = require('../../assets/angular.png');
  reactLogo: any = require('../../assets/react.png');
  styles: any;
  constructor() {
    this.styles = StyleSheet.create({
      container: {
        flex: 1,
        paddingTop: 120,
        alignItems: 'center'
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
      },
      image: {
        height: 100,
        width: 100,
        overflow: 'hidden',
        position: 'absolute',
        top: 0
      },
      button: {
        borderColor: '#005eb8',
        borderWidth: 3,
        color: '#005eb8',
        width: 150,
        padding: 10,
        margin: 10,
        textAlign: 'center',
        fontSize: 20,
        borderRadius: 10
      }
    });
  }
}

