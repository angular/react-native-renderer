import {Component, Inject, ElementRef, Output, EventEmitter, OnInit} from 'angular2/core';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./../component";
import {Node} from '../../renderer/node';
import {REACT_NATIVE_WRAPPER} from './../../renderer/renderer';
import {ReactNativeWrapper} from "../../wrapper/wrapper";

@Component({
  selector: 'PagerLayout',
  inputs: [
    //Non-native
    'initialPage', 'keyboardDismissMode',
  ].concat(GENERIC_INPUTS),
  template: `<native-pagerlayout
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
  @Output() pageScroll: EventEmitter<any> = new EventEmitter();
  @Output() pageScrollStateChanged: EventEmitter<any> = new EventEmitter();
  @Output() pageSelected: EventEmitter<any> = new EventEmitter();

  //Properties
  private _initialPage: number;
  private _keyboardDismissMode: string;
  set initialPage(value: any) { this._initialPage = this.processNumber(value);}
  set keyboardDismissMode(value: string) {this._keyboardDismissMode = this.processEnum(value, ['none', 'on-drag']);}

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
  setPage(index: number) {
    this._nativeElement.children[0].dispatchCommand('setPage', [index]);
  }

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
