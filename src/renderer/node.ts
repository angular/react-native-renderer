import {ReactNativeWrapper} from './../wrapper/wrapper';
import {NgZone, Injector} from 'angular2/core';
import {Hammer} from './../events/hammer';
import {SelectorMatcher, CssSelector} from 'angular2/src/compiler/selector';

export var nodeMap: Map<number, Node> = new Map<number, Node>();

export abstract class Node {
  public parent: Node;
  public children: Node[] = [];
  public tagName: string = "";
  public properties: {[s: string]: any } = {};
  public isVirtual: boolean = false;
  public toBeDestroyed: boolean = false;
  public toBeMoved: boolean = false;
  public isDestroyed: boolean = false;

  public nativeTag: number = -1;
  public isCreated: boolean = false;
  public nativeChildren: Array<number> = [];

  public eventListeners: Map<string, Array<Function>> = new Map<string, Array<Function>>();
  public _hammer: any = null;

  constructor(public rnWrapper: ReactNativeWrapper, public zone: NgZone) {}

  attachTo(parent: Node): void {
    if (parent) {
      parent.children.push(this);
      this.parent = parent;
    }
  }
  attachToAt(parent: Node, index: number): void {
    if (parent) {
      parent.children.splice(index, 0, this);
      this.parent = parent;
    }
  }

  getInsertionNativeIndex(): number {
    var nativeIndex = -1;
    var ancestor = this.getAncestorWithNativeCreated();
    if (ancestor) {
      var childrenOfAncestor: Node = this;
      while (childrenOfAncestor.parent != ancestor) {
        childrenOfAncestor = childrenOfAncestor.parent;
      }
      var index = ancestor.children.indexOf(childrenOfAncestor);
      var count = index;
      while (count >= 0) {
        var prev = ancestor.children[count];
        if (prev.nativeTag > -1) {
          nativeIndex = ancestor.nativeChildren.indexOf(prev.nativeTag);
          count = 0;
        } else if (prev.isVirtual) {
          var nativeChild = prev.getFirstCreatedChild();
          if (nativeChild) {
            nativeIndex = ancestor.nativeChildren.indexOf(nativeChild.nativeTag);
            if (nativeIndex > -1) {
              count = 0;
            }
          }
        }
        count--;
      }
    }
    return nativeIndex + 1;
  }

  getAncestorWithNativeCreated(): Node {
    var next = this.parent;
    while (next && !next.isCreated) {
      next = next.parent
    }
    return next;
  }

  getAncestorDestroyed(): Node {
    var next = this.parent;
    while (next && !next.isDestroyed) {
      next = next.parent
    }
    return next;
  }

