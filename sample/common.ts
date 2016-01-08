import {Directive, ElementRef, OnDestroy, OnInit, Input} from 'angular2/core';
import {processColor} from 'react-native';

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

@Directive({
  selector: '[nativeFeedback]'
})
export class NativeFeedback implements OnInit, OnDestroy {
  private _el: any;
  private _start: Function;
  private _stop: Function;
  @Input() nativeFeedback: string;

  constructor(el: ElementRef) {
    this._el = el.nativeElement;
    this._start = (event) => {
      this._el.dispatchCommand('hotspotUpdate', [event.srcEvent.clientX || 0, event.srcEvent.clientY || 0]);
      this._el.dispatchCommand('setPressed', [true]);
    };
    this._stop = (event) => {
      this._el.dispatchCommand('hotspotUpdate', [event.srcEvent.clientX || 0, event.srcEvent.clientY || 0]);
      this._el.dispatchCommand('setPressed', [false]);
    };
  }

  ngOnInit() {
    this._el.setProperty('nativeBackgroundAndroid', {type: 'RippleAndroid', color: processColor(this.nativeFeedback) || -1, borderless: false});
    this._el.addEventListener('tapstart', this._start);
    this._el.addEventListener('tapcancel', this._stop);
    this._el.addEventListener('tap', this._stop);
  }
  ngOnDestroy() {
    this._el.removeEventListener('tapstart', this._start);
    this._el.removeEventListener('tapcancel', this._stop);
    this._el.removeEventListener('tap', this._stop);
  }
}