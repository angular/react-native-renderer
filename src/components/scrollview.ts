import {Component, Output, EventEmitter, Inject, ElementRef} from "@angular/core";
import {REACT_NATIVE_WRAPPER} from "./../renderer/renderer";
import {Node} from "../renderer/node";
import {ReactNativeWrapper, isAndroid} from "./../wrapper/wrapper";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = ['endFillColor'];
var IOS_INPUTS: Array<string> = ['alwaysBounceHorizontal', 'alwaysBounceVertical', 'automaticallyAdjustContentInsets', 'bounces', 'bouncesZoom',
  'canCancelContentTouches', 'centerContent', 'contentInset', 'contentOffset', 'decelerationRate', 'directionalLockEnabled',
  'indicatorStyle', 'maximumZoomScale', 'minimumZoomScale', 'scrollEventThrottle', 'scrollIndicatorInsets',
  'scrollsToTop', 'snapToAlignment', 'snapToInterval', 'stickyHeaderIndices', 'zoomScale'];

var ANDROID_BINDINGS: string = `[endFillColor]="_endFillColor"`;
var IOS_BINDINGS: string = `[alwaysBounceHorizontal]="_alwaysBounceHorizontal" [alwaysBounceVertical]="_alwaysBounceVertical"
  [automaticallyAdjustContentInsets]="_automaticallyAdjustContentInsets" [bounces]="_bounces" [bouncesZoom]="_bouncesZoom"
  [canCancelContentTouches]="_canCancelContentTouches" [centerContent]="_centerContent" [contentInset]="_contentInset"
  [contentOffset]="_contentOffset" [decelerationRate]="_decelerationRate" [directionalLockEnabled]="_directionalLockEnabled"
  [indicatorStyle]="_indicatorStyle" [maximumZoomScale]="_maximumZoomScale" [minimumZoomScale]="_minimumZoomScale"
  [scrollEventThrottle]="_scrollEventThrottle" [scrollIndicatorInsets]="_scrollIndicatorInsets" [scrollsToTop]="_scrollsToTop"
  [snapToAlignment]="_snapToAlignment" [snapToInterval]="_snapToInterval" [stickyHeaderIndices]="_stickyHeaderIndices" [zoomScale]="_zoomScale"`;

//TODO: refreshControl, onContentSizeChange, onScrollAnimationEnd
/**
 * A component for displaying a scrollview.
 *
 * ```
@Component({
  selector: 'sample',
  template: `<ScrollView horizontal="true">
      <View></View>
      <View></View>
    </ScrollView>`
})
export class Sample {}
 * ```
 *
 * TODO: document usage of RefreshControl on Android and iOS
 *
 * @style https://facebook.github.io/react-native/docs/view.html#style
 */
