import {ROUTER_PROVIDERS as RouterProviders, RouterOutlet} from "@angular/router-deprecated";
import {LocationStrategy} from "@angular/common";
import {RouterLink} from "./router_link";
import {ReactNativeLocationStrategy} from "./location_strategy";

export const ROUTER_PROVIDERS: any[] = [
  RouterProviders,
  {provide: LocationStrategy, useClass: ReactNativeLocationStrategy }
];

export const ROUTER_DIRECTIVES: any[] = [
  RouterOutlet, RouterLink
];