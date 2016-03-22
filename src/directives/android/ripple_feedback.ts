import {Directive, ElementRef, OnDestroy, OnInit, Input, Inject} from 'angular2/core';
import {REACT_NATIVE_WRAPPER} from './../../renderer/renderer';
import {ReactNativeWrapper} from './../../wrapper/wrapper';

@Directive({
  selector: '[rippleFeedback]'
})
export class RippleFeedback implements OnInit, OnDestroy {
  private _el: any;
  private _wrapper: ReactNativeWrapper;
  @Input() rippleFeedback: string;

  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper, el: ElementRef) {
    this._el = el.nativeElement;
    this._wrapper = wrapper;
  }

  private _start(event: any) {
    this._el.children[0].dispatchCommand('hotspotUpdate', [event.srcEvent.clientX || 0, event.srcEvent.clientY || 0]);
    this._el.children[0].dispatchCommand('setPressed', [true]);
  }

  private _stop(event: any) {
    this._el.children[0].dispatchCommand('hotspotUpdate', [event.srcEvent.clientX || 0, event.srcEvent.clientY || 0]);
    this._el.children[0].dispatchCommand('setPressed', [false]);
  }

  ngOnInit() {
    this._el.children[0].addEventListener('tapstart', this._start.bind(this));
    this._el.children[0].addEventListener('tapcancel', this._stop.bind(this));
    this._el.children[0].addEventListener('tap', this._stop.bind(this));
    setTimeout(() => {
      this._el.children[0].setProperty('nativeBackgroundAndroid',
        {type: 'RippleAndroid', color: this._wrapper.processColor(this.rippleFeedback) || -1, borderless: false});
    }, 0);
  }

  ngOnDestroy() {
    this._el.children[0].removeEventListener('tapstart', this._start.bind(this));
    this._el.children[0].removeEventListener('tapcancel', this._stop.bind(this));
    this._el.children[0].removeEventListener('tap', this._stop.bind(this));
  }
}