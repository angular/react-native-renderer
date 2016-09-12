import {Component} from "@angular/core";
import {isAndroid} from "../../wrapper/wrapper";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = ['selectable'];
var IOS_INPUTS: Array<string> = ['allowFontScaling', 'suppressHighlighting'];

var ANDROID_BINDINGS: string = `[selectable]="_selectable"`;
var IOS_BINDINGS: string = `[allowFontScaling]="_allowFontScaling" [suppressHighlighting]="_suppressHighlighting"`;

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
    'lineBreakMode', 'numberOfLines'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-text [lineBreakMode]="_lineBreakMode" [numberOfLines]="_numberOfLines"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}><ng-content></ng-content></native-text>`
})
export class Text extends HighLevelComponent{
  //Properties
  public _lineBreakMode: string;
  public _numberOfLines: number;
  /**
   * To be documented
   */
  set lineBreakMode(value: any) { this._lineBreakMode = this.processEnum(value, ['tail', 'head', 'middle', 'clip']); }
  /**
   * To be documented
   */
  set numberOfLines(value: any) {this._numberOfLines = this.processNumber(value);}

  public _selectable: boolean;
  /**
   * To be documented
   * @platform android
   */
  set selectable(value: any) {this._selectable = this.processBoolean(value);}

  public _allowFontScaling: boolean;
  public _suppressHighlighting: boolean;
  /**
   * To be documented
   * @platform ios
   */
  set allowFontScaling(value: any) {this._allowFontScaling = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set suppressHighlighting(value: any) { this._suppressHighlighting = this.processBoolean(value); }

}
