import {Component, ElementRef, Inject} from 'angular2/core';
import {REACT_NATIVE_WRAPPER} from './../renderer/renderer';
import {ReactNativeWrapper} from './../wrapper/wrapper';
import {Node} from '../renderer/node';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

@Component({
  selector: 'View',
  inputs: GENERIC_INPUTS,
  template: `<native-view ${GENERIC_BINDINGS}><ng-content></ng-content></native-view>`
})
export class View extends HighLevelComponent {
  private _nativeElement: Node;
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper, el: ElementRef) {
    super(wrapper);
    this._nativeElement = el.nativeElement;
  }

  //Commands
  setPressed(isPressed: boolean) {
    this._nativeElement.children[0].dispatchCommand('setPressed', [isPressed]);
  }

  hotspotUpdate(x: number, y: number) {
    this._nativeElement.children[0].dispatchCommand('hotspotUpdate', [x || 0, y || 0]);
  }
}
