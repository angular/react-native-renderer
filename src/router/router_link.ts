import {Directive, OnInit, OnDestroy, ElementRef, Input} from "@angular/core";
import {Router, ActivatedRoute, UrlTree} from '@angular/router';

@Directive({selector: '[routerLink]'})
export class RouterLink implements OnInit, OnDestroy {
  private _el : any;
  private commands: any[] = [];
  @Input() queryParams: {[k: string]: any};
  @Input() fragment: string;
  @Input() preserveQueryParams: boolean;
  @Input() preserveFragment: boolean;
  @Input() event: string = 'tap';

  constructor(private router: Router, private route: ActivatedRoute, el: ElementRef) {
    this._el = el.nativeElement;
  }

  @Input()
  set routerLink(data: any[] | string) {
    if (Array.isArray(data)) {
      this.commands = <Array<any>>data;
    } else {
      this.commands = [data];
    }
  }

  onEvent(): boolean {
    this.router.navigateByUrl(this.urlTree);
    return false;
  }

  get urlTree(): UrlTree {
    return this.router.createUrlTree(this.commands, {
      relativeTo: this.route,
      queryParams: this.queryParams,
      fragment: this.fragment,
      preserveQueryParams: toBool(this.preserveQueryParams),
      preserveFragment: toBool(this.preserveFragment)
    });
  }

  ngOnInit() {
    this._el.addEventListener(this.event, this.onEvent.bind(this));
  }

  ngOnDestroy() {
    this._el.removeEventListener(this.event, this.onEvent.bind(this));
  }
}

function toBool(s?: any): boolean {
  if (s === '') return true;
  return !!s;
}
