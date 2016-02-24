import {Component, Inject} from 'angular2/core';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./../component";
import {REACT_NATIVE_WRAPPER} from './../../renderer/renderer';
import {ReactNativeWrapper} from "../../wrapper/wrapper";

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
  set color(value: string) {this._color = this.processColor(value);}
  set indeterminate(value: any) {this._indeterminate = this.processBoolean(value);}
  set progress(value: any) {this._progress = this.processNumber(value);}
  set styleAttr(value: string) {this._styleAttr = this.processEnum(value, ['Normal', 'Horizontal', 'Small', 'Large', 'Inverse', 'SmallInverse', 'LargeInverse']);}
}
