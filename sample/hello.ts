import {Component, NgIf, NgFor} from 'angular2/angular2';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'sub',
  template: `<Text>Sub-component says hello</Text>
  <ng-content select="view"></ng-content>
  <Text>--------</Text>
  <ng-content></ng-content>`
})
class Sub {}

@Component({
  selector: 'hello-app',
  directives: [NgIf, NgFor, Sub],
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
  <Text *ng-if="maybe" [style]="styles.row">ng-if says hello</Text>
  <sub [marginTop]="s" [marginBottom]="s" [style]="styles.row">
    <Text>Some content at the bottom</Text>
    <View><Text>Some content in a view, at the top</Text></View>
  </sub>
  <Text *ng-for="#item of items" [style]="styles.row">ng-for says {{item}}</Text>

  <TextInput value="hello"></TextInput>
  <View [style]="styles.button" (toptouchend)="handleEvent($event)">
    <Text>Button</Text>
  </View>
</View>
`
})
export class HelloApp {
  foo: string = "bar";
  s: number = 10;
  maybe: boolean = true;
  styles: any;
  items: Array<number> = [1, 2, 3, 4];
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
      row: {
        backgroundColor: '#E2DCF7',
      },
      button: {
        margin: 20,
        padding: 10,
        backgroundColor: '#800080'
      }
    });
  }

  handleEvent(event) {
    this.maybe = !this.maybe;
    this.foo += "!";
    this.items.splice(3,1);
    this.items.push(Math.ceil(Math.random()*10));
  }
}

