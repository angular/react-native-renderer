import {Component, Inject, Output, EventEmitter} from "@angular/core";
import {REACT_NATIVE_WRAPPER} from "../../renderer/renderer";
import {ReactNativeWrapper, isAndroid} from "../../wrapper/wrapper";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = [];
var IOS_INPUTS: Array<string> = ['onTintColor', 'thumbTintColor', 'tintColor'];

var ANDROID_BINDINGS: string = ``;
var IOS_BINDINGS: string = `[_onTintColor]="_onTintColor" [thumbTintColor]="_thumbTintColor" [tintColor]="_tintColor" onChange="true"`;

/**
 * A component for displaying a switch.
 *
 * ```
@Component({
  selector: 'sample',
  template: `<Switch (change)="switched=$event"></Switch>`
})
export class Sample {
  switched: boolean = false;
 }
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 */
@Component({
  selector: 'Switch',
  inputs: [
   'on', 'enabled'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-switch [_on]="_on" [enabled]="_enabled"
  (topChange)="_handleChange($event)" ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-switch>`
})
export class Switch extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({height: 31, width: 51});
  }

  //Events
  /**
   * To be documented
   */
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  //Properties
  private _on: boolean = false;
  private _enabled: boolean = true;
  /**
   * To be documented
   */
  set on(value: string) {this._on = this.processBoolean(value);}
  /**
   * To be documented
   */
  set enabled(value: any) { this._enabled = this.processBoolean(value);}

  private _onTintColor: number;
  private _thumbTintColor: number;
  private _tintColor: number;
  /**
   * To be documented
   * @platform ios
   */
  set onTintColor(value: string) {this._onTintColor = this.processColor(value);}
  /**
   * To be documented
   * @platform ios
   */
  set thumbTintColor(value: string) { this._thumbTintColor = this.processColor(value);}
  /**
   * To be documented
   * @platform ios
   */
  set tintColor(value: string) { this._tintColor = this.processColor(value);}

  _handleChange(event: any) {
    this._on = event.value;
    this.change.emit(this._on);
  }
}
