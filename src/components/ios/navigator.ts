import {
  Component,
  Inject,
  Injector,
  Input,
  Output,
  EventEmitter,
  NgZone,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  AfterViewInit, OnDestroy, ResolvedReflectiveProvider
} from "@angular/core";
import {LocationStrategy} from "@angular/common";
import {Router, ActivatedRoute, RouterOutletMap, PRIMARY_OUTLET} from "@angular/router";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "../common/component";
import {REACT_NATIVE_WRAPPER} from "./../../renderer/renderer";
import {ReactNativeWrapper} from "../../wrapper/wrapper";
import {Node} from "../../renderer/node";

@Component({
  selector: 'NavigatorItem',
  inputs: ['activatedRoute'],
  template: `<native-navitem [title]="_title" [titleImage]="_titleImage" [backButtonTitle]="_backButtonTitle" [leftButtonTitle]="_leftButtonTitle" [rightButtonTitle]="_rightButtonTitle"
  [navigationBarHidden]="navigationBarHidden" [shadowHidden]="shadowHidden" [translucent]="translucent"
  [barTintColor]="barTintColor" [tintColor]="tintColor" [titleTextColor]="titleTextColor"
  [backButtonIcon]="_backButtonIcon" [leftButtonIcon]="_leftButtonIcon" [rightButtonIcon]="_rightButtonIcon"
  [style]="[_defaultStyle, itemWrapperStyle, _wrapperStyle]" onLeftButtonPress="true" onRightButtonPress="true"
  (topLeftButtonPress)="_handleLeftButtonPress()" (topRightButtonPress)="_handleRightButtonPress()">
    <dummy-anchor-for-dynamic-loader #target></dummy-anchor-for-dynamic-loader>
  </native-navitem>`
})
export class NavigatorItem extends HighLevelComponent implements AfterViewInit {
  @ViewChild('target', {read: ViewContainerRef}) target: ViewContainerRef;

  @Input() itemWrapperStyle: any;
  @Input() navigationBarHidden: boolean;
  @Input() shadowHidden: boolean;
  @Input() translucent: boolean;
  @Input() barTintColor: number;
  @Input() tintColor: number;
  @Input() titleTextColor: number;
  private _activatedRoute: ActivatedRoute;
  private _title: string;
  private _titleImage: any;
  private _backButtonTitle: string;
  private _leftButtonTitle: string;
  private _rightButtonTitle: string;
  private _backButtonIcon: any;
  private _leftButtonIcon: any;
  private _rightButtonIcon: any;
  private _wrapperStyle: any;

  //Events
  @Output() leftButtonPress: EventEmitter<ActivatedRoute> = new EventEmitter();
  @Output() rightButtonPress: EventEmitter<ActivatedRoute> = new EventEmitter();
  @Output() componentLoad: EventEmitter<any> = new EventEmitter();

