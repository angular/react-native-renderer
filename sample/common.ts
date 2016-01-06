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
    this._el.addEventListener('tapstart', this._highlight);
    this._el.addEventListener('tapcancel', this._unhighlight);
    this._el.addEventListener('tap', this._unhighlight);
  }
  ngOnDestroy() {
    this._el.removeEventListener('tapstart', this._highlight);
    this._el.removeEventListener('tapcancel', this._unhighlight);
    this._el.removeEventListener('tap', this._unhighlight);
  }
}