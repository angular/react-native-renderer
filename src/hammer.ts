if (typeof window === "undefined") window = {};
if (typeof document === "undefined") document = {createElement: () => {return {style: {}};}};
var hammer = (typeof window.Hammer === "undefined") ? require('hammerjs') : window.Hammer;

var _eventNames = {
  //doubletap
  'doubletap': true,
  // pan
  'pan': true,
  'panstart': true,
  'panmove': true,
  'panend': true,
  'pancancel': true,
  'panleft': true,
  'panright': true,
  'panup': true,
  'pandown': true,
  // pinch
  'pinch': true,
  'pinchstart': true,
  'pinchmove': true,
  'pinchend': true,
  'pinchcancel': true,
  'pinchin': true,
  'pinchout': true,
  // press
  'press': true,
  'pressup': true,
  // rotate
  'rotate': true,
  'rotatestart': true,
  'rotatemove': true,
  'rotateend': true,
  'rotatecancel': true,
  // swipe
  'swipe': true,
  'swipeleft': true,
  'swiperight': true,
  'swipeup': true,
  'swipedown': true,
  // tap
  'tap': true,
};

export class Hammer {
  static supports(eventName: string): boolean {
    eventName = eventName.toLowerCase();
    return _eventNames.hasOwnProperty(eventName);
  }

  static create(element: any, eventName: string, handler: Function) {
    var mc = new hammer(element, {inputClass: NativeInput, cssProps: {}});
    mc.on(eventName, function(eventObj) { handler(eventObj); });
  }
}

var TOUCH_INPUT_MAP = {
  topTouchStart: hammer.INPUT_START,
  topTouchMove: hammer.INPUT_MOVE,
  topTouchEnd: hammer.INPUT_END,
  topTouchCancel: hammer.INPUT_CANCEL
};

var NATIVE_TARGET_EVENTS = 'topTouchStart topTouchMove topTouchEnd topTouchCancel';

function NativeInput() {
  this.evTarget = NATIVE_TARGET_EVENTS;
  this.targetIds = {};

  hammer.Input.apply(this, arguments);
}

hammer.inherit(NativeInput, hammer.Input, {
  handler: function NEhandler(event) {
    var type = TOUCH_INPUT_MAP[event.type];
    var touches = getTouches.call(this, event, type);
    if (!touches) {
      return;
    }

    this.callback(this.manager, type, {
      pointers: touches[0],
      changedPointers: touches[1],
      pointerType: 'touch',
      srcEvent: event
    });
  }
});

function getTouches(event: any, type: string) {
  return [[event], [event]];
}