  constructor(private _componentFactoryResolver: ComponentFactoryResolver, private _injector: Injector, @Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
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

  set activatedRoute(activatedRoute: ActivatedRoute) {
    this._activatedRoute = activatedRoute;
    var data = activatedRoute.snapshot.data;
    if (data['title']) {this._title = data['title'];}
    if (data['titleImage']) {this._titleImage = this.resolveAssetSource(data['titleImage']);}
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
  }

  _handleLeftButtonPress() {
    this.leftButtonPress.emit(this._activatedRoute);
  }

  _handleRightButtonPress() {
    this.rightButtonPress.emit(this._activatedRoute);
  }

  ngAfterViewInit() {
    const component: any = this._activatedRoute.routeConfig.component;
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory<any>(component);
    const componentRef = this.target.createComponent(componentFactory, 0, this._injector, []);
    componentRef.changeDetectorRef.detectChanges();
    this.componentLoad.emit(componentRef.instance);
  }
}

/**
 * A component for displaying a navigator.
 *
 * It acts as the primary outlet for the router.
 * A Router's navigation triggers a navigation of the Navigator.
 *
 * For each route, additional data can be provided as follows:
 * {title: string, titleImage: any, backButtonIcon: any, backButtonTitle: string, leftButtonIcon: any, leftButtonTitle: string, rightButtonIcon: any, rightButtonTitle: string,
 * wrapperStyle: any, navigationBarHidden: boolean, shadowHidden: boolean, tintColor: string, barTintColor: string, titleTextColor: string, translucent: boolean}
 *
 * ```
@Component({
  selector: 'foo',
  template: `<View routerLink="bar"><Text>Foo from here</Text></View>`
})
class Foo {}

@Component({
  selector: 'bar',
  template: `<View><Text>Bar from here</Text></View>`
})
class Bar {}

@Component({
  selector: 'sample',
  template: `<Navigator (rightButtonPress)="_navigate($event)"></Navigator>`
})
export class Sample {
  constructor(private router: Router) {
  }

  _navigate(event: ActivatedRoute) {
    this.router.navigateByUrl('/bar');
  }
}


const moreLogo = require('../../assets/icon_more.png');
const appRoutes = [
 { path: '', component: Foo, data: {title: 'foo!', rightButtonIcon: moreLogo, backButtonTitle: 'back'}},
 { path: 'bar', component: Bar, data: {title: 'bar!'} }
];

@NgModule({
  declarations: [Sample, CompA, CompB],
  imports: [ReactNativeModule, CommonModule, ReactNativeRouterModule.forRoot(appRoutes)],
  bootstrap: [Sample]
})
export class AppModule {}

 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 * @platform ios
 */
@Component({
  selector: 'Navigator',
  inputs: [
    'barTintColor', 'interactivePopGestureEnabled', 'itemWrapperStyle', 'navigationBarHidden', 'shadowHidden', 'tintColor', 'titleTextColor', 'translucent'
  ].concat(GENERIC_INPUTS),
  template: `<native-navigator *ngIf="_stack.length > 0" [interactivePopGestureEnabled]="_interactivePopGestureEnabled" [requestedTopOfStack]="_requestedTopOfStack"
  onNavigationComplete="true" (topNavigationComplete)="_handleNavigationComplete($event)"
  ${GENERIC_BINDINGS}>
    <NavigatorItem *ngFor="let activatedRoute of _stack" [itemWrapperStyle]="_itemWrapperStyle"
    [barTintColor]="_barTintColor" [navigationBarHidden]="_navigationBarHidden"
    [shadowHidden]="_shadowHidden" [tintColor]="_tintColor" [titleTextColor]="_titleTextColor" [translucent]="_translucent"
    [activatedRoute]="activatedRoute"
    (leftButtonPress)="_handleLeftButtonPress($event)" (rightButtonPress)="_handleRightButtonPress($event)" (componentLoad)="_handleComponentLoad($event)"></NavigatorItem>
  </native-navigator>`
})
export class Navigator extends HighLevelComponent implements OnDestroy {
  private _requestedTopOfStack: number ;
  private _stack: Array<ActivatedRoute> = [];
  private _loadedComponents: Array<any> = [];
  private _wrapper: ReactNativeWrapper;

  constructor(private router: Router, private zone: NgZone, private locationStrategy: LocationStrategy, private elementRef: ElementRef,
              private parentOutletMap: RouterOutletMap, @Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper) {
    super(wrapper);
    this._wrapper = wrapper;
    parentOutletMap.registerOutlet(PRIMARY_OUTLET, <any>this);
    this.setDefaultStyle({flex: 1});
  }

  activate(activatedRoute: ActivatedRoute, loadedResolver: ComponentFactoryResolver,
           loadedInjector: Injector, providers: ResolvedReflectiveProvider[],
           outletMap: RouterOutletMap): void {
    if (this._stack.length == 0) {
      this._stack.push(activatedRoute);
    } else {
      var navigator: Node = this.elementRef.nativeElement.children[1];
      setTimeout(()=> {
        this._wrapper.requestNavigatorLock(navigator.nativeTag, (lockAcquired) => this._handleNavigation(lockAcquired, navigator, activatedRoute));
      }, 0)
    }
  }

  deactivate(): void {}

  ngOnDestroy(): void { this.parentOutletMap.removeOutlet(PRIMARY_OUTLET); }

  _handleNavigation(lockAcquired: boolean, navigator: Node, activatedRoute: ActivatedRoute): void {
    this.zone.run(() => {
      if (lockAcquired) {
        if (this._stack.map((ar) => ar.routeConfig.path).indexOf(activatedRoute.routeConfig.path) == -1) {
          this._stack.push(activatedRoute);
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
  @Output() leftButtonPress: EventEmitter<ActivatedRoute> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() rightButtonPress: EventEmitter<ActivatedRoute> = new EventEmitter();

  //Properties
  private _barTintColor: number;
  private _interactivePopGestureEnabled: boolean;
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
  set interactivePopGestureEnabled(value: any) {this._interactivePopGestureEnabled = this.processBoolean(value);}
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

  _handleLeftButtonPress(event: ActivatedRoute) {
    this.leftButtonPress.emit(event);
  }

  _handleRightButtonPress(event: ActivatedRoute) {
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
