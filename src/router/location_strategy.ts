import {Injectable, EventEmitter, NgZone} from "@angular/core";
import {LocationStrategy} from "@angular/common";

@Injectable()
export class ReactNativeLocationStrategy extends LocationStrategy {
  internalBaseHref: string = '/';
  internalPath: string = '/';
  internalTitle: string = '';
  urlChanges: string[] = [];
  /** @internal */
  _subject: EventEmitter<any> = new EventEmitter();
  constructor(private zone: NgZone) { super(); }

  simulatePopState(url: string): void {
    this.internalPath = url;
    this._subject.emit(new _MockPopStateEvent(this.path()));
  }

  path(): string { return this.internalPath; }

  prepareExternalUrl(internal: string): string {
    if (internal.startsWith('/') && this.internalBaseHref.endsWith('/')) {
      return this.internalBaseHref + internal.substring(1);
    }
    return this.internalBaseHref + internal;
  }

  pushState(ctx: any, title: string, path: string, query: string): void {
    this.internalTitle = title;

    var url = path + (query.length > 0 ? ('?' + query) : '');
    this.internalPath = url;

    var externalUrl = this.prepareExternalUrl(url);
    this.urlChanges.push(externalUrl);
  }

  replaceState(ctx: any, title: string, path: string, query: string): void {
    this.internalTitle = title;

    var url = path + (query.length > 0 ? ('?' + query) : '');
    this.internalPath = url;

    var externalUrl = this.prepareExternalUrl(url);
    this.urlChanges.push('replace: ' + externalUrl);
  }

  onPopState(fn: (value: any) => void): void { this._subject.subscribe(fn); }

  getBaseHref(): string { return this.internalBaseHref; }

  back(): void {
    if (this.urlChanges.length > 0) {
      this.urlChanges.pop();
      var nextUrl = this.urlChanges.length > 0 ? this.urlChanges[this.urlChanges.length - 1] : '';
      this.zone.run(() => this.simulatePopState(nextUrl.replace('replace: ', '')));
    }
  }

  forward(): void { throw 'not implemented'; }

  canGoBack(): boolean {
    return this.urlChanges.length > 1;
  }
}

class _MockPopStateEvent {
  pop: boolean = true;
  type: string = 'popstate';
  constructor(public newUrl: string) {}
}
