import {Attribute, ComponentFactory, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Injector, OnDestroy, Output, ReflectiveInjector, ResolvedReflectiveProvider, ViewContainerRef} from '@angular/core';
import {RouterOutletMap, ActivatedRoute, PRIMARY_OUTLET} from '@angular/router';

@Directive({selector: 'router-outlet'})
export class RouterOutlet implements OnDestroy {
  private activated: ComponentRef<any>;
  private _activatedRoute: ActivatedRoute;
  public outletMap: RouterOutletMap;

  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  constructor(
    private parentOutletMap: RouterOutletMap, private location: ViewContainerRef,
    private resolver: ComponentFactoryResolver, @Attribute('name') private name: string) {
    parentOutletMap.registerOutlet(name ? name : PRIMARY_OUTLET, <any>this);
  }

  ngOnDestroy(): void { this.parentOutletMap.removeOutlet(this.name ? this.name : PRIMARY_OUTLET); }

  get isActivated(): boolean { return !!this.activated; }
  get component(): Object {
    if (!this.activated) throw new Error('Outlet is not activated');
    return this.activated.instance;
  }
  get activatedRoute(): ActivatedRoute {
    if (!this.activated) throw new Error('Outlet is not activated');
    return this._activatedRoute;
  }

  deactivate(): void {
    if (this.activated) {
      const c = this.component;
      this.activated.destroy();
      this.activated = null;
      this.deactivateEvents.emit(c);
    }
  }

  activate(
    activatedRoute: ActivatedRoute, loadedResolver: ComponentFactoryResolver,
    loadedInjector: Injector, providers: ResolvedReflectiveProvider[],
    outletMap: RouterOutletMap): void {
    this.outletMap = outletMap;
    this._activatedRoute = activatedRoute;

    const component: any = <any>activatedRoute.routeConfig.component;

    let factory: ComponentFactory<any>;
    if (loadedResolver) {
      factory = loadedResolver.resolveComponentFactory(component);
    } else {
      factory = this.resolver.resolveComponentFactory(component);
    }

    const injector = loadedInjector ? loadedInjector : this.location.parentInjector;
    const inj = ReflectiveInjector.fromResolvedProviders(providers, injector);
    this.activated = this.location.createComponent(factory, this.location.length, inj, []);
    this.activated.changeDetectorRef.detectChanges();

    this.activateEvents.emit(this.activated.instance);
  }
}
