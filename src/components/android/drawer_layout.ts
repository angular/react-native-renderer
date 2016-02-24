import {Component, Inject, ElementRef, Output, EventEmitter} from 'angular2/core';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./../component";
import {REACT_NATIVE_WRAPPER} from './../../renderer/renderer';
import {ReactNativeWrapper} from "../../wrapper/wrapper";

@Component({
  selector: 'DrawerLayoutSide',
  template: `<ng-content></ng-content>`
})
export class DrawerLayoutSide {}

@Component({
  selector: 'DrawerLayoutContent',
  template: `<ng-content></ng-content>`
})
export class DrawerLayoutContent {}

@Component({
  selector: 'DrawerLayout',
  inputs: [
    //Non-native
    'keyboardDismissMode',
    //Native
    'drawerPosition', 'drawerWidth',
  ].concat(GENERIC_INPUTS),
  template: `<native-drawerlayout [drawerPosition]="_drawerPosition" [drawerWidth]="_drawerWidth"
  (topDrawerClosed)="_handleDrawerClosed($event)" (topDrawerOpened)="_handleDrawerOpened($event)"
  (topDrawerSlide)="_handleDrawerSlide($event)" (topDrawerStateChanged)="_handleDrawerStateChanged($event)"
  ${GENERIC_BINDINGS}>
    <native-view position="absolute" top="0" left="0" right="0" bottom="0" collapsable="false">
      <ng-content select="DrawerLayoutSide"></ng-content>
    </native-view>
    <native-view position="absolute" top="0" bottom="0" [width]="_drawerWidth" collapsable="false">
      <ng-content select="DrawerLayoutContent"></ng-content>
    </native-view>
  </native-drawerlayout>`
})
export class DrawerLayout extends HighLevelComponent {
  private _nativeElement: Node;
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper, el: ElementRef) {
    super(wrapper);
    this._nativeElement = el.nativeElement;
  }

  //Events
  @Output() drawerClosed: EventEmitter<any> = new EventEmitter();
  @Output() drawerOpened: EventEmitter<any> = new EventEmitter();
  @Output() drawerSlide: EventEmitter<any> = new EventEmitter();
  @Output() drawerStateChanged: EventEmitter<any> = new EventEmitter();

  //Properties
  private _keyboardDismissMode: string;
  private _drawerPosition: number;
  private _drawerWidth: number;
  set keyboardDismissMode(value: string) {this._keyboardDismissMode = this.processEnum(value, ['none', 'on-drag']);}
  set drawerPosition(value: any) {
    this._drawerPosition = value === 'right' ?
      this.getUIManager().AndroidDrawerLayout.Constants.DrawerPosition.Right :
      this.getUIManager().AndroidDrawerLayout.Constants.DrawerPosition.Left;
  }
  set drawerWidth(value: any) {this._drawerWidth = this.processNumber(value);}

  //Event handlers
  _handleDrawerClosed(event: any) {
    //Event example: {}
    this.drawerClosed.emit(event);
  }

  _handleDrawerOpened(event: any) {
    // Event examples: {}
    this.drawerOpened.emit(event);
  }

  _handleDrawerSlide(event: any) {
    // Event example: {offset: 0.75}
    this.drawerSlide.emit(event);
    if (this._keyboardDismissMode === 'on-drag') {
      this.dismissKeyboard();
    }
  }

  _handleDrawerStateChanged(event: any) {
    // Event examples: {drawerState: 0}, {drawerState: 2}
    this.drawerStateChanged.emit(event);
  }

  //Commands
  openDrawer() {
    this._nativeElement.children[0].dispatchCommand('openDrawer');
  }

  closeDrawer() {
    this._nativeElement.children[0].dispatchCommand('closeDrawer');
  }

}
