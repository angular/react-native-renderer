import {Location, LocationStrategy} from '@angular/common';
import {Compiler, Injectable, Injector, ModuleWithProviders, NgModule, NgModuleFactory, NgModuleFactoryLoader} from '@angular/core';
import {Route, Router, Routes, UrlSerializer, provideRoutes, PreloadingStrategy, NoPreloading, ChildrenOutletContexts, ɵflatten, ɵROUTER_PROVIDERS, ROUTES} from '@angular/router';
import {ReactNativeRouterModule} from './../router/router_module';
import {ReactNativeLocationStrategy} from './../router/location_strategy';

@Injectable()
export class SpyNgModuleFactoryLoader implements NgModuleFactoryLoader {
  public stubbedModules: {[path: string]: any} = {};

  constructor(private compiler: Compiler) {}

  load(path: string): Promise<NgModuleFactory<any>> {
    if (this.stubbedModules[path]) {
      return this.compiler.compileModuleAsync(this.stubbedModules[path]);
    } else {
      return <any>Promise.reject(new Error(`Cannot find module ${path}`));
    }
  }
}

export function setupTestingRouter(
  urlSerializer: UrlSerializer, childrenOutletContexts: ChildrenOutletContexts, location: Location,
  loader: NgModuleFactoryLoader, compiler: Compiler, injector: Injector, routes: Route[][]) {
  return new Router(
    null, urlSerializer, childrenOutletContexts, location, injector, loader, compiler, ɵflatten(routes));
}

@NgModule({
  exports: [ReactNativeRouterModule],
  providers: [
    ɵROUTER_PROVIDERS,
    {provide: LocationStrategy, useClass: ReactNativeLocationStrategy },
    {provide: NgModuleFactoryLoader, useClass: SpyNgModuleFactoryLoader},
    {
      provide: Router,
      useFactory: setupTestingRouter,
      deps: [
        UrlSerializer, ChildrenOutletContexts, Location, NgModuleFactoryLoader, Compiler, Injector, ROUTES
      ]
    },
    {provide: PreloadingStrategy, useExisting: NoPreloading},
    provideRoutes([])
  ]
})
export class ReactNativeRouterTestingModule {
  static withRoutes(routes: Routes): ModuleWithProviders {
    return {ngModule: ReactNativeRouterTestingModule, providers: [provideRoutes(routes)]};
  }
}
