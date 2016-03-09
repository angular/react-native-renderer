import {Component, Inject, Output, EventEmitter} from 'angular2/core';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";
import {REACT_NATIVE_WRAPPER} from './../renderer/renderer';
import {ReactNativeWrapper, isAndroid} from "../wrapper/wrapper";

var ANDROID_INPUTS: Array<string> = ['colors', 'enabled', 'progressBackgroundColor', 'size'];
var IOS_INPUTS: Array<string> = ['tintColor', 'title'];

var ANDROID_BINDINGS: string = `[colors]="_colors" [enabled]="_enabled" [progressBackgroundColor]="_progressBackgroundColor" [size]="_size"`;
var IOS_BINDINGS: string = `[tintColor]="_tintColor" [title]="_title"`;

/**
 * A component for displaying a refresh control.
 *
 * ```
@Component({
  selector: 'sample',
  template: `<RefreshControl progressBackgroundColor="#ce0058" [colors]="['#00a9e0', '#309712']">
      <View></View>
    </RefreshControl>`
})
export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 */
@Component({
  selector: 'RefreshControl',
  inputs: [
    'refreshing'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-refreshcontrol  [refreshing]="_refreshing"
  (topRefresh)="_handleRefresh($event)"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}><ng-content></ng-content></native-refreshcontrol>`
})
export class RefreshControl extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
  }

  //Events
  /**
   * To be documented
   */
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  //Properties
  private _refreshing: boolean;
  /**
   * To be documented
   */
  set refreshing(value: string) {this._refreshing = this.processBoolean(value);}

  private _colors: Array<number>;
  private _enabled: boolean;
  private _progressBackgroundColor: number;
  private _size: number;
  /**
   * To be documented
   * @platform android
   */
  set colors(value: string|Array<string>) {
    if (Array.isArray(value)) {
      this._colors = value.map((v) => this.processColor(v));
    } else {
      this._colors = [this.processColor(value)];
    }
  }
  /**
   * To be documented
   * @platform android
   */
  set enabled(value: any) {this._enabled = this.processBoolean(value);}
  /**
   * To be documented
   * @platform android
   */
  set progressBackgroundColor(value: string) {this._progressBackgroundColor = this.processColor(value);}
  /**
   * To be documented
   * @platform android
   */
  set size(value: any) {
    this._size = value === 'default' ?
      this.getUIManager().AndroidSwipeRefreshLayout.Constants.SIZE.DEFAULT :
      this.getUIManager().AndroidSwipeRefreshLayout.Constants.SIZE.LARGE;
  }

  private _tintColor: number;
  private _title: string;
  /**
   * To be documented
   * @platform ios
   */
  set tintColor(value: string) {this._tintColor = this.processColor(value);}
  /**
   * To be documented
   * @platform ios
   */
  set title(value: string) {this._title = value;}

  //Event handlers
  _handleRefresh(event: any) {
    //Event example: null
    this.refresh.emit(null);
    event.target.setProperty('refreshing', !!this._refreshing);
  }
}
