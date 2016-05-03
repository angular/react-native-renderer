import {Component, Inject, Input, Output, EventEmitter, NgZone, DynamicComponentLoader, ElementRef, ComponentRef, ViewChild, ViewContainerRef, AfterViewInit} from '@angular/core';
import {NgFor, NgIf, LocationStrategy} from '@angular/common';
import {Router, ComponentInstruction} from '@angular/router-deprecated';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./../component";
import {REACT_NATIVE_WRAPPER} from './../../renderer/renderer';
import {ReactNativeWrapper} from "../../wrapper/wrapper";
import {Node} from "../../renderer/node";

@Component({
  selector: 'NavigatorItem',
  inputs: ['instruction'],
  template: `<native-navitem [title]="_title" [backButtonTitle]="_backButtonTitle" [leftButtonTitle]="_leftButtonTitle" [rightButtonTitle]="_rightButtonTitle"
  [navigationBarHidden]="navigationBarHidden" [shadowHidden]="shadowHidden" [translucent]="translucent"
  [barTintColor]="barTintColor" [tintColor]="tintColor" [titleTextColor]="titleTextColor"
  [backButtonIcon]="_backButtonIcon" [leftButtonIcon]="_leftButtonIcon" [rightButtonIcon]="_rightButtonIcon"
  [style]="[_defaultStyle, itemWrapperStyle, _wrapperStyle]" onLeftButtonPress="true" onRightButtonPress="true"
  (topLeftButtonPress)="_handleLeftButtonPress()" (topRightButtonPress)="_handleRightButtonPress()">
    <dummy-anchor-for-dynamic-loader #target></dummy-anchor-for-dynamic-loader>
  </native-navitem>`
})
class NavigatorItem extends HighLevelComponent implements AfterViewInit {
  @ViewChild('target', {read: ViewContainerRef}) target: ViewContainerRef;

  @Input() itemWrapperStyle: any;
  @Input() navigationBarHidden: boolean;
  @Input() shadowHidden: boolean;
  @Input() translucent: boolean;
  @Input() barTintColor: number;
  @Input() tintColor: number;
  @Input() titleTextColor: number;
  private _instruction: ComponentInstruction;
  private _title: string;
  private _backButtonTitle: string;
  private _leftButtonTitle: string;
  private _rightButtonTitle: string;
  private _backButtonIcon: any;
  private _leftButtonIcon: any;
  private _rightButtonIcon: any;
  private _wrapperStyle: any;

  //Events
  @Output() leftButtonPress: EventEmitter<ComponentInstruction> = new EventEmitter();
  @Output() rightButtonPress: EventEmitter<ComponentInstruction> = new EventEmitter();
  @Output() componentLoad: EventEmitter<any> = new EventEmitter();

  private _toBeLoaded: any = null;

  constructor(private loader: DynamicComponentLoader, private elementRef: ElementRef, @Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({
      backgroundColor: 'white',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 64,
    });
  }

  set instruction(value: ComponentInstruction) {
    this._instruction = value;
    var data = value.routeData.data;
    if (data['title']) {this._title = data['title'];}
    if (data['backButtonTitle']) {this._backButtonTitle = data['backButtonTitle'];}
    if (data['leftButtonTitle']) {this._leftButtonTitle = data['leftButtonTitle'];}
    if (data['rightButtonTitle']) {this._rightButtonTitle = data['rightButtonTitle'];}
    if (data['navigationBarHidden']) {this.navigationBarHidden = this.processBoolean(data['navigationBarHidden']);}
    if (data['shadowHidden']) {this.shadowHidden = this.processBoolean(data['shadowHidden']);}
    if (data['translucent']) {this.translucent = this.processBoolean(data['translucent']);}
    if (data['barTintColor']) {this.barTintColor = this.processColor(data['barTintColor']);}
    if (data['tintColor']) {this.tintColor = this.processColor(data['tintColor']);}
    if (data['titleTextColor']) {this.titleTextColor = this.processColor(data['titleTextColor']);}
    if (data['backButtonIcon']) {this._backButtonIcon = this.resolveAssetSource(data['backButtonIcon']);}
    if (data['leftButtonIcon']) {this._leftButtonIcon = this.resolveAssetSource(data['leftButtonIcon']);}
    if (data['rightButtonIcon']) {this._rightButtonIcon = this.resolveAssetSource(data['rightButtonIcon']);}
    if (data['wrapperStyle']) {this._wrapperStyle = data['wrapperStyle'];}

    this._toBeLoaded = value.componentType;
  }

  _handleLeftButtonPress() {
    this.leftButtonPress.emit(this._instruction);
  }

  _handleRightButtonPress() {
   this.rightButtonPress.emit(this._instruction);
  }

  ngAfterViewInit() {
    this.loader.loadNextToLocation(this._toBeLoaded, this.target).then((componentRef: ComponentRef) => {
      this.componentLoad.emit(componentRef.instance);
    });
  }
}

