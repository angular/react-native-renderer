import {Location, LocationStrategy} from '@angular/common';
import {Compiler, Injectable, Injector, ModuleWithProviders, NgModule, NgModuleFactory, NgModuleFactoryLoader} from '@angular/core';
import {Route, Router, RouterOutletMap, Routes, UrlSerializer, provideRoutes, __router_private__, PreloadingStrategy, NoPreloading} from '@angular/router';
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
  urlSerializer: UrlSerializer, outletMap: RouterOutletMap, location: Location,
  loader: NgModuleFactoryLoader, compiler: Compiler, injector: Injector, routes: Route[][]) {
  return new Router(
    null, urlSerializer, outletMap, location, injector, loader, compiler, __router_private__.flatten(routes));
}

@NgModule({
  exports: [ReactNativeRouterModule],
  providers: [
    __router_private__.ROUTER_PROVIDERS,
    {provide: LocationStrategy, useClass: ReactNativeLocationStrategy },
    {provide: NgModuleFactoryLoader, useClass: SpyNgModuleFactoryLoader},
    {
      provide: Router,
      useFactory: setupTestingRouter,
      deps: [
        UrlSerializer, RouterOutletMap, Location, NgModuleFactoryLoader, Compiler, Injector, __router_private__.ROUTES
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
