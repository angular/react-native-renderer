import {Component, Inject, Output, EventEmitter} from "@angular/core";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";
import {REACT_NATIVE_WRAPPER} from "../../renderer/renderer";
import {ReactNativeWrapper, isAndroid} from "../../wrapper/wrapper";

var ANDROID_INPUTS: Array<string> = ['fadeDuration', 'loadingIndicatorSrc', 'progressiveRenderingEnabled', 'shouldNotifyLoadEvents'];
var IOS_INPUTS: Array<string> = ['blurRadius', 'capInsets', 'defaultSource'];

var ANDROID_BINDINGS: string = `[fadeDuration]="_fadeDuration" [loadingIndicatorSrc]="_loadingIndicatorSrc ? _loadingIndicatorSrc.uri : null"
  [progressiveRenderingEnabled]="_progressiveRenderingEnabled" [shouldNotifyLoadEvents]="_shouldNotifyLoadEvents" [src]="_source ? [{uri: _source.uri}] : null"`;
var IOS_BINDINGS: string = `[blurRadius]="_blurRadius" [capInsets]="_capInsets" [defaultSource]="_defaultSource" [source]="[_source]"`;

//TODO: add iOS specific events (onError, on Progress) and specific cases (tintColor, resizeMode)
/**
 * A component for displaying local or remote images.
 *
 * ```
@Component({
  selector: 'sample',
  template: `<Image [source]="angularLogo"></Image>`
})
export class Sample {
  angularLogo: any = require('./assets/angular.png');
}
 * ```
 * @style https://facebook.github.io/react-native/docs/image.html#style
 */
@Component({
  selector: 'Image',
  inputs: [
    'resizeMode', 'source'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-image  [resizeMode]="_resizeMode"
  (topLoad)="_handleLoad()" (topLoadStart)="_handleLoadStart()" (topLoadEnd)="_handleLoadEnd()"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}><ng-content></ng-content></native-image>`
})
export class Image extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
  }

  //Events
  /**
   * To be documented
   */
  @Output() load: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() loadStart: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() loadEnd: EventEmitter<any> = new EventEmitter();

  //Properties
  private _resizeMode: string;
  private _source: any;
  /**
   * To be documented
   */
  set resizeMode(value: string) {this._resizeMode = this.processEnum(value, ['cover', 'contain', 'stretch', 'repeat', 'center']);}

  /**
   * To be documented
   */
  set source(value: string) {this._source = this.resolveAssetSource(value);}

  private _fadeDuration: number;
  private _loadingIndicatorSrc: any;
  private _progressiveRenderingEnabled: boolean;
  private _shouldNotifyLoadEvents: boolean;
  /**
   * To be documented
   * @platform android
   */
  set fadeDuration(value: any) {this._fadeDuration = this.processNumber(value);}
  /**
   * To be documented
   * @platform android
   */
  set loadingIndicatorSrc(value: any) {this._loadingIndicatorSrc = this.resolveAssetSource(value);}
  /**
   * To be documented
   * @platform android
   */
  set progressiveRenderingEnabled(value: any) {this._progressiveRenderingEnabled = this.processBoolean(value);}
  /**
   * To be documented
   * @platform android
   */
  set shouldNotifyLoadEvents(value: any) {this._shouldNotifyLoadEvents = this.processBoolean(value);}

  private _blurRadius: number;
  private _capInsets: any;
  private _defaultSource: string;
  /**
   * To be documented
   * @platform ios
   */
  set blurRadius(value: string) {this._blurRadius = this.processNumber(value);}
  /**
   * To be documented
   * @platform ios
   */
  set capInsets(value: string) {this._capInsets = value;}
  /**
   * To be documented
   * @platform ios
   */
  set defaultSource(value: string) {this._defaultSource = this.resolveAssetSource(value);}

  //Event handlers
  _handleLoad() {
    this.load.emit(null);
  }

  _handleLoadStart() {
    this.loadStart.emit(null);
  }

  _handleLoadEnd(x: number, y: boolean) {
    this.loadEnd.emit(null);
  }
}
