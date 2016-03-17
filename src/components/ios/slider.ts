import {Component, Inject, Output, EventEmitter} from 'angular2/core';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./../component";
import {REACT_NATIVE_WRAPPER} from './../../renderer/renderer';
import {ReactNativeWrapper} from "../../wrapper/wrapper";

/**
 * A component for displaying a slider.
 *
 * ```
 @Component({
  selector: 'sample',
  template: `<Slider value="0.6"></Slider>`
})
 export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform ios
 */
@Component({
  selector: 'Slider',
  inputs: [
    'disabled', 'maximumTrackImage', 'maximumTrackTintColor', 'maximumValue', 'minimumTrackImage', 'minimumTrackTintColor',
    'minimumValue', 'step', 'thumbImage', 'trackImage', 'value'
  ].concat(GENERIC_INPUTS),
  template: `<native-slider [disabled]="_disabled" [maximumTrackImage]="_maximumTrackImage" [maximumTrackTintColor]="_maximumTrackTintColor" [maximumValue]="_maximumValue"
  [minimumTrackImage]="_minimumTrackImage" [minimumTrackTintColor]="_minimumTrackTintColor" [minimumValue]="_minimumValue"
  [step]="_step" [thumbImage]="_thumbImage" [trackImage]="_trackImage" [value]="_value" onValueChange="true" onSlidingComplete="true"
  (topValueChange)="_handleValueChange($event)" (topSlidingComplete)="_handleSlidingComplete($event)" ${GENERIC_BINDINGS}></native-slider>`
})
export class Slider extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({height: 40});
  }

  //Events
  /**
   * To be documented
   */
  @Output() valueChange: EventEmitter<number> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() slidingComplete: EventEmitter<number> = new EventEmitter();

  //Properties
  private _disabled: boolean;
  private _maximumTrackImage: any;
  private _maximumTrackTintColor: number;
  private _maximumValue: number;
  private _minimumTrackImage: any;
  private _minimumTrackTintColor: number;
  private _minimumValue: number;
  private _step: number;
  private _thumbImage: any;
  private _trackImage: any;
  private _value: number;
  /**
   * To be documented
   */
  set disabled(value: any) {this._disabled = this.processBoolean(value);}
  /**
   * To be documented
   */
  set maximumTrackImage(value: any) {this._maximumTrackImage = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set maximumTrackTintColor(value: string) {this._maximumTrackTintColor = this.processColor(value);}
  /**
   * To be documented
   */
  set maximumValue(value: string) {this._maximumValue = this.processNumber(value);}
  /**
   * To be documented
   */
  set minimumTrackImage(value: any) {this._minimumTrackImage = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set minimumTrackTintColor(value: string) {this._minimumTrackTintColor = this.processColor(value);}
  /**
   * To be documented
   */
  set minimumValue(value: string) {this._minimumValue = this.processNumber(value);}
  /**
   * To be documented
   */
  set step(value: any) {this._step = this.processNumber(value);}
  /**
   * To be documented
   */
  set thumbImage(value: any) {this._thumbImage = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set trackImage(value: any) {this._trackImage = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set value(value: any) {this._value = this.processNumber(value);}

  _handleValueChange(event: any) {
    //Event example: {value: 0.4325, target: 18}
    this.valueChange.emit(event.value);
  }

  _handleSlidingComplete(event:any) {
    //Event example: {value: 0.4325, target: 18}
    this.slidingComplete.emit(event.value);
  }
}
