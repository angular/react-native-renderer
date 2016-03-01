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
    this._highlight = () => {this._el.children[0].setProperty('opacity', 0.5)};
    this._unhighlight = () => {this._el.children[0].setProperty('opacity', 1)};
  }

  ngOnInit() {
    this._el.children[0].addEventListener('tapstart', this._highlight);
    this._el.children[0].addEventListener('tapcancel', this._unhighlight);
    this._el.children[0].addEventListener('tap', this._unhighlight);
  }
  ngOnDestroy() {
    this._el.children[0].removeEventListener('tapstart', this._highlight);
    this._el.children[0].removeEventListener('tapcancel', this._unhighlight);
    this._el.children[0].removeEventListener('tap', this._unhighlight);
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
    this._start = (event: any) => {
      this._el.children[0].dispatchCommand('hotspotUpdate', [event.srcEvent.pageX || 0, event.srcEvent.pageY || 0]);
      this._el.children[0].dispatchCommand('setPressed', [true]);
    };
    this._stop = (event: any) => {
      this._el.children[0].dispatchCommand('hotspotUpdate', [event.srcEvent.pageX || 0, event.srcEvent.pageY || 0]);
      this._el.children[0].dispatchCommand('setPressed', [false]);
    };
  }

  ngOnInit() {
    this._el.children[0].addEventListener('tapstart', this._start);
    this._el.children[0].addEventListener('tapcancel', this._stop);
    this._el.children[0].addEventListener('tap', this._stop);
    setTimeout(() => {
      this._el.children[0].setProperty('nativeBackgroundAndroid', {type: 'RippleAndroid', color: processColor(this.nativeFeedback) || -1, borderless: false});
    }, 0);
  }
  ngOnDestroy() {
    this._el.children[0].removeEventListener('tapstart', this._start);
    this._el.children[0].removeEventListener('tapcancel', this._stop);
    this._el.children[0].removeEventListener('tap', this._stop);
  }
}