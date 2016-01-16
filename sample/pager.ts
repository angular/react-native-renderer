import {Component} from 'angular2/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'pager-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `
<PagerLayout flex="1" justifyContent="center" alignItems="center" selectedPage="0">
  <View [style]="styles.container">
    <Text [style]="styles.welcome">
      First page
    </Text>
  </View>
  <View [style]="styles.container">
    <Text [style]="styles.welcome">
      Second page
    </Text>
  </View>
  <View [style]="styles.container">
    <Text [style]="styles.welcome">
      Third page
    </Text>
  </View>
</PagerLayout>

`
})
export class PagerApp {
  styles: any;
  constructor() {
    this.styles = StyleSheet.create({
      container: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
      },
      welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      }
    });
  }
}

