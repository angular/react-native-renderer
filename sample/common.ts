import {Directive, ElementRef, OnDestroy, OnInit} from 'angular2/core';

@Directive({
  selector: '[highlight]'
})
export class HighLight implements OnInit, OnDestroy {
  private _el: any;
  private _highlight: Function;
  private _unhighlight: Function;

  constructor(el: ElementRef) {
    this._el = el.nativeElement;
    this._highlight = () => {this._el.setProperty('opacity', 0.5)};
    this._unhighlight = () => {this._el.setProperty('opacity', 1)};
  }

  ngOnInit() {
    this._el.addEventListener('topTouchStart', this._highlight);
    this._el.addEventListener('topTouchEnd', this._unhighlight);
  }
  ngOnDestroy() {
    this._el.removeEventListener('topTouchStart', this._highlight);
    this._el.removeEventListener('topTouchEnd', this._unhighlight);
  }
}