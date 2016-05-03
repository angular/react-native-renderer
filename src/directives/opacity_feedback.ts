import {Directive, ElementRef, OnDestroy, OnInit} from '@angular/core';

@Directive({
  selector: '[opacityFeedback]'
})
export class OpacityFeedback implements OnInit, OnDestroy {
  private _el: any;

  constructor(el: ElementRef) {
    this._el = el.nativeElement;
  }

  private _highlight() {
    this._el.children[0].setProperty('opacity', 0.5);
  }

  private _unhighlight() {
    this._el.children[0].setProperty('opacity', 1)
  }

  ngOnInit() {
    this._el.children[0].addEventListener('tapstart', this._highlight.bind(this));
    this._el.children[0].addEventListener('tapcancel', this._unhighlight.bind(this));
    this._el.children[0].addEventListener('tap', this._unhighlight.bind(this));
  }

  ngOnDestroy() {
    this._el.children[0].removeEventListener('tapstart', this._highlight.bind(this));
    this._el.children[0].removeEventListener('tapcancel', this._unhighlight.bind(this));
    this._el.children[0].removeEventListener('tap', this._unhighlight.bind(this));
  }
}