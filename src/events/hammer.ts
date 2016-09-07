declare var global: any;
declare var require: any;

if (typeof global.window === "undefined") global.window = global;
if (typeof global.document === "undefined") global.document = {createElement: () => {return {style: {}};}};
var hammer = (typeof global.window.Hammer === "undefined") ? require('hammerjs') : global.window.Hammer;

var EVENT_RECOGNIZER_MAP: {[s: string]: string } = {
  //doubletap
  'doubletap': 'doubletap',
  // pan
  'pan': 'pan',
  'panstart': 'pan',
  'panmove': 'pan',
  'panend': 'pan',
  'pancancel': 'pan',
  'panleft': 'pan',
  'panright': 'pan',
  'panup': 'pan',
  'pandown': 'pan',
  // pinch
  'pinch': 'pinch',
  'pinchstart': 'pinch',
  'pinchmove': 'pinch',
  'pinchend': 'pinch',
  'pinchcancel': 'pinch',
  'pinchin': 'pinch',
  'pinchout': 'pinch',
  // press
  'press': 'press',
  'pressup': 'press',
  // rotate
  'rotate': 'rotate',
  'rotatestart': 'rotate',
  'rotatemove': 'rotate',
  'rotateend': 'rotate',
  'rotatecancel': 'rotate',
  // swipe
  'swipe': 'swipe',
  'swipeleft': 'swipe',
  'swiperight': 'swipe',
  'swipeup': 'swipe',
  'swipedown': 'swipe',
  // tap
  'tap': 'tap',
  'tapstart': 'tap',
  'tapcancel': 'tap'
};

export class Hammer {
  static supports(eventName: string): boolean {
    eventName = eventName.toLowerCase();
    return EVENT_RECOGNIZER_MAP.hasOwnProperty(eventName);
  }

  static create(element: any): any {
    return new hammer(element, {inputClass: NativeInput, cssProps: {}, recognizers: []});
  }

  static add(hammerInstance: any, eventName: string, handler: Function) {
    var recognizerName = EVENT_RECOGNIZER_MAP[eventName];
    var recognizer = hammerInstance.get(recognizerName);
    if (recognizer == null) {
      switch (recognizerName) {
        case 'doubletap':
          var doubletap = recognizer = new hammer.Tap({event: 'doubletap', taps: 2, time: Infinity});
          hammerInstance.add(doubletap);
          break;
        case 'tap':
          var tap = recognizer = new NativeTapRecognizer();
          hammerInstance.add(tap);
          for (var i = 0; i < hammerInstance.recognizers.length; i++) {
            hammerInstance.recognizers[i].recognizeWith(tap);
          }
          break;
        case 'pan':
          var pan = recognizer = new hammer.Pan({direction: hammer.DIRECTION_ALL});
          hammerInstance.add(pan);
          var swipe = hammerInstance.get('swipe');
          if (swipe) {
            pan.recognizeWith(swipe);
          }
          break;
        case 'swipe':
          var swipe = recognizer = new hammer.Swipe({direction: hammer.DIRECTION_ALL});
          hammerInstance.add(swipe);
          var pan = hammerInstance.get('pan');
          if (pan) {
            pan.recognizeWith(swipe);
          }
          break;
        case 'press':
          var press = recognizer = new hammer.Press();
          hammerInstance.add(press);
          var tap = hammerInstance.get('tap');
          if (tap) {
            press.recognizeWith(tap);
          }
          break;
        case 'pinch':
          var pinch = recognizer = new hammer.Pinch();
          hammerInstance.add(pinch);
          var rotate = hammerInstance.get('rotate');
          if (rotate) {
            pinch.recognizeWith(rotate);
          }
          break;
        case 'rotate':
          var rotate = recognizer = new hammer.Rotate();
          hammerInstance.add(rotate);
          var pinch = hammerInstance.get('pinch');
          if (pinch) {
            pinch.recognizeWith(rotate);
          }
          break;
        default:
          break;
      }
    }
    var tap = hammerInstance.get('tap');
    if (tap) {
      recognizer.recognizeWith(tap);
    }
    hammerInstance.on(eventName, (eventObj: any) => { handler(eventObj); });
    if (typeof recognizer._events == 'undefined') {
      recognizer._events = new Map();
    }
    recognizer._events.set(eventName, true);
  }

  static remove(hammerInstance: any, eventName: string, handler: Function) {
    hammerInstance.off(eventName, (eventObj: any) => { handler(eventObj); });
    var recognizer = hammerInstance.get(EVENT_RECOGNIZER_MAP[eventName]);
    var toBeDeleted = true;
    recognizer._events.forEach((value: any, key: any) => {
      toBeDeleted = toBeDeleted && hammerInstance.handlers[key].length == 0;
    });
    if (toBeDeleted) {
      hammerInstance.remove(recognizer);
      if (hammerInstance.recognizers.length == 0) {
        hammerInstance.destroy();
        hammerInstance = null;
      }
    }
    return hammerInstance;
  }
}

var NATIVE_INPUT_MAP: {[s: string]: any } = {
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
  handler: function NEhandler(event: any) {
    var type = NATIVE_INPUT_MAP[event.type];
    var touches = getTouches.call(this, event, type);
    if (!touches) {
      return;
    }
    var newEvent: {[s: string]: any } = {
      pointers: touches[0],
      changedPointers: touches[1],
      pointerType: 'touch',
      srcEvent: event
    };
    newEvent['stopPropagation'] = () => {newEvent['srcEvent'].stopPropagation()};
    this.callback(this.manager, type, newEvent);
  }
});

function getTouches(event: any, type: string) {
  if (event.touches == undefined || event.touches.length == 1) {
    return [[event], [event]];
  } else {
    var changedTouches: any[] = [];
    for (var i = 0; i < event.changedIndices.length; i++) {
      changedTouches.push(event.touches[event.changedIndices[i]]);
    }
    return [event.touches, changedTouches];
  }
}

function NativeTapRecognizer() {
  hammer.Recognizer.apply(this, arguments);
  this.alreadyCancelled = false;
}

hammer.inherit(NativeTapRecognizer, hammer.Recognizer, {
  defaults: {
    event: 'tap',
    pointers: 1,
    threshold: 9
  },

  getTouchAction: function() {
    return [hammer.TOUCH_ACTION_MANIPULATION];
  },

  process: function(input: any) {
    var options = this.options;

    var validPointers = input.pointers.length === options.pointers;
    var validMovement = input.distance < options.threshold;

    if ((input.eventType & hammer.INPUT_START)) {
      this.alreadyCancelled = false;
      return hammer.STATE_BEGAN;
    }

    if (validMovement && validPointers) {
      if (input.eventType != hammer.INPUT_END) {
        return hammer.STATE_FAILED;
      }

      return hammer.STATE_RECOGNIZED;
    }

    var res = this.alreadyCancelled ? hammer.STATE_FAILED : hammer.STATE_CANCELLED;
    this.alreadyCancelled = true;
    return res;
  },

  emit: function(input: any) {
    if (this.state == hammer.STATE_RECOGNIZED) {
      this.manager.emit(this.options.event, input);
    } else if (this.state == hammer.STATE_BEGAN) {
      this.manager.emit(this.options.event + 'start', input);
    } else if (this.state == hammer.STATE_CANCELLED) {
      this.manager.emit(this.options.event + 'cancel', input);
    }
  }
});