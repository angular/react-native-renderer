import {RouterOutlet, RouterModule, Routes, ExtraOptions} from "@angular/router";
import {LocationStrategy} from "@angular/common";
import {NgModule, ModuleWithProviders} from "@angular/core";
import {RouterLink} from "./router_link";
import {ReactNativeLocationStrategy} from "./location_strategy";

const ROUTER_DIRECTIVES: any[] = [
  RouterOutlet, RouterLink
];

@NgModule({declarations: ROUTER_DIRECTIVES, exports: ROUTER_DIRECTIVES})
export class ReactNativeRouterModule {

  static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders {
    const defModule = RouterModule.forRoot(routes, config);
    return {
      ngModule: ReactNativeRouterModule,
      providers: [
        defModule.providers,
        {provide: LocationStrategy, useClass: ReactNativeLocationStrategy }
      ]
    };
  }

  static forChild(routes: Routes): ModuleWithProviders {
    const defModule = RouterModule.forChild(routes);
    return {ngModule: ReactNativeRouterModule, providers: defModule.providers};
  }
}