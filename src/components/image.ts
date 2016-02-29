import {Component, Inject, Output, EventEmitter} from 'angular2/core';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";
import {REACT_NATIVE_WRAPPER} from './../renderer/renderer';
import {ReactNativeWrapper, isAndroid} from "../wrapper/wrapper";

var ANDROID_INPUTS: Array<string> = ['fadeDuration', 'loadingIndicatorSrc', 'overlayColor', 'progressiveRenderingEnabled', 'shouldNotifyLoadEvents'];
var IOS_INPUTS: Array<string> = ['capInsets', 'defaultSource'];

var ANDROID_BINDINGS: string = `[fadeDuration]="_fadeDuration" [loadingIndicatorSrc]="_loadingIndicatorSrc ? _loadingIndicatorSrc.uri : null"
  [overlayColor]="_overlayColor" [progressiveRenderingEnabled]="_progressiveRenderingEnabled" [shouldNotifyLoadEvents]="_shouldNotifyLoadEvents" [src]="_source ? _source.uri: null"`;
var IOS_BINDINGS: string = `[capInsets]="_capInsets" [defaultSource]="_defaultSource" [source]="_source"`;

//TODO: add iOS specific events (onError, on Progress) and specific cases (tintColor, resizeMode)

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
  @Output() load: EventEmitter<any> = new EventEmitter();
  @Output() loadStart: EventEmitter<any> = new EventEmitter();
  @Output() loadEnd: EventEmitter<any> = new EventEmitter();

  //Properties
  private _resizeMode: string;
  private _source: any;
  set resizeMode(value: string) {this._resizeMode = this.processEnum(value, ['cover', 'contain', 'stretch']);}
  set source(value: string) {this._source = this.resolveAssetSource(value);}

  private _fadeDuration: number;
  private _loadingIndicatorSrc: any;
  private _overlayColor: number;
  private _progressiveRenderingEnabled: boolean;
  private _shouldNotifyLoadEvents: boolean;
  set fadeDuration(value: any) {this._fadeDuration = this.processNumber(value);}
  set loadingIndicatorSrc(value: any) {this._loadingIndicatorSrc = this.resolveAssetSource(value);}
  set overlayColor(value: string) {this._overlayColor = this.processColor(value);}
  set progressiveRenderingEnabled(value: any) {this._progressiveRenderingEnabled = this.processBoolean(value);}
  set shouldNotifyLoadEvents(value: any) {this._shouldNotifyLoadEvents = this.processBoolean(value);}

  private _capInsets: any;
  private _defaultSource: string;
  set capInsets(value: string) {this._capInsets = value;}
  set defaultSource(value: string) {this._source = this.resolveAssetSource(value);}

  //Event handlers
  _handleLoad() {
    this.load.emit(null);
  }

  _handleLoadStart() {
    this.loadStart.emit(null);
  }

  _handleLoadEnd() {
    this.loadEnd.emit(null);
  }
}
