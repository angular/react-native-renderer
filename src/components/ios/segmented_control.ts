import {Component, Inject, Output, EventEmitter} from "@angular/core";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./../component";
import {REACT_NATIVE_WRAPPER} from "./../../renderer/renderer";
import {ReactNativeWrapper} from "../../wrapper/wrapper";

/**
 * A component for displaying a segmented control.
 *
 * ```
 @Component({
  selector: 'sample',
  template: `<SegmentedControl [values]="['One', 'Two','Three']" tintColor="#ce0058"></SegmentedControl>`
})
 export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform ios
 */
@Component({
  selector: 'SegmentedControl',
  inputs: [
    'enabled', 'momentary', 'selectedIndex', 'tintColor', 'values'
  ].concat(GENERIC_INPUTS),
  template: `<native-segmentedcontrol [enabled]="_enabled" [momentary]="_momentary" [selectedIndex]="_selectedIndex" [tintColor]="_tintColor"
  [values]="_values" onChange="true" (topChange)="_handleChange($event)" ${GENERIC_BINDINGS}></native-segmentedcontrol>`
})
export class SegmentedControl extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({height: 28});
  }

  //Events
  /**
   * To be documented
   * Emitted value example: {value: "One", selectedIndex: 0}
   */
  @Output() change: EventEmitter<any> = new EventEmitter();

  //Properties
  private _enabled: boolean;
  private _momentary: any;
  private _selectedIndex: number;
  private _tintColor: number;
  private _values: Array<string>;
  /**
   * To be documented
   */
  set enabled(value: string) {this._enabled = this.processBoolean(value);}
  /**
   * To be documented
   */
  set momentary(value: any) {this._momentary = this.processBoolean(value);}
  /**
   * To be documented
   */
  set selectedIndex(value: string) {this._selectedIndex = this.processNumber(value);}
  /**
   * To be documented
   */
  set tintColor(value: string) {this._tintColor = this.processColor(value);}
  /**
   * To be documented
   */
  set values(value: Array<string>) {this._values = value;}

  _handleChange(event: any) {
    //Event example: {value: "One", selectedSegmentIndex: 0, target: 15}
    this.change.emit({value: event.value, selectedIndex: event.selectedSegmentIndex});
  }
}
