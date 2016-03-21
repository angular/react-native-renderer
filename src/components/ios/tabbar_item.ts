import {Component, Inject, Output, EventEmitter} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./../component";
import {REACT_NATIVE_WRAPPER} from './../../renderer/renderer';
import {ReactNativeWrapper} from "../../wrapper/wrapper";

/**
 * A component for displaying an item of a tab bar.
 *
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform ios
 */
@Component({
  selector: 'TabBarItem',
  directives: [NgIf],
  inputs: [
    'badge', 'icon', 'selected', 'selectedIcon', 'systemIcon', 'title'
  ].concat(GENERIC_INPUTS),
  template: `<native-tabbaritem [badge]="_badge" [icon]="_icon" [selected]="_selected" [selectedIcon]="_selectedIcon"
  [systemIcon]="_systemIcon" [title]="_title" onPress="true" (topPress)="_handlePress()"
  ${GENERIC_BINDINGS}><ng-content *ngIf="_selected"></ng-content></native-tabbaritem>`
})
export class TabBarItem extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
  }

  //Events
  /**
   * To be documented
   */
  @Output() select: EventEmitter<any> = new EventEmitter();

  //Properties
  private _badge: number|string;
  private _icon: any;
  private _selected: boolean;
  private _selectedIcon: any;
  private _systemIcon: string;
  private _title: string;
  /**
   * To be documented
   */
  set badge(value: any) {this._badge = this.processNumber(value);}
  /**
   * To be documented
   */
  set icon(value: any) {this._icon = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set selected(value: any) {this._selected = this.processBoolean(value);}
  /**
   * To be documented
   */
  set selectedIcon(value: any) {this._selectedIcon = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set systemIcon(value: string) {
    this._systemIcon = this.processEnum(value, ['bookmarks', 'contacts', 'downloads', 'favorites', 'featured', 'history',
      'more', 'most-recent', 'most-viewed', 'recents', 'search', 'top-rated']);
  }
  /**
   * To be documented
   */
  set title(value: string) {this._title = value;}

  _handlePress() {
    this.select.emit(null);
  }
}
