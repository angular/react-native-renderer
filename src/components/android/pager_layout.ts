import {Component, Inject, ElementRef, Output, EventEmitter, OnInit} from "@angular/core";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "../common/component";
import {Node} from "../../renderer/node";
import {REACT_NATIVE_WRAPPER} from "./../../renderer/renderer";
import {ReactNativeWrapper} from "../../wrapper/wrapper";

/**
 * A component for displaying a pager layout.
 *
 * ```
@Component({
  selector: 'sample',
  template: `
<PagerLayout initialPage="0">
  <View></View>
  <View></View>
</PagerLayout>`
})
export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform android
 */
@Component({
  selector: 'PagerLayout',
  inputs: [
    //Non-native
    'initialPage', 'keyboardDismissMode',
    //Native
    'scrollEnabled'
  ].concat(GENERIC_INPUTS),
  template: `<native-pagerlayout [scrollEnabled]="_scrollEnabled"
  (topPageScroll)="_handlePageScroll($event)" (topPageScrollStateChanged)="_handlePageScrollStateChanged($event)" (topPageSelected)="_handlePageSelected($event)"
  ${GENERIC_BINDINGS}><ng-content></ng-content></native-pagerlayout>`
})
export class PagerLayout extends HighLevelComponent implements OnInit {
  private _nativeElement: Node;
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper, el: ElementRef) {
    super(wrapper);
    this._nativeElement = el.nativeElement;
  }

  //Events
  /**
   * To be documented
   */
  @Output() pageScroll: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() pageScrollStateChanged: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() pageSelected: EventEmitter<any> = new EventEmitter();

  //Properties
  public _initialPage: number;
  public _keyboardDismissMode: string;
  public _scrollEnabled: boolean;
  /**
   * To be documented
   */
  set initialPage(value: any) { this._initialPage = this.processNumber(value);}
  /**
   * To be documented
   */
  set keyboardDismissMode(value: string) {this._keyboardDismissMode = this.processEnum(value, ['none', 'on-drag']);}
  /**
   * To be documented
   */
  set scrollEnabled(value: any) { this._scrollEnabled = this.processBoolean(value);}

  //Event handlers
  _handlePageScroll(event: any) {
    //Event example: {offset: 0.75, position: 0}
    this.pageScroll.emit(event);
    if (this._keyboardDismissMode === 'on-drag') {
      this.dismissKeyboard();
    }
  }

  _handlePageScrollStateChanged(event: any) {
    // Event examples: {pageScrollState: "idle"}, {pageScrollState: "dragging"}, {pageScrollState: "settling"}
    this.pageScrollStateChanged.emit(event);
  }

  _handlePageSelected(event: any) {
    // Event example: {position: 1}
    this.pageSelected.emit(event);
  }

  //Commands
  /**
   * To be documented
   */
  setPage(index: number) {
    this._nativeElement.children[0].dispatchCommand('setPage', [index]);
  }

  /**
   * To be documented
   */
  setPageWithoutAnimation(index: number) {
    this._nativeElement.children[0].dispatchCommand('setPageWithoutAnimation', [index]);
  }

  //Lifecycle
  ngOnInit() {
    if (this._initialPage) {
      setTimeout(() => {
        this.setPageWithoutAnimation(this._initialPage);
      }, 0);
    }
  }
}
