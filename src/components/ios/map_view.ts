import {Component, Inject, Output, EventEmitter} from "@angular/core";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "../common/component";
import {REACT_NATIVE_WRAPPER} from "./../../renderer/renderer";
import {ReactNativeWrapper} from "../../wrapper/wrapper";

/**
 * A component for displaying a map.
 *
 * ```
 @Component({
  selector: 'sample',
  template: `<MapView [annotations]="[{latitude: 40, longitude: 0, title: 'Hello', tintColor: '#ce0058'}]" [region]="{latitude: 45, longitude: 0}"
    [overlays]="[{coordinates: [{latitude: 50, longitude: -5}, {latitude: 50, longitude: 5}], lineWidth: 2, strokeColor: '#ce0058'}]"></MapView>`
})
 export class Sample {}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform ios
 */
@Component({
  selector: 'MapView',
  inputs: [
    'pitchEnabled', 'region', 'rotateEnabled', 'scrollEnabled', 'showsUserLocation', 'zoomEnabled',
    'annotations', 'followUserLocation', 'legalLabelInsets', 'mapType', 'maxDelta', 'minDelta',
    'overlays', 'showsCompass', 'showsPointsOfInterest'
  ].concat(GENERIC_INPUTS),
  template: `<native-mapview [pitchEnabled]="_pitchEnabled" [region]="_region" [rotateEnabled]="_rotateEnabled" [scrollEnabled]="_scrollEnabled"
  [showsUserLocation]="_showsUserLocation" [zoomEnabled]="_zoomEnabled"
  [annotations]="_annotations" [followUserLocation]="_followUserLocation" [legalLabelInsets]="_legalLabelInsets" [mapType]="_mapType"
  [maxDelta]="_maxDelta" [minDelta]="_minDelta" [overlays]="_overlays" [showsCompass]="_showsCompass" [showsPointsOfInterest]="_showsPointsOfInterest"
  onChange="true" [_onPress]="_annotationEventsEnabled" [_onAnnotationDragStateChange]="_annotationEventsEnabled" [_onAnnotationFocus]="_annotationEventsEnabled"
  [_onAnnotationBlur]="_annotationEventsEnabled"
  (topChange)="_handleChange($event)" (topPress)="_handlePress($event)" (topAnnotationFocus)="_handleAnnotationFocus($event)"
  (topAnnotationBlur)="_handleAnnotationBlur($event)" (topAnnotationDragStateChange)="_handleAnnotationDragStateChange($event)"
  ${GENERIC_BINDINGS}></native-mapview>`
})
export class MapView extends HighLevelComponent {
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
  }

  //Events
  /**
   * To be documented
   */
  @Output() change: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   * {annotation: Annotation, action: "annotation-click"}
   */
  @Output() annotationPress: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   * {annotation: Annotation}
   */
  @Output() annotationFocus: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   * {annotation: Annotation}
   */
  @Output() annotationBlur: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   * {annotation: Annotation}
   */
  @Output() annotationDragStateChange: EventEmitter<any> = new EventEmitter();

  //Properties
  private _pitchEnabled: boolean;
  private _region: any;
  private _rotateEnabled: boolean;
  private _scrollEnabled: boolean;
  private _showsUserLocation: boolean;
  private _zoomEnabled: boolean;
  /**
   * To be documented
   */
  set pitchEnabled(value: any) {this._pitchEnabled = this.processBoolean(value);}
  /**
   * To be documented
   * {latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number}
   */
  set region(value: any) {this._region = value;}
  /**
   * To be documented
   */
  set rotateEnabled(value: any) {this._rotateEnabled = this.processBoolean(value);}
  /**
   * To be documented
   */
  set scrollEnabled(value: any) {this._scrollEnabled = this.processBoolean(value);}
  /**
   * To be documented
   */
  set showsUserLocation(value: any) {this._showsUserLocation = this.processBoolean(value);}
  /**
   * To be documented
   */
  set zoomEnabled(value: any) {this._zoomEnabled = this.processBoolean(value);}

  //TODO: manage views and events on annotations
  private _annotations: Array<any>;
  private _annotationEventsEnabled: boolean = false;
  private _annotationMap: Map<string, any>;
  private _followUserLocation: boolean;
  private _legalLabelInsets: any;
  private _mapType: string;
  private _maxDelta: number;
  private _minDelta: number;
  private _overlays: Array<any>;
  private _showsCompass: boolean;
  private _showsPointsOfInterest: boolean;
  /**
   * To be documented
   * [{latitude: number, longitude: number, animateDrop: bool, draggable: bool, title: string, subtitle: string,
   * tintColor: color, image: source, id: string}]
   * Custom views in annotations are not yet managed.
   */
  set annotations(value: Array<any>) {
    if(value) {
      this._annotationEventsEnabled = true;
      this._annotationMap = new Map<string, any>();
      this._annotations = value.map((annotation) => {
        var res = annotation;
        res['id'] = annotation.id || encodeURIComponent(JSON.stringify(annotation));
        this._annotationMap.set(res['id'], res);
        if (annotation.tintColor) {
          res['tintColor'] = this.processColor(annotation.tintColor);
        }
        if (annotation.image) {
          res['image'] = this.resolveAssetSource(annotation.image);
        }
        return res;
      });
    } else {
      this._annotationEventsEnabled = false;
      delete this._annotations;
    }
  }
  /**
   * To be documented
   */
  set followUserLocation(value: any) {this._followUserLocation = this.processBoolean(value);}
  /**
   * To be documented
   * {top: number, left: number, bottom: number, right: number}
   */
  set legalLabelInsets(value: any) {this._legalLabelInsets = value;}
  /**
   * To be documented
   */
  set mapType(value: string) {this._mapType = this.processEnum(value, ['standard', 'satellite', 'hybrid']);}
  /**
   * To be documented
   */
  set maxDelta(value: any) {this._maxDelta = this.processNumber(value);}
  /**
   * To be documented
   */
  set minDelta(value: any) {this._minDelta = this.processNumber(value);}
  /**
   * To be documented
   * [{coordinates: [{latitude: number, longitude: number}], lineWidth: number, strokeColor: color, fillColor: color, id: string}]
   */
  set overlays(value: Array<any>) {
    if(value) {
      this._overlays = value.map((overlay) => {
        var res = overlay;
        res['id'] = overlay.id || encodeURIComponent(JSON.stringify(overlay));
        this._annotationMap.set(res['id'], res);
        if (overlay.strokeColor) {
          res['strokeColor'] = this.processColor(overlay.strokeColor);
        }
        if (overlay.fillColor) {
          res['fillColor'] = this.processColor(overlay.fillColor);
        }
        return res;
      });
    } else {
      delete this._overlays;
    }
  }
  /**
   * To be documented
   */
  set showsCompass(value: any) {this._showsCompass = this.processBoolean(value);}
  /**
   * To be documented
   */
  set showsPointsOfInterest(value: any) {this._showsPointsOfInterest = this.processBoolean(value);}


  _handleChange(event: any) {
    //Event example: {region: {latitude: 45, longitude: 0, latitudeDelta: 9, longitudeDelta: 73}, continuous: true}
    this.change.emit(event);
  }

  _handlePress(event: any) {
    //Event example: {annotation: Object, action: "annotation-click", target: 22}
    this.annotationPress.emit({annotation: event.annotation, action: event.action})
  }

  _handleAnnotationFocus(event: any) {
    //Event example: {target: 22, annotationId: "fdsfs"}
    this.annotationFocus.emit({annotation: this._annotationMap.get(event.annotationId)});
  }

  _handleAnnotationBlur(event: any) {
    //Event example: {target: 22, annotationId: "fdsfs"}
    this.annotationFocus.emit({annotation: this._annotationMap.get(event.annotationId)});
  }

  _handleAnnotationDragStateChange(event: any) {
    //Event example: {target: 22, annotationId: "fdsfs"}
    this.annotationDragStateChange.emit({annotation: this._annotationMap.get(event.annotationId)});
  }
}
