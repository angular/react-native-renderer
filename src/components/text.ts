import {Component} from 'angular2/core';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

@Component({
  selector: 'Text',
  inputs: [
    //Both
    'numberOfLines',
    //iOS
    'allowFontScaling', 'suppressHighlighting'
  ].concat(GENERIC_INPUTS),
  template: `<native-text [numberOfLines]="_numberOfLines"[allowFontScaling]="_allowFontScaling" [suppressHighlighting]="_suppressHighlighting"
  ${GENERIC_BINDINGS}><ng-content></ng-content></native-text>`
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
