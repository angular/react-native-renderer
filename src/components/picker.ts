import {Component, Inject, Output, EventEmitter} from 'angular2/core';
import {REACT_NATIVE_WRAPPER} from './../renderer/renderer';
import {ReactNativeWrapper, isAndroid} from './../wrapper/wrapper';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = ['enabled', 'mode', 'prompt'];
var IOS_INPUTS: Array<string> = ['itemStyle'];

var ANDROID_BINDINGS: string = `[enabled]="_enabled" [mode]="_mode" [prompt]="_prompt"`;
var IOS_BINDINGS: string = `[itemStyle]="_itemStyle"`;

@Component({
  selector: 'Picker',
  inputs: [
    'items', 'selectedValue',
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `
  <native-dialogpicker *ngIf="_mode == 'dialog'" [items]="_items" [selected]="_selectedValue"
  (topSelect)="_handleSelect($event)" ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-dialogpicker>
  <native-dropdownpicker *ngIf="_mode == 'dropdown'" [items]="_items" [selected]="_selectedValue"
  (topSelect)="_handleSelect($event)" ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-dropdownpicker>`
})
export class Picker extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({height: 50});
  }

  //Events
  @Output() select: EventEmitter<any> = new EventEmitter();

  //Properties
  private _items: Array<any> = [];
  private _selectedValue: any;
  set selectedValue(value: string) {this._selectedValue = value;}
  set items(value: Array<any>) {
    this._items = value.map((item) => {
      var res = {label: item.label, value: item.value};
      if (item.color) {
        res['color'] = this.processColor(item.color);
      }
      return res;
    })
  }

  private _enabled: boolean;
  private _mode: string = 'dialog';
  private _prompt: string;
  set enabled(value: any) { this._enabled = this.processBoolean(value);}
  set mode(value: string) {this._mode = this.processEnum(value, ['dialog', 'dropdown'])}
  set prompt(value: string) {this._prompt = value;}

  private _itemStyle: any = false;
  set itemStyle(value: string) {this._itemStyle = value;}

  _handleSelect(event: any) {
    //Event example: {position: 3}
    this._selectedValue = event.position;
    this.select.emit(this._selectedValue);
  }
}