  getFirstCreatedChild() : Node {
    var result: Node = null
    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      if (child.isCreated) {
        result = child;
        break;
      }
    }
    return result;
  }

  isTextContainer(): boolean {
    return this.tagName == 'native-text' || this.tagName == 'VirtualText';
  }

  isImageContainer(): boolean {
    return this.tagName == 'native-image';
  }

  overrideTagName(ancestor: Node): string {
    var tagName = this.tagName;
    if (this.isTextContainer() && ancestor.isTextContainer()) {
      tagName = 'native-virtualtext';
    } else if (this.isImageContainer() && ancestor.isTextContainer()) {
      tagName = 'native-inlineimage';
    } else if (tagName == 'native-scrollview' && this.properties['horizontal'] && this.rnWrapper.isAndroid()) {
      tagName = 'native-horizontalscrollview';
    } else if (tagName == 'native-textinput' && this.properties['multiline'] && !this.rnWrapper.isAndroid()) {
      tagName = 'native-textarea';
    }
    return tagName;
  }

  destroyNative() {
    this.isDestroyed = true;
    this.isCreated = false;
    nodeMap.delete(this.nativeTag);
    this.nativeTag = -1;
    this.nativeChildren = [];
    this.toBeDestroyed = this.toBeMoved = false;
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].destroyNative();
    }
  }

  setProperty(name: string, value: any, updateNative: boolean = true) {
    this.properties[name] = value;
    if (updateNative && this.nativeTag > -1) {
      var prop: any = {};
      prop[name] = value;
      this.rnWrapper.updateView(this.nativeTag, this.tagName, prop);
    }
  }

  setProperties(properties:  {[s: string]: any }) {
    for (var propName in properties) {
      this.properties[propName] = properties[propName];
    }
    this.rnWrapper.updateView(this.nativeTag, this.tagName, properties);
  }

  addEventListener(eventName: string, handler: Function) {
    if (!Hammer.supports(eventName)) {
      if (!this.eventListeners.has(eventName)) {
        this.eventListeners.set(eventName, []);
      }
      var handlers = this.eventListeners.get(eventName);
      handlers.push(handler);
      this.eventListeners.set(eventName, handlers);
    }
    else {
      if (this._hammer == null) {
        this._hammer = Hammer.create(this);
      }
      Hammer.add(this._hammer, eventName, handler);
    }
  }

  removeEventListener(eventName: string, handler: Function) {
    if (!Hammer.supports(eventName)) {
      var handlers = this.eventListeners.get(eventName);
      if (handlers) {
        var index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
          this.eventListeners.set(eventName, handlers);
        }
      }
    } else {
      this._hammer = Hammer.remove(this._hammer, eventName, handler);
    }
  }

  fireEvent(name: string, event: any) {
    event.currentTarget = this;
    var handlers = this.eventListeners.get(name);
    if (handlers) {
      handlers.forEach((handler) => {
        this.zone.run(() => handler(event));
      });
    }
    if (this.parent && !event._stop) {
      this.parent.fireEvent(name, event);
    }
  }

  //TODO: generalize this TextInput specific code
  focus() {
    if (this.rnWrapper.isAndroid()) {
      this.rnWrapper.dispatchCommand(this.nativeTag, 'focusTextInput', null);
    } else {
      this.rnWrapper.focus(this.nativeTag);
    }

  }
  blur() {
    if (this.rnWrapper.isAndroid()) {
      this.rnWrapper.dispatchCommand(this.nativeTag, 'blurTextInput', null);
    } else {
      this.rnWrapper.blur(this.nativeTag);
    }
  }

  dispatchCommand(command: string, params: any = null) {
    this.rnWrapper.dispatchCommand(this.nativeTag, command, params);
  }

  getElementByTestId(testId: string): Node {
    return this.querySelector('#' + testId);
  }

  querySelectorAll(selector: string): Array<Node> {
    var res: Array<Node> = [];
    var _recursive = (result: Array<Node>, node: Node, selector: string, matcher: SelectorMatcher) => {
      var cNodes = node.children;
      if (cNodes && cNodes.length > 0) {
        for (var i = 0; i < cNodes.length; i++) {
          var childNode = cNodes[i];
          if (childNode.isVirtual && this._elementMatches(childNode, selector, matcher)) {
            result.push(childNode);
          }
          _recursive(result, childNode, selector, matcher);
        }
      }
    };
    var matcher = new SelectorMatcher();
    matcher.addSelectables(CssSelector.parse(selector));
    _recursive(res, this, selector, matcher);
    return res;
  }

  querySelector(selector: string): Node {
    return this.querySelectorAll(selector)[0];
  }

  private _elementMatches(node: Node, selector: string, matcher: SelectorMatcher = null): boolean {
    if (selector === '*') {
      return true;
    }
    var result = false;
    if (selector && selector.charAt(0) == "#") {
      result = node.properties['testID'] == selector.substring(1);
    } else if (selector) {
      var result = false;
      if (matcher == null) {
        matcher = new SelectorMatcher();
        matcher.addSelectables(CssSelector.parse(selector));
      }

      var cssSelector = new CssSelector();
      cssSelector.setElement(node.tagName);
      if (node.properties) {
        for (var propName in node.properties) {
          cssSelector.addAttribute(propName, node.properties[propName]);
        }
      }

      matcher.match(cssSelector, function(selector: CssSelector, cb: any) { result = true; });
    }
    return result;
  }
}

export class ElementNode extends Node {
  constructor(public tagName: string, wrapper: ReactNativeWrapper, zone: NgZone) {
    super(wrapper, zone);
    //TODO: generalize the mechanism (list? regexp? meta data?)
    if (['dummy-anchor-for-dynamic-loader', 'View', 'Text', 'Switch', 'TextInput', 'WebView', 'Image', 'ProgressBar', 'PagerLayout', 'Picker', 'ScrollView',
        'DrawerLayout', 'DrawerLayoutSide', 'DrawerLayoutContent', 'RefreshControl', 'Toolbar',
        'ActivityIndicator', 'DatePicker', 'MapView', 'Navigator', 'NavigatorItem', 'ProgressView', 'SegmentedControl', 'Slider', 'TabBar', 'TabBarItem'].indexOf(tagName) > -1) {
      this.isVirtual = true;
    }
  }
}

export class TextNode extends Node {
  constructor(value: string, wrapper: ReactNativeWrapper, zone: NgZone) {
    super(wrapper, zone);
    this.tagName = 'native-rawtext';
    this.setText(value);
  }

  setText(text: string): string {
    var trimmedText = text ? text.trim() : '';
    this.setProperty('text', trimmedText, false);
    return trimmedText;
  }
}

export class AnchorNode extends Node {
  constructor(wrapper: ReactNativeWrapper, zone: NgZone) { super(wrapper, zone); this.isVirtual = true;}
}
