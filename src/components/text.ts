import {Component} from 'angular2/core';

@Component({
  selector: 'Text',
  inputs: [
    //all
    'accessible', 'numberOfLines', 'testID', 'onLayout',
    //iOS
    'allowFontScaling', 'suppressHighlighting',
    //style
    'styleSheet', 'style'
  ],
  template: `<native-text [accessible]="_accessible" [numberOfLines]="_numberOfLines" [testID]="_testID" [onLayout]="_onLayout"
  [allowFontScaling]="_allowFontScaling" [suppressHighlighting]="_suppressHighlighting"
  [styleSheet]="_styleSheet" [style]="_style"><ng-content></ng-content></native-text>`
})
export class Text {
  //Properties
  private _accessible: boolean;
  private _numberOfLines: string;
  private _testID: string;
  private _onLayout: boolean;
  set accessible(value: any) { this._accessible = value == true || value == 'true';}
  set numberOfLines(value: string) {this._numberOfLines = value;}
  set testID(value: string) {this._testID = value;}
  set onLayout(value: any) { this._onLayout = value == true || value == 'true';}

  private _allowFontScaling: any;
  private _suppressHighlighting: boolean;
  set allowFontScaling(value: any) {this._allowFontScaling = value == true || value == 'true';}
  set suppressHighlighting(value: any) { this._suppressHighlighting = value == true || value == 'true';}

  //Style
  private _styleSheet: Array<number>;
  private _style: {[s: string]: any };
  set styleSheet(value: Array<number>) {this._styleSheet = value;}
  set style(value: {[s: string]: any }) {this._style = value;}
}
