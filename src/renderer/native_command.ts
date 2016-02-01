import {Node, nodeMap} from './node';
import {ReactNativeWrapper} from './../wrapper/wrapper';

export abstract class NativeCommand {
  constructor(public target: Node) {}
  execute(wrapper: ReactNativeWrapper) {}

  manageStyleProp(wrapper: ReactNativeWrapper, props: {[s: string]: any }): {[s: string]: any } {
    if (props.hasOwnProperty('style')) {
      var computedStyle: { [s: string]: any } = {};
      try {
        computedStyle = wrapper.computeStyle(props['style']);
      } catch (e) {
        console.error(e);
      }
      for (var key in computedStyle) {
        props[key] = computedStyle[key];
      }
      delete props['style'];
    }
    return props;
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
    this.target.nativeTag = wrapper.createView(this.target.tagName, 1, this.manageStyleProp(wrapper, props));
    nodeMap.set(this.target.nativeTag, this.target);
  }
}

export class NativeCommandUpdate extends NativeCommand {
  public props: {[s: string]: any } = {};
  constructor(public target: Node, public key: string, public value: any) {
    super(target);
    this.props[key] = value;
  }

  execute(wrapper: ReactNativeWrapper) {
    wrapper.updateView(this.target.nativeTag, this.target.tagName, this.manageStyleProp(wrapper, this.props));
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
      if (parent && this.target.isCreated) {
        wrapper.manageChildren(parent.nativeTag, null, null, [this.target.nativeTag], [parent.nativeChildren.length], null);
        parent.nativeChildren.push(this.target.nativeTag);
      }
    }
  }
}

export class NativeCommandAttachAfter extends NativeCommand {
  constructor(public target: Node, public anchor: Node, public shift: number = 0) {
    super(target);
  }

  execute(wrapper: ReactNativeWrapper) {
    var nativeIndex = this.anchor.getInsertionNativeIndex() + this.shift;
    var parent = this.target.parent;
    if (parent && this.target.isCreated) {
      wrapper.manageChildren(parent.nativeTag, null, null, [this.target.nativeTag], [nativeIndex], null);
      parent.nativeChildren.splice(nativeIndex, 0, this.target.nativeTag);
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
    if (this.target.nativeTag > -1) {
      var nativeIndex = parent.nativeChildren.indexOf(this.target.nativeTag);
      parent.nativeChildren.splice(nativeIndex, 1);
      wrapper.manageChildren(parent.nativeTag, null, null, null, null, [nativeIndex]);
      this.target.destroyNative();
    }
  }
}