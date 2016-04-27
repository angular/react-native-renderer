import {Component, Inject, Output, EventEmitter} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {REACT_NATIVE_WRAPPER} from './../renderer/renderer';
import {ReactNativeWrapper, isAndroid} from './../wrapper/wrapper';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = ['enabled', 'mode', 'prompt'];
var IOS_INPUTS: Array<string> = ['itemStyle'];

var ANDROID_BINDINGS: string = `[enabled]="_enabled" [mode]="_mode" [prompt]="_prompt" (topSelect)="_handleSelect($event)" [selected]="_selectedValue"`;
var IOS_BINDINGS: string = `[itemStyle]="_itemStyle" onChange="true" (topChange)="_handleSelect($event)" [selectedIndex]="_selectedValue"`;

/**
 * A component for displaying a picker.
 *
 * ```
@Component({
  selector: 'sample',
  template: `<Picker [selectedValue]="selected" prompt="Please select an item" [items]="items"
    [style]="{width: 80}" (select)="selected=$event"></Picker>`
})
export class Sample {
  selected: number = 0;
  items: Array<any> = [{label: 'aaa', value: 'a'}, {label: 'bbb', value: 'b'}, {label: 'ccc', value: 'c'},
    {label: 'ddd', value: 'd'}, {label: 'eee', value: 'e'}];
}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 */
@Component({
  selector: 'Picker',
  directives: [NgIf],
  inputs: [
    'items', 'selectedValue',
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `
  <native-dialogpicker *ngIf="_mode == 'dialog'" [items]="_items"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-dialogpicker>
  <native-dropdownpicker *ngIf="_mode == 'dropdown'" [items]="_items"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-dropdownpicker>`
})
export class Picker extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({height: wrapper.isAndroid() ? 50 : 216});
  }

  //Events
  /**
   * To be documented
   */
  @Output() select: EventEmitter<number> = new EventEmitter();

  //Properties
  private _items: Array<any> = [];
  private _selectedValue: any;
  /**
   * To be documented
   */
  set selectedValue(value: string) {this._selectedValue = value;}
  /**
   * To be documented
   */
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
  /**
   * To be documented
   * @platform android
   */
  set enabled(value: any) { this._enabled = this.processBoolean(value);}
  /**
   * To be documented
   * @platform android
   */
  set mode(value: string) {this._mode = this.processEnum(value, ['dialog', 'dropdown'])}
  /**
   * To be documented
   * @platform android
   */
  set prompt(value: string) {this._prompt = value;}

  private _itemStyle: any = false;
  /**
   * To be documented
   * @platform ios
   */
  set itemStyle(value: string) {this._itemStyle = value;}

  _handleSelect(event: any) {
    //Event example: {position: 3}
    this._selectedValue = this._wrapper.isAndroid() ? event.position : event.newIndex;
    this.select.emit(this._selectedValue);
  }
}