@Component({
  selector: 'ScrollView',
  inputs: [
    'contentContainerStyle', 'horizontal', 'keyboardDismissMode', 'keyboardShouldPersistTaps', 'pagingEnabled', 'removeClippedSubviews', 'scrollEnabled',
    'sendMomentumEvents', 'showsHorizontalScrollIndicator', 'showsVerticalScrollIndicator'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `
  <native-scrollview [horizontal]="_horizontal" [keyboardDismissMode]="_keyboardDismissMode" [keyboardShouldPersistTaps]="_keyboardShouldPersistTaps"
  [pagingEnabled]="_pagingEnabled" [scrollEnabled]="_scrollEnabled" [sendMomentumEvents]="_sendMomentumEvents"
  [showsHorizontalScrollIndicator]="_showsHorizontalScrollIndicator" [showsVerticalScrollIndicator]="_showsVerticalScrollIndicator"
  (topScroll)="_handleScroll($event)" (topScrollBeginDrag)="_handleScrollBeginDrag($event)" (topScrollEndDrag)="_handleScrollEndDrag($event)"
  (topMomentumScrollBegin)="_handleMomentumScrollBegin($event)" (topMomentumScrollEnd)="_handleMomentumScrollEnd($event)"
  [flexDirection]="_horizontal ? 'row' : 'column'"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}>
  ${!isAndroid() ? '<ng-content select="RefreshControl"></ng-content>' : ''}
  <native-view [removeClippedSubviews]="_removeClippedSubviews" [style]="_contentContainerStyle" collapsable="false"
    [flexDirection]="_horizontal ? 'row' : null">
  <ng-content></ng-content></native-view>
  </native-scrollview>`
})
export class ScrollView extends HighLevelComponent{
  private _nativeElement: Node;
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper, el: ElementRef) {
    super(wrapper);
    this._nativeElement = el.nativeElement;
  }

  //Events
  /**
   * To be documented
   */
  @Output() scroll: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() scrollBeginDrag: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() scrollEndDrag: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() momentumScrollBegin: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() momentumScrollEnd: EventEmitter<any> = new EventEmitter();

  //Properties
  private _contentContainerStyle: any;
  private _horizontal: boolean;
  private _keyboardDismissMode: string;
  private _keyboardShouldPersistTaps: boolean;
  private _pagingEnabled: boolean;
  private _removeClippedSubviews: boolean;
  private _scrollEnabled: boolean;
  private _sendMomentumEvents: boolean;
  private _showsHorizontalScrollIndicator: boolean;
  private _showsVerticalScrollIndicator: boolean;
  /**
   * To be documented
   */
  set contentContainerStyle(value: any) {this._contentContainerStyle = value;}
  /**
   * To be documented
   */
  set horizontal(value: any) {this._horizontal = this.processBoolean(value);}
  /**
   * To be documented
   */
  set keyboardDismissMode(value: any) {this._keyboardDismissMode = this.processEnum(value, ['none', 'on-drag', 'interactive']);}
  /**
   * To be documented
   */
  set keyboardShouldPersistTaps(value: any) {this._keyboardShouldPersistTaps = this.processBoolean(value);}
  /**
   * To be documented
   */
  set pagingEnabled(value: any) {this._pagingEnabled = this.processBoolean(value);}
  /**
   * To be documented
   */
  set removeClippedSubviews(value: any) {this._removeClippedSubviews = this.processBoolean(value);}
  /**
   * To be documented
   */
  set scrollEnabled(value: any) {this._scrollEnabled = this.processBoolean(value);}
  /**
   * To be documented
   */
  set sendMomentumEvents(value: any) {this._sendMomentumEvents = this.processBoolean(value);}
  /**
   * To be documented
   */
  set showsHorizontalScrollIndicator(value: any) {this._showsHorizontalScrollIndicator = this.processBoolean(value);}
  /**
   * To be documented
   */
  set showsVerticalScrollIndicator(value: any) {this._showsVerticalScrollIndicator = this.processBoolean(value);}

  private _endFillColor: number;
  /**
   * To be documented
   * @platform android
   */
  set endFillColor(value: string){this._endFillColor = this.processColor(value);}


  private _alwaysBounceHorizontal: boolean;
  private _alwaysBounceVertical: boolean;
  private _automaticallyAdjustContentInsets: boolean;
  private _bounces: boolean;
  private _bouncesZoom: boolean;
  private _canCancelContentTouches: boolean;
  private _centerContent: boolean;
  private _contentInset: any; //{0, 0, 0, 0}
  private _contentOffset: any; //{x: 0, y: 0}
  private _decelerationRate: number;
  private _directionalLockEnabled: boolean;
  private _indicatorStyle: string;
  private _maximumZoomScale: number;
  private _minimumZoomScale: number;
  private _scrollEventThrottle: number;
  private _scrollIndicatorInsets: any; //{0, 0, 0, 0}
  private _scrollsToTop: boolean;
  private _snapToAlignment: string;
  private _snapToInterval: number;
  private _stickyHeaderIndices: Array<number>;
  private _zoomScale: number;
  /**
   * To be documented
   * @platform ios
   */
  set alwaysBounceHorizontal(value: any) {this._alwaysBounceHorizontal = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set alwaysBounceVertical(value: any) {this._alwaysBounceVertical = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set automaticallyAdjustContentInsets(value: any) {this._automaticallyAdjustContentInsets = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set bounces(value: any) {this._bounces = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set bouncesZoom(value: any) {this._bouncesZoom = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set canCancelContentTouches(value: any) {this._canCancelContentTouches = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set centerContent(value: any) {this._centerContent = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set contentInset(value: any) {this._contentInset = value;}
  /**
   * To be documented
   * @platform ios
   */
  set contentOffset(value: any) {this._contentOffset = value;}
  /**
   * To be documented
   * @platform ios
   */
  set decelerationRate(value: string| number) {
    if (value === 'normal') {
      this.getUIManager().RCTScrollView.Constants.DecelerationRate.normal;
    } else if (value === 'fast') {
      this.getUIManager().RCTScrollView.Constants.DecelerationRate.fast;
    } else {
      this._decelerationRate = this.processNumber(value);
    }
  }
  /**
   * To be documented
   * @platform ios
   */
  set directionalLockEnabled(value: any) {this._directionalLockEnabled = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set indicatorStyle(value: string) {this._indicatorStyle = this.processEnum(value, ['default', 'black', 'white',]);}
  /**
   * To be documented
   * @platform ios
   */
  set maximumZoomScale(value: any) {this._maximumZoomScale = this.processNumber(value);}
  /**
   * To be documented
   * @platform ios
   */
  set minimumZoomScale(value: any) {this._minimumZoomScale = this.processNumber(value);}
  /**
   * To be documented
   * @platform ios
   */
  set scrollEventThrottle(value: any) {this._scrollEventThrottle = this.processNumber(value);}
  /**
   * To be documented
   * @platform ios
   */
  set scrollIndicatorInsets(value: any) {this._scrollIndicatorInsets = value;}
  /**
   * To be documented
   * @platform ios
   */
  set scrollsToTop(value: any) {this._scrollsToTop = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set snapToAlignment(value: any) {this._snapToAlignment = this.processEnum(value, ['start', 'center', 'end']);}
  /**
   * To be documented
   * @platform ios
   */
  set snapToInterval(value: any) {this._snapToInterval = this.processNumber(value);}
  /**
   * To be documented
   * @platform ios
   */
  set stickyHeaderIndices(value: Array<number>) {this._stickyHeaderIndices = value;}
  /**
   * To be documented
   * @platform ios
   */
  set zoomScale(value: any) {this._zoomScale = this.processNumber(value);}

  //Event handlers
  _handleScroll(event: any) {
    // Event example:
    // {responderIgnoreScroll: true, layoutMeasurement: {height: 150, width: 400}, contentSize: {height: 150, width: 1200},
    // contentOffset: {x: 399.3, y: 0}, contentInset: {bottom: 0, left: 0, right: 0, top: 0}}
    this.scroll.emit(event);
  }

  _handleScrollBeginDrag(event: any) {
    //Event example: see above
    this.scrollBeginDrag.emit(event);
  }

  _handleScrollEndDrag(event: any) {
    //Event example: see above
    this.scrollEndDrag.emit(event);
  }

  _handleMomentumScrollBegin(event: any) {
    //Event example: see above
    this.momentumScrollBegin.emit(event);
  }

  _handleMomentumScrollEnd(event: any) {
    //Event example: see above
    this.momentumScrollEnd.emit(event);
  }

  //Commands
  /**
   * To be documented
   */
  scrollTo(x: number) {
    this._nativeElement.children[1].dispatchCommand('scrollTo', [x]);
  }

  /**
   * To be documented
   */
  scrollWithoutAnimationTo(x: number) {
    this._nativeElement.children[1].dispatchCommand('scrollWithoutAnimationTo', [x]);
  }
}
