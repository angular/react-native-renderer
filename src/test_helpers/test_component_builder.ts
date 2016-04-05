import {Injectable, Injector, DirectiveResolver, ViewResolver, DynamicComponentLoader, ComponentRef, ViewMetadata} from 'angular2/core';
import {TestComponentBuilder, ComponentFixture} from 'angular2/testing';
import {Type} from 'angular2/src/facade/lang';
import {DOCUMENT} from 'angular2/src/platform/dom/dom_tokens';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {AppView} from 'angular2/src/core/linker/view';
import {ViewRef_} from 'angular2/src/core/linker/view_ref';
import {MapWrapper} from 'angular2/src/facade/collection';

export class ComponentFixture_ extends ComponentFixture {
  /** @internal */
  _componentRef: ComponentRef;
  /** @internal */
  _componentParentView: AppView;

  constructor(componentRef: ComponentRef) {
    super();
    this._componentParentView = (<ViewRef_>componentRef.hostView).internalView;
    this.elementRef = this._componentParentView.appElements[0].ref;
    this.debugElement = this._componentParentView.rootNodesOrAppElements[0].nativeElement;
    this.componentInstance = this.debugElement.componentInstance;
    this.nativeElement = this.debugElement.nativeElement;
    this._componentRef = componentRef;
  }

  detectChanges(): void {
    this._componentParentView.changeDetector.detectChanges();
    this._componentParentView.changeDetector.checkNoChanges();
  }

  destroy(): void { this._componentRef.dispose(); }
}

var _nextRootElementId = 0;

@Injectable()
export class CustomTestComponentBuilder extends TestComponentBuilder {

  _bindingsOverrides = new Map<Type, any[]>();
  _directiveOverrides = new Map<Type, Map<Type, Type>>();
  _templateOverrides = new Map<Type, string>();
  _viewBindingsOverrides = new Map<Type, any[]>();
  _viewOverrides = new Map<Type, ViewMetadata>();

  constructor(private _injector: Injector) {
    super(_injector);
  }

  _clone(): TestComponentBuilder {
    var clone = new CustomTestComponentBuilder(this._injector);
    clone._viewOverrides = MapWrapper.clone(this._viewOverrides);
    clone._directiveOverrides = MapWrapper.clone(this._directiveOverrides);
    clone._templateOverrides = MapWrapper.clone(this._templateOverrides);
    return clone;
  }

  createAsync(rootComponentType: Type): Promise<ComponentFixture> {
    var mockDirectiveResolver = this._injector.get(DirectiveResolver);
    var mockViewResolver = this._injector.get(ViewResolver);
    this._viewOverrides.forEach((view: any, type: any) => mockViewResolver.setView(type, view));
    this._templateOverrides.forEach((template: any, type: any) =>
      mockViewResolver.setInlineTemplate(type, template));
    this._directiveOverrides.forEach((overrides: any, component: any) => {
      overrides.forEach(
        (to: any, from: any) => { mockViewResolver.overrideViewDirective(component, from, to); });
    });

    this._bindingsOverrides.forEach((bindings: any, type: any) =>
      mockDirectiveResolver.setBindingsOverride(type, bindings));
    this._viewBindingsOverrides.forEach(
      (bindings: any, type: any) => mockDirectiveResolver.setViewBindingsOverride(type, bindings));


    return this._injector.get(DynamicComponentLoader)
      .loadAsRoot(rootComponentType, '#root', this._injector)
      .then((componentRef: ComponentRef) => { return new ComponentFixture_(componentRef); });
  }
}