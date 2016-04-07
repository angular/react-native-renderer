import {Component} from 'angular2/core';
import {isAndroid} from './../wrapper/wrapper';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = [];
var IOS_INPUTS: Array<string> = ['allowFontScaling', 'lineBreakMode', 'suppressHighlighting'];

var ANDROID_BINDINGS: string = ``;
var IOS_BINDINGS: string = `[allowFontScaling]="_allowFontScaling" [lineBreakMode]="_lineBreakMode" [suppressHighlighting]="_suppressHighlighting"`;

/**
 * A component for displaying a text.
 *
 * ```
@Component({
  selector: 'sample',
  template: `<Text [style]="{margin: 10}">Horizontal</Text>`
})
export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/text.html#style
 */
@Component({
  selector: 'Text',
  inputs: [
    'numberOfLines'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-text [numberOfLines]="_numberOfLines"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}><ng-content></ng-content></native-text>`
})
export class Text extends HighLevelComponent{
  //Properties
  private _numberOfLines: number;
  /**
   * To be documented
   */
  set numberOfLines(value: any) {this._numberOfLines = this.processNumber(value);}

  private _allowFontScaling: boolean;
  private _lineBreakMode: string;
  private _suppressHighlighting: boolean;
  /**
   * To be documented
   * @platform ios
   */
  set allowFontScaling(value: any) {this._allowFontScaling = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set lineBreakMode(value: any) { this._lineBreakMode = this.processEnum(value, ['clipping', 'word-wrapping', 'char-wrapping', 'truncating-head', 'truncating-middle', 'truncating-tail']); }
  /**
   * To be documented
   * @platform ios
   */
  set suppressHighlighting(value: any) { this._suppressHighlighting = this.processBoolean(value); }

}
