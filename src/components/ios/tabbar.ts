import {Component, Inject} from 'angular2/core';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./../component";
import {REACT_NATIVE_WRAPPER} from './../../renderer/renderer';
import {ReactNativeWrapper} from "../../wrapper/wrapper";

/**
 * A component for displaying a tab bar.
 *
 * ```
@Component({
  selector: 'sample',
  template: `
<TabBar tintColor="white" barTintColor="darkslateblue">
  <TabBarItem systemIcon="history" [selected]="selectedTab == 'one'" (select)="selectedTab='one'"><Text>Tab one</Text></TabBarItem>
  <TabBarItem systemIcon="favorites" [selected]="selectedTab == 'two'" (select)="selectedTab='two'"><Text>Tab two</Text></TabBarItem>
  <TabBarItem systemIcon="featured" badge="8" [selected]="selectedTab == 'three'" (select)="selectedTab='three'"><Text>Tab three</Text></TabBarItem>
</TabBar>
  `
})
export class Sample {
  selectedTab: string = 'one';
}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform ios
 */
@Component({
  selector: 'TabBar',
  inputs: [
    'barTintColor', 'tintColor', 'translucent'
  ].concat(GENERIC_INPUTS),
  template: `<native-tabbar [barTintColor]="_barTintColor" [tintColor]="_tintColor" [translucent]="_translucent"
  ${GENERIC_BINDINGS}><ng-content></ng-content></native-tabbar>`
})
export class TabBar extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({flex: 1});
  }

  //Properties
  private _barTintColor: number;
  private _tintColor: number;
  private _translucent: boolean;
  /**
   * To be documented
   */
  set barTintColor(value: string) {this._barTintColor = this.processColor(value);}
  /**
   * To be documented
   */
  set tintColor(value: string) {this._tintColor = this.processColor(value);}
  /**
   * To be documented
   */
  set translucent(value: string) {this._translucent = this.processBoolean(value);}
}
