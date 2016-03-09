import {Component, Inject} from 'angular2/core';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./../component";
import {REACT_NATIVE_WRAPPER} from './../../renderer/renderer';
import {ReactNativeWrapper} from "../../wrapper/wrapper";

/**
 * A component for displaying a progress bar.
 *
 * ```
@Component({
  selector: 'sample',
  template: `<ProgressBar styleAttr="Large"></ProgressBar>`
})
export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform android
 */
@Component({
  selector: 'ProgressBar',
  inputs: [
    'color', 'indeterminate', 'progress', 'styleAttr',
  ].concat(GENERIC_INPUTS),
  template: `<native-progressbar [color]="_color" [indeterminate]="_indeterminate" [progress]="_progress" [styleAttr]="_styleAttr"
  ${GENERIC_BINDINGS}></native-progressbar>`
})
export class ProgressBar extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
  }

  //Properties
  private _color: number;
  private _indeterminate: boolean;
  private _progress: number;
  private _styleAttr: string;
  /**
   * To be documented
   */
  set color(value: string) {this._color = this.processColor(value);}
  /**
   * To be documented
   */
  set indeterminate(value: any) {this._indeterminate = this.processBoolean(value);}
  /**
   * To be documented
   */
  set progress(value: any) {this._progress = this.processNumber(value);}
  /**
   * To be documented
   */
  set styleAttr(value: string) {this._styleAttr = this.processEnum(value, ['Normal', 'Horizontal', 'Small', 'Large', 'Inverse', 'SmallInverse', 'LargeInverse']);}
}
