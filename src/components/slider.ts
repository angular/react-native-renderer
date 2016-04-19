import {Component, Inject, Output, EventEmitter} from 'angular2/core';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";
import {REACT_NATIVE_WRAPPER} from './../renderer/renderer';
import {ReactNativeWrapper, isAndroid} from "../wrapper/wrapper";

var ANDROID_INPUTS: Array<string> = [];
var IOS_INPUTS: Array<string> = ['maximumTrackImage', 'maximumTrackTintColor', 'minimumTrackImage', 'minimumTrackTintColor', 'thumbImage', 'trackImage'];

var ANDROID_BINDINGS: string = `(topChange)="_handleValueChange($event)"`;
var IOS_BINDINGS: string = `[maximumTrackImage]="_maximumTrackImage" [maximumTrackTintColor]="_maximumTrackTintColor"
  [minimumTrackImage]="_minimumTrackImage" [minimumTrackTintColor]="_minimumTrackTintColor" [thumbImage]="_thumbImage" [trackImage]="_trackImage"
  (topValueChange)="_handleValueChange($event)"`;

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
 */
@Component({
  selector: 'Slider',
  inputs: ['disabled', 'maximumValue', 'minimumValue', 'step', 'value'].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-slider [disabled]="_disabled"  [maximumValue]="_maximumValue" [minimumValue]="_minimumValue" [step]="_step"  [value]="_value"
  onValueChange="true" onSlidingComplete="true" (topSlidingComplete)="_handleSlidingComplete($event)"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-slider>`
})
export class Slider extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    if (!wrapper.isAndroid()) {
      this.setDefaultStyle({height: 40});
    }
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
  private _disabled: boolean = false;
  private _maximumValue: number = 1;
  private _minimumValue: number = 0;
  private _step: number = 0;
  private _value: number;
  /**
   * To be documented
   */
  set disabled(value: any) {this._disabled = this.processBoolean(value);}
  /**
   * To be documented
   */
  set maximumValue(value: string) {this._maximumValue = this.processNumber(value);}
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
  set value(value: any) {this._value = this.processNumber(value);}

  private _maximumTrackImage: any;
  private _maximumTrackTintColor: number;
  private _minimumTrackImage: any;
  private _minimumTrackTintColor: number;
  private _thumbImage: any;
  private _trackImage: any;
  /**
   * To be documented
   * @platform ios
   */
  set maximumTrackImage(value: any) {this._maximumTrackImage = this.resolveAssetSource(value);}
  /**
   * To be documented
   * @platform ios
   */
  set maximumTrackTintColor(value: string) {this._maximumTrackTintColor = this.processColor(value);}
  /**
   * To be documented
   * @platform ios
   */
  set minimumTrackImage(value: any) {this._minimumTrackImage = this.resolveAssetSource(value);}
  /**
   * To be documented
   * @platform ios
   */
  set minimumTrackTintColor(value: string) {this._minimumTrackTintColor = this.processColor(value);}
  /**
   * To be documented
   * @platform ios
   */
  set thumbImage(value: any) {this._thumbImage = this.resolveAssetSource(value);}
  /**
   * To be documented
   * @platform ios
   */
  set trackImage(value: any) {this._trackImage = this.resolveAssetSource(value);}

  _handleValueChange(event: any) {
    //Event example: {value: 0.4325, target: 18}
    if (!isAndroid() || event.fromUser) {
      this.valueChange.emit(event.value);
    }
  }

  _handleSlidingComplete(event:any) {
    //Event example: {value: 0.4325, target: 18}
    this.slidingComplete.emit(event.value);
  }
}
