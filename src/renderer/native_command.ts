import {Node, TextNode, nodeMap} from './node';
import {ReactNativeWrapper} from './../wrapper/wrapper';

export abstract class NativeCommand {
  constructor(public target: Node) {}
  execute(wrapper: ReactNativeWrapper) {}

  manageStyleProp(wrapper: ReactNativeWrapper, props: {[s: string]: any }): {[s: string]: any } {
    var styles: Array<any> = [];
    styles = styles.concat(this._toArray(props['styleSheet']));
    styles = styles.concat(this._toArray(props['style']));
    if (styles.length > 0) {
      var computedStyle: { [s: string]: any } = {};
      try {
        computedStyle = wrapper.computeStyle(styles);
      } catch (e) {
        console.error(e);
      }
      for (var key in computedStyle) {
        props[key] = computedStyle[key];
      }
      delete props['styleSheet'];
      delete props['style'];
    }
    return props;
  }

  _toArray(obj: any) {
    var result: Array<any> = [];
    if (Array.isArray(obj)) {
      result = obj;
    } else if (obj) {
      result = [obj];
    }
    return result;
  }
}

export class NativeCommandCreate extends NativeCommand {
  public props: {[s: string]: any } = {};
  constructor(public target:Node) {
    super(target);
  }

  execute(wrapper: ReactNativeWrapper) {
    var props = this.target.properties;
    for (var attrName in this.props) {
      props[attrName] = this.props[attrName];
    }
    var ancestor = this.target.getAncestorWithNativeCreated();
    var toBeCreated = false;
    if (!(this.target instanceof TextNode)) {
      toBeCreated = true;
    } else {
      toBeCreated = ancestor.isTextContainer();
    }
    if (toBeCreated) {
      var tagName = this.target.overrideTagName(ancestor);
      this.target.nativeTag = wrapper.createView(tagName, 1, this.manageStyleProp(wrapper, props));
      nodeMap.set(this.target.nativeTag, this.target);
    } else {
      this.target.isVirtual = true;
      this.target.isCreated = false;
    }

  }
}

export class NativeCommandUpdate extends NativeCommand {
  public props: {[s: string]: any } = {};
  constructor(public target: Node, public key: string, public value: any) {
    super(target);
    this.props[key] = value;
  }

  execute(wrapper: ReactNativeWrapper) {
    var ancestor = this.target.getAncestorWithNativeCreated();
    var tagName = this.target.overrideTagName(ancestor);
    wrapper.updateView(this.target.nativeTag, tagName, this.manageStyleProp(wrapper, this.props));
  }
}

export class NativeCommandAttach extends NativeCommand {
  constructor(public target: Node, public toRoot: boolean) {
    super(target);
  }

  execute(wrapper: ReactNativeWrapper) {
    if (this.toRoot) {
      wrapper.manageChildren(1, null, null, [this.target.nativeTag], [0], null);
    } else {
      var parent = this.target.parent;
      if (parent && this.target.isCreated && !this.target.isVirtual) {
        var ancestor = this.target.getAncestorWithNativeCreated();
        if (ancestor) {
          wrapper.manageChildren(ancestor.nativeTag, null, null, [this.target.nativeTag], [ancestor.nativeChildren.length], null);
          ancestor.nativeChildren.push(this.target.nativeTag);
        }
      }
    }
  }
}

export class NativeCommandAttachAfter extends NativeCommand {
  constructor(public target: Node, public anchor: Node) {
    super(target);
  }

  executeWithCounters(wrapper: ReactNativeWrapper, counters: Map<Node, number>) {
    var parent = this.target.parent;
    if (parent && this.target.isCreated && !this.target.isVirtual) {
      var ancestor = this.target.getAncestorWithNativeCreated();
      if (ancestor) {
        var shift = counters.get(this.anchor) || 0;
        var nativeIndex = this.anchor.getInsertionNativeIndex() + shift;
        wrapper.manageChildren(ancestor.nativeTag, null, null, [this.target.nativeTag], [nativeIndex], null);
        ancestor.nativeChildren.splice(nativeIndex, 0, this.target.nativeTag);
        counters.set(this.anchor, shift + 1);
      }
    }
  }
}

export class NativeCommandDetach extends NativeCommand {
  constructor(public target: Node) {
    super(target);
  }

  execute(wrapper: ReactNativeWrapper) {
    var parent = this.target.parent;
    var index = parent.children.indexOf(this.target);
    parent.children.splice(index, 1);
    var toDetach = this.target.nativeTag > -1 ? this.target : (this.target.isVirtual ? this.target.getFirstCreatedChild() : null);
    if (toDetach) {
      var nativeIndex = parent.nativeChildren.indexOf(toDetach.nativeTag);
      parent.nativeChildren.splice(nativeIndex, 1);
      wrapper.manageChildren(parent.nativeTag, null, null, null, null, [nativeIndex]);
      toDetach.destroyNative();
    }
  }
}