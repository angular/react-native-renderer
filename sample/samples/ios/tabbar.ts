import {Component} from 'angular2/core';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'tabbar-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `
<TabBar tintColor="white" barTintColor="darkslateblue">
  <TabBarItem systemIcon="history" [selected]="selectedTab == 'one'" (select)="selectedTab='one'"><Text [styleSheet]="styles.tabText">Tab one</Text></TabBarItem>
  <TabBarItem systemIcon="favorites" [selected]="selectedTab == 'two'" (select)="selectedTab='two'"><Text [styleSheet]="styles.tabText">Tab two</Text></TabBarItem>
  <TabBarItem systemIcon="featured" badge="8" [selected]="selectedTab == 'three'" (select)="selectedTab='three'"><Text [styleSheet]="styles.tabText">Tab three</Text></TabBarItem>
</TabBar>
`
})
export class TabBarApp {
  selectedTab: string = 'one';
  styles: any;
  constructor() {
    this.styles = StyleSheet.create({
      tabText: {
        margin: 50,
        fontSize: 20
      }
    });
  }
}
