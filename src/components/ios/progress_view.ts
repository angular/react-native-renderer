import {Component, Inject} from "@angular/core";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "../common/component";
import {REACT_NATIVE_WRAPPER} from "./../../renderer/renderer";
import {ReactNativeWrapper} from "../../wrapper/wrapper";

/**
 * A component for displaying an progress view.
 *
 * ```
 @Component({
  selector: 'sample',
  template: `<ProgressView progress="0.6" progressTintColor="#ce0058"></ProgressView>`
})
 export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform ios
 */
@Component({
  selector: 'ProgressView',
  inputs: [
    'progress', 'progressImage', 'progressTintColor', 'progressViewStyle', 'trackImage', 'trackTintColor'
  ].concat(GENERIC_INPUTS),
  template: `<native-progressview [progress]="_progress" [progressImage]="_progressImage" [progressTintColor]="_progressTintColor" [progressViewStyle]="_progressViewStyle"
  [trackImage]="_trackImage" [trackTintColor]="_trackTintColor"
  ${GENERIC_BINDINGS}></native-progressview>`
})
export class ProgressView extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({height: 2});
  }

  //Properties
  private _progress: number;
  private _progressImage: any;
  private _progressTintColor: number;
  private _progressViewStyle: string;
  private _trackImage: any;
  private _trackTintColor: number;
  /**
   * To be documented
   */
  set progress(value: string) {this._progress = this.processNumber(value);}
  /**
   * To be documented
   */
  set progressImage(value: any) {this._progressImage = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set progressTintColor(value: string) {this._progressTintColor = this.processColor(value);}
  /**
   * To be documented
   */
  set progressViewStyle(value: string) {
    this._progressViewStyle = this.processEnum(value, ['default', 'bar']);
  }
  /**
   * To be documented
   */
  set trackImage(value: any) {this._trackImage = this.resolveAssetSource(value);}
  /**
   * To be documented
   */
  set trackTintColor(value: string) {this._trackTintColor = this.processColor(value);}
}
