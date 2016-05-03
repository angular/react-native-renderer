import {Directive, OnInit, OnDestroy, ElementRef} from '@angular/core';
import {Router, Instruction} from '@angular/router-deprecated';

@Directive({
  selector: '[routerLink]',
  inputs: ['routeParams: routerLink', 'event: event']
})
export class RouterLink implements OnInit, OnDestroy {
  private _el : any;
  private _navigationInstruction: Instruction;

  private _routeParams: any[];
  private _event: string = 'tap';

  constructor(private _router: Router, el: ElementRef) {
    this._el = el.nativeElement;
    this._router.subscribe((_) => this._updateInstruction());
  }

  private _updateInstruction(): void {
    this._navigationInstruction = this._router.generate(this._routeParams);
  }

  set routeParams(changes: any[]) {
    this._routeParams = changes;
    this._updateInstruction();
  }

  set event(eventName: string) {
    this._event = eventName || 'tap';
  }

  onEvent(): void {
    this._router.navigateByInstruction(this._navigationInstruction);
  }

  ngOnInit() {
    this._el.addEventListener(this._event, this.onEvent.bind(this));
  }

  ngOnDestroy() {
    this._el.removeEventListener(this._event, this.onEvent.bind(this));
  }
}
