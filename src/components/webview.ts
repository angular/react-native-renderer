import {Component, Output, EventEmitter, Inject, ElementRef} from 'angular2/core';
import {REACT_NATIVE_WRAPPER} from './../renderer/renderer';
import {Node} from '../renderer/node';
import {ReactNativeWrapper, isAndroid} from './../wrapper/wrapper';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = ['domStorageEnabled', 'javaScriptEnabled'];
var IOS_INPUTS: Array<string> = ['allowsInlineMediaPlayback', 'bounces', 'decelerationRate', 'scalesPageToFit', 'scrollEnabled'];

var ANDROID_BINDINGS: string = `[domStorageEnabled]="_domStorageEnabled" [javaScriptEnabled]="_javaScriptEnabled"`;
var IOS_BINDINGS: string = `[allowsInlineMediaPlayback]="_allowsInlineMediaPlayback" [bounces]="_bounces" [decelerationRate]="_decelerationRate"
  [scalesPageToFit]="_scalesPageToFit" [scrollEnabled]="_scrollEnabled"`;

//TODO: onNavigationStateChange, renderError, renderLoading, startInLoadingState, processDecelerationRate(iOS)

@Component({
  selector: 'WebView',
  inputs: [
    'automaticallyAdjustContentInsets', 'contentInset', 'injectedJavaScript', 'source'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-webview [automaticallyAdjustContentInsets]="_automaticallyAdjustContentInsets" [contentInset]="_contentInset"
  [injectedJavaScript]="_injectedJavaScript" [source]="_source"
  (topLoadingStart)="_handleLoadingStart($event)" (topLoadingFinish)="_handleLoadingFinish($event)" (topLoadingError)="_handleLoadingError($event)"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-webview>`
})
export class WebView extends HighLevelComponent{
  private _nativeElement: Node;
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper, el: ElementRef) {
    super(wrapper);
    this._nativeElement = el.nativeElement;
  }

  //Events
  @Output() loadingStart: EventEmitter<any> = new EventEmitter();
  @Output() loadingFinish: EventEmitter<any> = new EventEmitter();
  @Output() loadingError: EventEmitter<any> = new EventEmitter();

  //Properties
  private _automaticallyAdjustContentInsets: boolean;
  private _contentInset: any;
  private _injectedJavaScript: string;
  private _source: any;
  set automaticallyAdjustContentInsets(value: any) {this._automaticallyAdjustContentInsets = this.processBoolean(value);}
  set contentInset(value: any) {this._contentInset = value;}
  set injectedJavaScript(value: any) {this._injectedJavaScript = value;}
  set source(value: any) {this._source = this.resolveAssetSource(value);}

  private _domStorageEnabled: boolean;
  private _javaScriptEnabled: boolean;
  set domStorageEnabled(value: any) {this._domStorageEnabled = this.processBoolean(value);}
  set javaScriptEnabled(value: any) { this._javaScriptEnabled = this.processBoolean(value); }

  private _allowsInlineMediaPlayback: boolean;
  private _scrollEnabled: boolean;
  private _decelerationRate: number;
  private _scalesPageToFit: boolean;
  private _bounces: boolean;
  set allowsInlineMediaPlayback(value: any) {this._allowsInlineMediaPlayback = this.processBoolean(value);}
  set bounces(value: any) {this._bounces = this.processBoolean(value); }
  set decelerationRate(value: any) {this._decelerationRate = this.processNumber(value);}
  set scalesPageToFit(value: any) {this._scalesPageToFit = this.processBoolean(value);}
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

  //Commands
  goForward() {
    this._nativeElement.children[0].dispatchCommand('goForward');
  }

  reload() {
    this._nativeElement.children[0].dispatchCommand('reload');
  }

  goBack() {
    this._nativeElement.children[0].dispatchCommand('goBack');
  }
}
