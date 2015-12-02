import {RCT_VIEW_NAMES, RCT_PROPERTY_NAMES} from './reference';
import {NativeModules} from 'react-native';
var ReactNativeTagHandles = require('ReactNativeTagHandles');
var ReactNativeAttributePayload = require('ReactNativeAttributePayload');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');

export var nodeMap: Map<number, Node> = new Map<number, Node>();

export abstract class Node {
  public parent: Node;
  public children: Node[] = [];
  public nativeChildren: Array<number> = [];
  listenerCallback = (name, event) => {};

  public tag: string = "";
  public attribs: Object = {};
  public nativeTag: number = -1;
  public viewName: string = RCT_VIEW_NAMES['view'];
  private _created: boolean = false;

  createNative() {
    if (!this._created) {
      this.nativeTag = ReactNativeTagHandles.allocateTag();
      if (this instanceof ElementNode && RCT_VIEW_NAMES[this.tag] != undefined){
        this.viewName = RCT_VIEW_NAMES[this.tag];
      }
      console.log(`Creating a ${this.viewName} with tag ${this.nativeTag} and attribs:`, this._buildProps());
      NativeModules.UIManager.createView(this.nativeTag, this.viewName, 1, this._buildProps());
      this._created = true;
      nodeMap.set(this.nativeTag, this);
    }
  }

  createNativeRecursively() {
    if (!this._created) {
      this.createNative();
      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        child instanceof TextNode ? child.createNativeText() : child.createNative();
        child.attachToParent();
      }
    }
  }

  attachToParent() {
    if (this.nativeTag > -1) {
      var parent = this.parent;
      console.log(`Attaching to ${parent.nativeTag}: ${this.nativeTag} at ${parent.nativeChildren.length}`);
      NativeModules.UIManager.manageChildren(parent.nativeTag, null, null, [this.nativeTag], [parent.nativeChildren.length], null);
      parent.nativeChildren.push(this.nativeTag);
    }
  }

  insertAfter(nodes: Array<Node>) {
    if (nodes.length > 0 && this.parent) {
      var index = this.parent.children.indexOf(this);
      var nativeIndex = -1;
      var nativeInsertedCount = 0;
      var count = index;
      while (count >= 0) {
        var prev = this.parent.children[count];
        if (prev.nativeTag > -1) {
          nativeIndex = this.parent.nativeChildren.indexOf(prev.nativeTag);
          count = 0;
        }
        count--;
      }
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.createNativeRecursively();
        this.parent.children.splice(index + i + 1, 0, node);
        node.parent = this.parent;
        if (node.nativeTag > -1) {
          console.log(`Attaching to ${node.parent.nativeTag}: ${node.nativeTag} at ${nativeIndex + nativeInsertedCount + 1}`);
          NativeModules.UIManager.manageChildren(node.parent.nativeTag, null, null, [node.nativeTag], [nativeIndex + nativeInsertedCount + 1], null);
          node.parent.nativeChildren.splice(nativeIndex + nativeInsertedCount + 1, 0, node.nativeTag);
          nativeInsertedCount++;
        }
      }
    }
  }

  detach() {
    var index = this.parent.children.indexOf(this);
    this.parent.children.splice(index, 1);
    if (this.nativeTag > -1) {
      var nativeIndex = this.parent.nativeChildren.indexOf(this.nativeTag);
      this.parent.nativeChildren.splice(nativeIndex, 1);
      console.log(`Removing from ${this.parent.nativeTag}: ${this.nativeTag} at ${nativeIndex}`)
      NativeModules.UIManager.manageChildren(this.parent.nativeTag, null, null, null, null, [nativeIndex]);
      this._destroyNative();
    }
  }

  _destroyNative() {
    this._created = false;
    nodeMap.delete(this.nativeTag);
    this.nativeTag = -1;
    this.nativeChildren = [];
    this.listenerCallback = (name, event) => {};
    for (var i = 0; i < this.children.length; i++) {
      this.children[i]._destroyNative();
    }
  }

  setProperty(name: string, value: any) {
    this.attribs[RCT_PROPERTY_NAMES[name] || name] = value;
    console.log(`Updating property ${name} in ${this.nativeTag} to`, this._buildProps());
    NativeModules.UIManager.updateView(this.nativeTag, this.viewName, this._buildProps());
  }

  _buildProps(): Object {
    if (this.attribs.hasOwnProperty('style')) {
      var computedStyle = {};
      try {
        computedStyle = ReactNativeAttributePayload.create({style: this.attribs['style']}, ReactNativeViewAttributes.RCTView);
      } catch (e) {
        console.error(e);
      }
      for (var key in computedStyle) {
        this.attribs[key] = computedStyle[key];
      }
      delete this.attribs['style'];
    }
    return this.attribs;
  }

  setEventListener(listener) {
    this.listenerCallback = listener;
  }

  fireEvent(name, event) {
    this.listenerCallback(name, event);
  }

  //TODO: move this TextInput specific code
  focus() {
    //iOS: NativeModules.UIManager.focus(this.nativeTag);
    NativeModules.UIManager.dispatchViewManagerCommand(
      this.nativeTag,
      NativeModules.UIManager.AndroidTextInput.Commands.focusTextInput,
      null
    );
  }

  blur() {
    //iOS: NativeModules.UIManager.blur(this.nativeTag);
    NativeModules.UIManager.dispatchViewManagerCommand(
      this.nativeTag,
      NativeModules.UIManager.AndroidTextInput.Commands.blurTextInput,
      null
    );
  }
}

export class ComponentNode extends Node {
  private contentNodesByNgContentIndex: Node[][] = [];

  constructor(public tag: string, public isBound: boolean, _attribs: Object, public isRoot: boolean = false) {
    super();
    for (var i in _attribs) {
      this.attribs[RCT_PROPERTY_NAMES[i] || i] = _attribs[i];
    }
    this.createNative();
  }

  attachRoot() {
    console.log(`Attaching root ${this.nativeTag}`);
    NativeModules.UIManager.manageChildren(1, null, null, [this.nativeTag], [0], null);
  }

  addContentNode(ngContentIndex: number, node: Node) {
    while (this.contentNodesByNgContentIndex.length <= ngContentIndex) {
      this.contentNodesByNgContentIndex.push([]);
    }
    this.contentNodesByNgContentIndex[ngContentIndex].push(node);
  }

  project(ngContentIndex: number): Node[] {
    return ngContentIndex < this.contentNodesByNgContentIndex.length ?
      this.contentNodesByNgContentIndex[ngContentIndex] :
      [];
  }
}

export class ElementNode extends Node {
  constructor(public tag: string, public isBound: boolean, _attribs: Object) {
    super();
    for (var i in _attribs) {
      this.attribs[RCT_PROPERTY_NAMES[i] || i] = _attribs[i];
    }
    this.createNative();
  }
}

export class TextNode extends Node {
  constructor(public value: string,  public isBound: boolean) {
    super();
    this.createNativeText();
  }

  createNativeText() {
    if (this.isBound || !/^(\s|\r\n|\n|\r)+$/.test(this.value)) {
      this.attribs = {'text': this.isBound ? '' : this.value.trim()};
      this.viewName = 'RCTRawText';
      this.createNative();
    }
  }

  setText(text: string) {
    this.setProperty('text', text ? text.trim() : '');
  }
}

export class AnchorNode extends Node {
  constructor() { super();}
  createNative() {}
}