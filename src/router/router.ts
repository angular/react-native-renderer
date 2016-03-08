import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS as RouterProviders, LocationStrategy, RouterOutlet} from 'angular2/router';
import {RouterLink} from './router_link';
import {ReactNativeLocationStrategy} from './location_strategy';

export const ROUTER_PROVIDERS: any[] = [
  RouterProviders,
  provide(LocationStrategy, { useClass: ReactNativeLocationStrategy })
];

export const ROUTER_DIRECTIVES: any[] = [
  RouterOutlet, RouterLink
];