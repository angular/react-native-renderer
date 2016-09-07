import {Component, ElementRef, Inject} from "@angular/core";
import {REACT_NATIVE_WRAPPER} from "../../renderer/renderer";
import {ReactNativeWrapper} from "../../wrapper/wrapper";
import {Node} from "../../renderer/node";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

/**
 * A component for displaying a view, the default container.
 *
 * ```
@Component({
  selector: 'sample',
  template: `<View></View>`
})
export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 */
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
  /**
   * To be documented
   */
  setPressed(isPressed: boolean) {
    this._nativeElement.children[0].dispatchCommand('setPressed', [isPressed]);
  }

  /**
   * To be documented
   */
  hotspotUpdate(x: number, y: number) {
    this._nativeElement.children[0].dispatchCommand('hotspotUpdate', [x || 0, y || 0]);
  }
}
