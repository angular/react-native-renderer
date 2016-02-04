import {Component, ElementRef} from 'angular2/core';
import {Node} from '../renderer/node';

@Component({
  selector: 'View',
  inputs: [
    //all
    'accessible', 'accessibilityLabel', 'testID', 'pointerEvents', 'removeClippedSubviews', 'onLayout',
    //Android
    'collapsable', 'accessibilityLiveRegion', 'accessibilityComponentType', 'importantForAccessibility',
    'needsOffscreenAlphaCompositing', 'renderToHardwareTextureAndroid ', 'nativeBackgroundAndroid',
    //iOS
    'accessibilityTraits', 'shouldRasterizeIOS',
    //style
    'styleSheets', 'style'
  ],
  template: `
<native-view [accessible]="_accessible" [accessibilityLabel]="_accessibilityLabel" [testID]="_testID" [pointerEvents]="_pointerEvents" [removeClippedSubviews]="_removeClippedSubviews"
  [onLayout]="_onLayout" [collapsable]="_collapsable" [accessibilityLiveRegion]="_accessibilityLiveRegion" [accessibilityComponentType]="_accessibilityComponentType"
  [importantForAccessibility]="_importantForAccessibility" [needsOffscreenAlphaCompositing]="_needsOffscreenAlphaCompositing" [renderToHardwareTextureAndroid]="_renderToHardwareTextureAndroid"
  [nativeBackgroundAndroid]="_nativeBackgroundAndroid" [accessibilityTraits]="_accessibilityTraits" [shouldRasterizeIOS]="_shouldRasterizeIOS"
  [styleSheets]="_styleSheets" [style]="_style">
  <ng-content></ng-content>
</native-view>`
})
export class View {
  private _nativeElement: Node;
  constructor(el: ElementRef) {
    this._nativeElement = el.nativeElement;
  }

  //Commands
  setPressed(isPressed: boolean) {
    this._nativeElement.children[1].dispatchCommand('setPressed', [isPressed]);
  }
  hotspotUpdate(x: number, y: number) {
    this._nativeElement.children[1].dispatchCommand('hotspotUpdate', [x || 0, y || 0]);
  }

  //Properties
  private _accessible: boolean;
  private _accessibilityLabel: string;
  private _testID: string;
  private _pointerEvents: string;
  private _removeClippedSubviews: boolean;
  private _onLayout: boolean;
  set accessible(value: any) { this._accessible = value == true || value == 'true';}
  set accessibilityLabel(value: string) {this._accessibilityLabel = value;}
  set testID(value: string) {this._testID = value;}
  set pointerEvents(value: string) {this._pointerEvents = (['box-none', 'none', 'box-only', 'auto'].indexOf(value) > -1) ? value : 'auto';}
  set removeClippedSubviews(value: any) { this._removeClippedSubviews = value == true || value == 'true';}
  set onLayout(value: any) { this._onLayout = value == true || value == 'true';}

  private _collapsable: boolean;
  private _accessibilityLiveRegion: string;
  private _accessibilityComponentType: string;
  private _importantForAccessibility: string;
  private _needsOffscreenAlphaCompositing: boolean;
  private _renderToHardwareTextureAndroid: boolean;
  private _nativeBackgroundAndroid: any;
  set collapsable(value: any) { this._collapsable = value == true || value == 'true';}
  set accessibilityLiveRegion(value: string) {this._accessibilityLiveRegion = value;}
  set accessibilityComponentType(value: string) {this._accessibilityComponentType = value;}
  set importantForAccessibility(value: string) {this._importantForAccessibility = value;}
  set needsOffscreenAlphaCompositing(value: any) { this._needsOffscreenAlphaCompositing = value == true || value == 'true';}
  set renderToHardwareTextureAndroid(value: any) { this._renderToHardwareTextureAndroid = value == true || value == 'true';}
  set nativeBackgroundAndroid(value: any) {this._nativeBackgroundAndroid = value;}

  private _accessibilityTraits: any;
  private _shouldRasterizeIOS: boolean;
  set accessibilityTraits(value: any) {this._accessibilityTraits = value;}
  set shouldRasterizeIOS(value: any) { this._shouldRasterizeIOS = value == true || value == 'true';}

  //Style
  private _styleSheets: Array<number>;
  private _style: {[s: string]: any };
  set styleSheets(value: Array<number>) {this._styleSheets = value;}
  set style(value: {[s: string]: any }) {this._style = value;}
}
