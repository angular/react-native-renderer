import {Component, Inject, Output, EventEmitter} from "@angular/core";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "../common/component";
import {REACT_NATIVE_WRAPPER} from "./../../renderer/renderer";
import {ReactNativeWrapper} from "../../wrapper/wrapper";

/**
 * A component for displaying a date picker.
 *
 * ```
 @Component({
  selector: 'sample',
  template: `<DatePicker date="2016-03-18" (change)="selectedDate=$event"></DatePicker>`
})
 export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform ios
 */
@Component({
  selector: 'DatePicker',
  inputs: [
    'date', 'maximumDate', 'minimumDate', 'minuteInterval', 'mode', 'timeZoneOffsetInMinutes'
  ].concat(GENERIC_INPUTS),
  template: `<native-datepicker [date]="_date" [maximumDate]="_maximumDate"
  [minimumDate]="_minimumDate" [minuteInterval]="_minuteInterval" [mode]="_mode"
  [timeZoneOffsetInMinutes]="_timeZoneOffsetInMinutes" onChange="true" (topChange)="_handleChange($event)" ${GENERIC_BINDINGS}></native-datepicker>`
})
export class DatePicker extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({height: 216, width: 320});
  }

  //Events
  /**
   * To be documented
   */
  @Output() change: EventEmitter<Date> = new EventEmitter();

  //Properties
  private _date: number;
  private _maximumDate: number;
  private _minimumDate: number;
  private _minuteInterval: number;
  private _mode: string;
  private _timeZoneOffsetInMinutes: number;
  /**
   * To be documented
   */
  set date(value: any) {this._date = this.processDate(value);}
  /**
   * To be documented
   */
  set maximumDate(value: any) {this._maximumDate = this.processDate(value);}
  /**
   * To be documented
   */
  set minimumDate(value: string) {this._minimumDate = this.processDate(value);}
  /**
   * To be documented
   */
  set minuteInterval(value: any) {this._minuteInterval = this.processEnum(this.processNumber(value), [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]);}
  /**
   * To be documented
   */
  set mode(value: string) {this._mode = this.processEnum(value, ['date', 'time', 'datetime']);}
  /**
   * To be documented
   */
  set timeZoneOffsetInMinutes(value: any) {this._timeZoneOffsetInMinutes = this.processNumber(value);}

  _handleChange(event: any) {
    //Event example: {target: 22, timestamp: 1458432000000}
    this.change.emit(new Date(event.timestamp));
  }
}
