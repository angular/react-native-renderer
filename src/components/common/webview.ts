import {Component, Output, EventEmitter, Inject, ElementRef} from "@angular/core";
import {REACT_NATIVE_WRAPPER} from "../../renderer/renderer";
import {Node} from "../../renderer/node";
import {ReactNativeWrapper, isAndroid} from "../../wrapper/wrapper";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = ['domStorageEnabled', 'javaScriptEnabled'];
var IOS_INPUTS: Array<string> = ['allowsInlineMediaPlayback', 'bounces', 'decelerationRate', 'scrollEnabled'];

var ANDROID_BINDINGS: string = `[domStorageEnabled]="_domStorageEnabled" [javaScriptEnabled]="_javaScriptEnabled"`;
var IOS_BINDINGS: string = `[allowsInlineMediaPlayback]="_allowsInlineMediaPlayback" [bounces]="_bounces" [decelerationRate]="_decelerationRate"
  [scrollEnabled]="_scrollEnabled"`;

//TODO: onNavigationStateChange, renderError, renderLoading, startInLoadingState, processDecelerationRate(iOS)

/**
 * A component for displaying a webview
 *
 * ```
@Component({
  selector: 'sample',
  template: `<WebView [source]="{uri: 'https://www.angular.io'}" javaScriptEnabled="true" domStorageEnabled="true">
    </WebView>`
})
export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 */
@Component({
  selector: 'WebView',
  inputs: [
    'automaticallyAdjustContentInsets', 'contentInset', 'injectedJavaScript', 'scalesPageToFit', 'source'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-webview [automaticallyAdjustContentInsets]="_automaticallyAdjustContentInsets" [contentInset]="_contentInset"
  [injectedJavaScript]="_injectedJavaScript" [scalesPageToFit]="_scalesPageToFit" [source]="_source"
  (topLoadingStart)="_handleLoadingStart($event)" (topLoadingFinish)="_handleLoadingFinish($event)" (topLoadingError)="_handleLoadingError($event)"
  (topContentSizeChange)="_handleContentSizeChange($event)"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-webview>`
})
export class WebView extends HighLevelComponent{
  private _nativeElement: Node;
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper, el: ElementRef) {
    super(wrapper);
    this._nativeElement = el.nativeElement;
  }

  //Events
  /**
   * To be documented
   */
  @Output() loadingStart: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() loadingFinish: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() loadingError: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() contentSizeChange: EventEmitter<any> = new EventEmitter();

  //Properties
  public _automaticallyAdjustContentInsets: boolean;
  public _contentInset: any;
  public _injectedJavaScript: string;
  public _scalesPageToFit: boolean;
  public _source: any;
  /**
   * To be documented
   */
  set automaticallyAdjustContentInsets(value: any) {this._automaticallyAdjustContentInsets = this.processBoolean(value);}
  /**
   * To be documented
   */
  set contentInset(value: any) {this._contentInset = value;}
  /**
   * To be documented
   */
  set injectedJavaScript(value: any) {this._injectedJavaScript = value;}
  /**
   * To be documented
   */
  set scalesPageToFit(value: any) {this._scalesPageToFit = this.processBoolean(value);}
  /**
   * To be documented
   */
  set source(value: any) {this._source = this.resolveAssetSource(value);}

  public _domStorageEnabled: boolean;
  public _javaScriptEnabled: boolean;
  /**
   * To be documented
   * @platform android
   */
  set domStorageEnabled(value: any) {this._domStorageEnabled = this.processBoolean(value);}
  /**
   * To be documented
   * @platform android
   */
  set javaScriptEnabled(value: any) { this._javaScriptEnabled = this.processBoolean(value); }

  public _allowsInlineMediaPlayback: boolean;
  public _scrollEnabled: boolean;
  public _decelerationRate: number;
  public _bounces: boolean;
  /**
   * To be documented
   * @platform ios
   */
  set allowsInlineMediaPlayback(value: any) {this._allowsInlineMediaPlayback = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set bounces(value: any) {this._bounces = this.processBoolean(value); }
  /**
   * To be documented
   * @platform ios
   */
  set decelerationRate(value: any) {this._decelerationRate = this.processNumber(value);}
  /**
   * To be documented
   * @platform ios
   */
  set scrollEnabled(value: any) {this._scrollEnabled = this.processBoolean(value); }

  //Event handlers
  _handleLoadingStart(event: any) {
    this.loadingStart.emit({canGoBack: event.canGoBack, canGoForward: event.canGoForward, loading: event.loading, title: event.title, url: event.url});
  }

  _handleLoadingFinish(event: any) {
    this.loadingFinish.emit({canGoBack: event.canGoBack, canGoForward: event.canGoForward, loading: event.loading, title: event.title, url: event.url});
  }

  _handleLoadingError(event: any) {
    this.loadingError.emit({canGoBack: event.canGoBack, canGoForward: event.canGoForward, loading: event.loading, title: event.title, url: event.url, code: event.code, description: event.description});
  }

  _handleContentSizeChange(event: any) {
    this.contentSizeChange.emit(event);
  }

  //Commands
  /**
   * To be documented
   */
  goForward() {
    this._nativeElement.children[0].dispatchCommand('goForward');
  }

  /**
   * To be documented
   */
  reload() {
    this._nativeElement.children[0].dispatchCommand('reload');
  }

  /**
   * To be documented
   */
  goBack() {
    this._nativeElement.children[0].dispatchCommand('goBack');
  }
}
