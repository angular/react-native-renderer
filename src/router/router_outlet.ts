import {Attribute, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewContainerRef} from '@angular/core';
import {ChildrenOutletContexts, ActivatedRoute, PRIMARY_OUTLET} from '@angular/router';

@Directive({selector: 'router-outlet'})
export class RouterOutlet implements OnDestroy, OnInit {
  private activated: ComponentRef<any> = null;
  private _activatedRoute: ActivatedRoute = null;
  private name: string;

  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  constructor(
    private parentContexts: ChildrenOutletContexts, private location: ViewContainerRef,
    private resolver: ComponentFactoryResolver, @Attribute('name') name: string) {
    this.name = name || PRIMARY_OUTLET;
    parentContexts.onChildOutletCreated(this.name, <any>this);
  }

  ngOnDestroy(): void { this.parentContexts.onChildOutletDestroyed(this.name); }

  ngOnInit(): void {
    if (!this.activated) {
      // If the outlet was not instantiated at the time the route got activated we need to populate
      // the outlet when it is initialized.
      const context = this.parentContexts.getContext(this.name);
      if (context && context.route) {
        if (context.attachRef) {
          // `attachRef` is populated when there is an existing component to mount
          this.attach(context.attachRef, context.route);
        } else {
          // otherwise the component defined in the configuration is created
          this.activateWith(context.route, context.resolver || null);
        }
      }
    }
  }

  get isActivated(): boolean { return !!this.activated; }

  get component(): Object {
    if (!this.activated) throw new Error('Outlet is not activated');
    return this.activated.instance;
  }

  get activatedRoute(): ActivatedRoute {
    if (!this.activated) throw new Error('Outlet is not activated');
    return this._activatedRoute as ActivatedRoute;
  }

  /**
   * Called when the `RouteReuseStrategy` instructs to detach the subtree
   */
  detach(): ComponentRef<any> {
    if (!this.activated) throw new Error('Outlet is not activated');
    this.location.detach();
    const cmp = this.activated;
    this.activated = null;
    this._activatedRoute = null;
    return cmp;
  }

  /**
   * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
   */
  attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
    this.activated = ref;
    this._activatedRoute = activatedRoute;
    this.location.insert(ref.hostView);
  }

  deactivate(): void {
    if (this.activated) {
      const c = this.component;
      this.activated.destroy();
      this.activated = null;
      this._activatedRoute = null;
      this.deactivateEvents.emit(c);
    }
  }

  activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver) {
    if (this.isActivated) {
      throw new Error('Cannot activate an already activated outlet');
    }
    this._activatedRoute = activatedRoute;
    const snapshot = activatedRoute['_futureSnapshot'];
    const component = <any>snapshot._routeConfig.component;
    resolver = resolver || this.resolver;
    const factory = resolver.resolveComponentFactory(component);
    const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
    const injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
    this.activated = this.location.createComponent(factory, this.location.length, injector);
    this.activateEvents.emit(this.activated.instance);
  }
}

class OutletInjector implements Injector {
  constructor(
    private route: ActivatedRoute, private childContexts: ChildrenOutletContexts,
    private parent: Injector) {}

  get(token: any, notFoundValue?: any): any {
    if (token === ActivatedRoute) {
      return this.route;
    }

    if (token === ChildrenOutletContexts) {
      return this.childContexts;
    }

    return this.parent.get(token, notFoundValue);
  }
}
