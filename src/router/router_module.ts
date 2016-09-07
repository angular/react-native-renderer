import {NgModule} from "@angular/core";
import {RouterLink} from "./router_link";
import {RouterOutlet} from "./router_outlet";

const ROUTER_DIRECTIVES: any[] = [
  RouterOutlet, RouterLink
];

@NgModule({
  declarations: ROUTER_DIRECTIVES,
  exports: ROUTER_DIRECTIVES
})
export class ReactNativeRouterModule {}