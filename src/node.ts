import {ReactNativeWrapper} from './wrapper';

export var nodeMap: Map<number, Node> = new Map<number, Node>();

export abstract class Node {
  public parent: Node;
  public children: Node[] = [];
  public nativeChildren: Array<number> = [];
  listenerCallback = (name: string, event: any) => {};

  public tagName: string = "";
  public properties: {[s: string]: any } = {};

  public nativeTag: number = -1;
  private _created: boolean = false;
  public rnWrapper: ReactNativeWrapper = null;

  constructor(wrapper: ReactNativeWrapper) {
    this.rnWrapper = wrapper;
  }

  createNative() {
    if (!this._created) {
      this.nativeTag = this.rnWrapper.createView(this.tagName, 1, this._buildProps());
      this._created = true;
      nodeMap.set(this.nativeTag, this);
    }
  }

  createNativeRecursively() {
    if (!this._created) {
      this instanceof TextNode ? (<TextNode>this).createNativeText() : this.createNative();
      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        child.createNativeRecursively();
        child.attachToParent();
      }
    }
  }

  attachToParent() {
    if (this.nativeTag > -1) {
      var parent = this.parent;
      this.rnWrapper.$log(`Attaching to ${parent.nativeTag}: ${this.nativeTag} at ${parent.nativeChildren.length}`);
      this.rnWrapper.manageChildren(parent.nativeTag, null, null, [this.nativeTag], [parent.nativeChildren.length], null);
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
          this.rnWrapper.$log(`Attaching to ${node.parent.nativeTag}: ${node.nativeTag} at ${nativeIndex + nativeInsertedCount + 1}`);
          this.rnWrapper.manageChildren(node.parent.nativeTag, null, null, [node.nativeTag], [nativeIndex + nativeInsertedCount + 1], null);
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
      this.rnWrapper.$log(`Removing from ${this.parent.nativeTag}: ${this.nativeTag} at ${nativeIndex}`)
      this.rnWrapper.manageChildren(this.parent.nativeTag, null, null, null, null, [nativeIndex]);
      this._destroyNative();
    }
  }

  _destroyNative() {
    this._created = false;
    nodeMap.delete(this.nativeTag);
    this.nativeTag = -1;
    this.nativeChildren = [];
    for (var i = 0; i < this.children.length; i++) {
      this.children[i]._destroyNative();
    }
  }

  setProperty(name: string, value: any) {
    this.properties[name] = value;
    this.rnWrapper.updateView(this.nativeTag, this.tagName, this._buildProps());
  }

  _buildProps(): Object {
    if (this.properties.hasOwnProperty('style')) {
      var computedStyle: { [s: string]: any } = {};
      try {
        computedStyle = this.rnWrapper.computeStyle(this.properties['style']);
      } catch (e) {
        console.error(e);
      }
      for (var key in computedStyle) {
        this.properties[key] = computedStyle[key];
      }
      delete this.properties['style'];
    }
    return this.properties;
  }

  setEventListener(listener: (name: string, event: any) => void) {
    this.listenerCallback = listener;
  }

  fireEvent(name: string, event: any) {
    event.currentTarget = this;
    this.listenerCallback(name, event);
  }

  //TODO: generalize this TextInput specific code
  focus() {
    this.rnWrapper.dispatchCommand(this.nativeTag, 'focus');
  }
  blur() {
    this.rnWrapper.dispatchCommand(this.nativeTag, 'blur');
  }

  //For testing only
  public attribs: {[s: string]: any } = {};
  setAttribute(name: string, value: string): void {
    this.attribs[name] = value;
  }
  getAttribute(name: string): string {
    return this.attribs[name];
  }
}

export class ComponentNode extends Node {
  private contentNodesByNgContentIndex: Node[][] = [];

  constructor(public tagName: string, public isBound: boolean, _attribs: { [s: string]: string }, public isRoot: boolean, wrapper: ReactNativeWrapper) {
    super(wrapper);
    for (var i in _attribs) {
      this.properties[i] = _attribs[i];
    }
    this.createNative();
  }

  attachRoot() {
    this.rnWrapper.$log(`Attaching root ${this.nativeTag}`);
    this.rnWrapper.manageChildren(1, null, null, [this.nativeTag], [0], null);
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
  constructor(public tagName: string, public isBound: boolean, _attribs: { [s: string]: string }, wrapper: ReactNativeWrapper) {
    super(wrapper);
    for (var i in _attribs) {
      this.properties[i] = _attribs[i];
    }
    this.createNative();
  }
}

export class TextNode extends Node {
  constructor(public value: string,  public isBound: boolean, wrapper: ReactNativeWrapper) {
    super(wrapper);
    this.createNativeText();
  }

  createNativeText() {
    if (this.isBound || !/^(\s|\r\n|\n|\r)+$/.test(this.value)) {
      this.properties = {'text': this.value ? this.value.trim() : ''};
      this.tagName = 'RawText';
      this.createNative();
    }
  }

  setText(text: string) {
    this.value = text ? text.trim() : '';
    this.setProperty('text', this.value);
  }
}

export class AnchorNode extends Node {
  constructor(wrapper: ReactNativeWrapper) { super(wrapper);}
  createNative() {}
}