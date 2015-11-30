import {Component} from 'angular2/angular2';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'hello-app',
  template: `
<View [style]="styles.container">
  <Text [style]="styles.welcome">
    Welcome to ngReactNative!
  </Text>
  <Text [style]="styles.instructions">
    To get started, edit hello.ts
  </Text>
  <Text [style]="styles.instructions" [fontSize]="s">
    Shake or press menu button for dev menu {{foo}}
  </Text>
</View>
`
})
export class HelloApp {
  foo: string = "bar";
  s: number = 30;
  styles: any;
  constructor() {
    this.styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFB6C1',
      },
      welcome: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: '#2F3B75'
      },
      instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
      },
    });

    setTimeout(() => {
      this.foo = "baz";
      this.s = 20;
    }, 2000)
  }
}