/**
 * A component for displaying a navigator.
 *
 * It uses a `RouteConfig` to define the different screens which can be reached.
 * A Router's navigation triggers a navigation of the Navigator.
 *
 * For each route, additional data can be provided as follows:
 * {title: string, backButtonIcon: any, backButtonTitle: string, leftButtonIcon: any, leftButtonTitle: string, rightButtonIcon: any, rightButtonTitle: string,
 * wrapperStyle: any, navigationBarHidden: boolean, shadowHidden: boolean, tintColor: string, barTintColor: string, titleTextColor: string, translucent: boolean}
 *
 * ```
Component({
  selector: 'foo',
  template: `<View [routerLink]="['/Bar']"><Text>Foo from here</Text></View>`,
  directives: [ROUTER_DIRECTIVES]
})
class Foo {}

@Component({
  selector: 'bar',
  template: `<View><Text>Bar from here</Text></View>`
})
class Bar {}

var moreLogo = require('../../assets/icon_more.png');

@RouteConfig([
 { path: '/', component: Foo, as: 'Foo', data: {title: 'foo!', rightButtonIcon: moreLogo, backButtonTitle: 'back'}},
 { path: '/bar', component: Bar, as: 'Bar', data: {title: 'bar!'} }
])
@Component({
  selector: 'sample',
  template: `<Navigator (rightButtonPress)="_navigate($event)"></Navigator>`
})
export class Sample {
  constructor(private router: Router) {
  }

  _navigate(event: ComponentInstruction) {
    this.router.navigateByUrl('/bar');
  }
}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform ios
 */
@Component({
  selector: 'Navigator',
  directives: [NgFor, NgIf, NavigatorItem],
  inputs: [
    'barTintColor', 'itemWrapperStyle', 'navigationBarHidden', 'shadowHidden', 'tintColor', 'titleTextColor', 'translucent'
  ].concat(GENERIC_INPUTS),
  template: `<native-navigator *ngIf="_stack.length > 0" [requestedTopOfStack]="_requestedTopOfStack"
  onNavigationComplete="true" (topNavigationComplete)="_handleNavigationComplete($event)"
  ${GENERIC_BINDINGS}>
    <NavigatorItem *ngFor="let instruction of _stack" [itemWrapperStyle]="_itemWrapperStyle"
    [barTintColor]="_barTintColor" [navigationBarHidden]="_navigationBarHidden"
    [shadowHidden]="_shadowHidden" [tintColor]="_tintColor" [titleTextColor]="_titleTextColor" [translucent]="_translucent"
    [instruction]="instruction"
    (leftButtonPress)="_handleLeftButtonPress($event)" (rightButtonPress)="_handleRightButtonPress($event)" (componentLoad)="_handleComponentLoad($event)"></NavigatorItem>
  </native-navigator>`
})
export class Navigator extends HighLevelComponent {
  private _requestedTopOfStack: number ;
  private _stack: Array<ComponentInstruction> = [];
  private _loadedComponents: Array<any> = [];
  constructor(private router: Router, private zone: NgZone, private locationStrategy: LocationStrategy, private elementRef: ElementRef,
              @Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.setDefaultStyle({flex: 1});
    this.router.subscribe((url) => {
      if (this._stack.length == 0) {
        this._stack.push(router.currentInstruction.component);
      } else {
        var navigator: Node = this.elementRef.nativeElement.children[1];
        setTimeout(()=> {
          wrapper.requestNavigatorLock(navigator.nativeTag, (lockAcquired) => this._handleRouterUpdate(lockAcquired, navigator));
        }, 0)
      }
    })
  }

  _handleRouterUpdate(lockAcquired: boolean, navigator: Node): void {
    var instruction: ComponentInstruction = this.router.currentInstruction.component;
    this.zone.run(() => {
      if (lockAcquired) {
        if (this._stack.indexOf(instruction) == -1) {
          this._stack.push(instruction);
        } else {
          this._stack.pop();
        }
        navigator.setProperty('requestedTopOfStack', this._stack.length - 1, true);
      }
    });
  }

  _handleComponentLoad(cpt: any) {
    this._loadedComponents.push(cpt);
  }

  /**
   * To be documented
   */
  get activeComponent(): any {
    return this._loadedComponents[this._loadedComponents.length -1];
  }

  //Events
  /**
   * To be documented
   */
  @Output() leftButtonPress: EventEmitter<ComponentInstruction> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() rightButtonPress: EventEmitter<ComponentInstruction> = new EventEmitter();

  //Properties
  private _barTintColor: number;
  private _itemWrapperStyle: any;
  private _navigationBarHidden: boolean;
  private _shadowHidden: boolean;
  private _tintColor: number;
  private _titleTextColor: number;
  private _translucent: boolean;
  /**
   * To be documented
   */
  set barTintColor(value: string) {this._barTintColor = this.processColor(value);}
  /**
   * To be documented
   */
  set itemWrapperStyle(value: any) {this._itemWrapperStyle = value;}
  /**
   * To be documented
   */
  set navigationBarHidden(value: string) {this._navigationBarHidden = this.processBoolean(value);}
  /**
   * To be documented
   */
  set shadowHidden(value: string) {this._shadowHidden = this.processBoolean(value);}
  /**
   * To be documented
   */
  set tintColor(value: string) {this._tintColor = this.processColor(value);}
  /**
   * To be documented
   */
  set titleTextColor(value: string) {this._titleTextColor = this.processColor(value);}
  /**
   * To be documented
   */
  set translucent(value: string) {this._translucent = this.processBoolean(value);}

  _handleLeftButtonPress(event: ComponentInstruction) {
    this.leftButtonPress.emit(event);
  }

  _handleRightButtonPress(event: ComponentInstruction) {
    this.rightButtonPress.emit(event);
  }

  _handleNavigationComplete(event: any) {
    if (this._stack.length > event.stackLength) {
      //Back button case
      this._loadedComponents.pop();
      this.locationStrategy.back();
    }
  }
}
