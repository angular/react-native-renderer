import {Component, Inject} from "@angular/core";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";
import {REACT_NATIVE_WRAPPER} from "../renderer/renderer";
import {ReactNativeWrapper, isAndroid} from "../wrapper/wrapper";

/**
 * A component for displaying an activity indicator.
 *
 * ```
 @Component({
  selector: 'sample',
  template: `<ActivityIndicator color="#ce0058" size="large"></ActivityIndicator>`
})
 export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 */
@Component({
  selector: 'ActivityIndicator',
  inputs: [
    'animating', 'color', 'hidesWhenStopped', 'size',
  ].concat(GENERIC_INPUTS),
  template: `<native-activityindicator [animating]="_animating" [color]="_color" [hidesWhenStopped]="_hidesWhenStopped"
  [size]="_size" ${isAndroid() ? 'styleAttr="Normal" indeterminate="true"' : ''} 
  ${GENERIC_BINDINGS}></native-activityindicator>`
})
export class ActivityIndicator extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({height: 20, width: 20});
  }

  //Properties
  private _animating: boolean = true;
  private _color: number;
  private _hidesWhenStopped: boolean = true;
  private _size: string;
  /**
   * To be documented
   */
  set animating(value: string) {this._animating = this.processBoolean(value);}
  /**
   * To be documented
   */
  set color(value: string) {this._color = this.processColor(value);}
  /**
   * To be documented
   */
  set hidesWhenStopped(value: any) {this._hidesWhenStopped = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set size(value: string) {
    this._size = this.processEnum(value, ['small', 'large']);
    if (this._size == 'small') {
      this.setDefaultStyle({height: 20, width: 20});
    } else {
      this.setDefaultStyle({height: 36, width: 36});
    }
  }
}
