import {Component} from 'angular2/core';
import {isAndroid} from './../wrapper/wrapper';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = [];
var IOS_INPUTS: Array<string> = ['allowFontScaling', 'suppressHighlighting'];

var ANDROID_BINDINGS: string = ``;
var IOS_BINDINGS: string = `[allowFontScaling]="_allowFontScaling" [suppressHighlighting]="_suppressHighlighting"`;

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
  private _numberOfLines: string;
  set numberOfLines(value: string) {this._numberOfLines = value;}

  private _allowFontScaling: boolean;
  private _suppressHighlighting: boolean;
  set allowFontScaling(value: any) {this._allowFontScaling = this.processBoolean(value);}
  set suppressHighlighting(value: any) { this._suppressHighlighting = this.processBoolean(value); }
}
