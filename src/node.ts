import {RCT_VIEW_NAMES, RCT_PROPERTY_NAMES} from './reference';
import {NativeModules} from 'react-native';
var ReactNativeTagHandles = require('ReactNativeTagHandles');

export abstract class Node {
  public parent: Node;
  public children: Node[] = [];
  public nativeChildren: Array<number> = [];

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
      console.log(`Creating a ${this.viewName} with tag ${this.nativeTag} and attribs:`, this.attribs);
      NativeModules.UIManager.createView(this.nativeTag, this.viewName, 1, this.attribs);
      this._created = true;
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

  destroyNative() {
    this._created = false;
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].destroyNative();
    }
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
    if (!/^(\s|\r\n|\n|\r)+$/.test(value)) {
      this.attribs = {'text': value.trim()};
      this.viewName = 'RCTRawText';
      this.createNative();
    }
  }
}

export class AnchorNode extends Node {
  constructor() { super();}
}