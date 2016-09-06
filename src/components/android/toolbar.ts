import {Component, Inject, Output, EventEmitter} from "@angular/core";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "../common/component";
import {REACT_NATIVE_WRAPPER} from "./../../renderer/renderer";
import {ReactNativeWrapper} from "../../wrapper/wrapper";

/**
 * A component for displaying a toolbar.
 *
 * ```
@Component({
  selector: 'sample',
  template: `<Toolbar [styleSheet]="styles.toolbar" [navIcon]="hamburgerIcon" [overflowIcon]="moreIcon"
    title="Kitchen Sink" titleColor="#FFFFFF" (select)="handleToolbar($event)"></Toolbar>`
})
export class Sample {
  hamburgerIcon: any = require('../../assets/icon_hamburger.png');
  moreIcon: any = require('../../assets/icon_more.png');
 }
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform android
 */
@Component({
  selector: 'Toolbar',
  inputs: [
    'actions', 'contentInsetStart', 'contentInsetEnd', 'logo', 'navIcon', 'overflowIcon', 'rtl', 'subtitle', 'subtitleColor', 'title', 'titleColor'
  ].concat(GENERIC_INPUTS),
  template: `<native-toolbar [nativeActions]="_actions" [contentInsetStart]="_contentInsetStart" [contentInsetEnd]="_contentInsetEnd" [logo]="_logo"
  [navIcon]="_navIcon" [overflowIcon]="_overflowIcon" [rtl]="_rtl" [subtitle]="_subtitle" [subtitleColor]="_subtitleColor" [title]="_title" [titleColor]="_titleColor"
  (topSelect)="_handleSelect($event)" ${GENERIC_BINDINGS}></native-toolbar>`
})
export class Toolbar extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
  }

  //Events
  /**
   * To be documented
   */
  @Output() select: EventEmitter<any> = new EventEmitter();

  //Properties
  private _actions: Array<any>; //[{title: string, icon: optionalImageSource, show: enum('always', 'ifRoom', 'never'), showWithText: bool}]
  private _contentInsetStart: number;
  private _contentInsetEnd: number;
  private _logo: any;
  private _navIcon: any;
  private _overflowIcon: any;
  private _rtl: boolean;
  private _subtitle: string = null;
  private _subtitleColor: number;
  private _title: string;
  private _titleColor: number;
  /**
   * To be documented
   */
  set actions(value: Array<any>) {this._actions = value.map((action) => {
    var result: any = {};
    if (typeof action.title != 'undefined') {
      result['title'] = action.title;
    }
    if (typeof action.icon != 'undefined') {
      result['icon'] = this.resolveAssetSource(action.icon);
    }
    result['show'] = this.getUIManager().ToolbarAndroid.Constants.ShowAsAction[action.show] || 0;
    if (typeof action.icon != 'undefined') {
      result['showWithText'] = action.showWithText;
    }
    return result;
  });}
  /**
   * To be documented
   */
  set contentInsetStart(value: any) {this._contentInsetStart = this.processNumber(value);}
  /**
   * To be documented
   */
  set contentInsetEnd(value: any) {this._contentInsetEnd = this.processNumber(value);}
  /**
   * To be documented
   */
  set logo(value: any) {this._logo = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set navIcon(value: any) {this._navIcon = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set overflowIcon(value: any) {this._overflowIcon = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set rtl(value: string) {this._rtl = this.processBoolean(value);}
  /**
   * To be documented
   */
  set subtitle(value: string) {this._subtitle = value;}
  /**
   * To be documented
   */
  set subtitleColor(value: any) {this._subtitleColor = this.processColor(value);}
  /**
   * To be documented
   */
  set title(value: string) {this._title = value;}
  /**
   * To be documented
   */
  set titleColor(value: any) {this._titleColor = this.processColor(value);}


  _handleSelect(event: any) {
    // Event examples: {position: -1}
    this.select.emit(event);
  }
}
