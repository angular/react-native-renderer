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

  static mergers : Map<Node, any> = new Map<Node, any>();

  static addToMergers(node: Node, moveTag: number, addTag: number, removeTag: number): void {
    var args = {moveTag: moveTag, addTag: addTag, removeTag: removeTag};
    if (!NativeCommand.mergers.has(node)) {
      NativeCommand.mergers.set(node, {initialState: node.nativeChildren.slice(0), commands: [args]});
    } else {
      NativeCommand.mergers.get(node).commands.push(args);
    }
  }

  static mergeAndApply(wrapper: ReactNativeWrapper) {
    NativeCommand.mergers.forEach((args: any, node: Node) => {
      var initialState = args.initialState;
      var finalState = node.nativeChildren;
      var moveFrom: Array<number> = [], moveTo: Array<number> = [], addTags: Array<number> = [], addAt: Array<number> = [], removeFrom: Array<number> = [];
      args.commands.forEach((cmd) => {
        if (cmd.moveTag) {
          moveFrom.push(initialState.indexOf(cmd.moveTag));
          moveTo.push(finalState.indexOf(cmd.moveTag));
        }
        if (cmd.addTag) {
          addTags.push(cmd.addTag);
          addAt.push(finalState.indexOf(cmd.addTag));
        }
        if (cmd.removeTag) {
          removeFrom.push(initialState.indexOf(cmd.removeTag));
        }
      });
      wrapper.manageChildren(node.nativeTag, moveFrom.length > 0 ? moveFrom : null, moveTo.length > 0 ? moveTo : null,
        addTags.length > 0 ? addTags : null, addAt.length > 0 ? addAt : null, removeFrom.length > 0 ? removeFrom : null);
      NativeCommand.mergers.delete(node);
    });
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
      if (this.target.parent) {
        var ancestor = this.target.getAncestorWithNativeCreated();
        if (ancestor) {
          if (this.target.isCreated && !this.target.isVirtual) {
            NativeCommand.addToMergers(ancestor, null, this.target.nativeTag, null);
            ancestor.nativeChildren.push(this.target.nativeTag);
          } else {
            this.target.children.forEach((child) => {
              if (child.isCreated && !child.isVirtual) {
                NativeCommand.addToMergers(ancestor, null, child.nativeTag, null);
                ancestor.nativeChildren.push(child.nativeTag);
              }
            });
          }
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
    if (this.target.parent) {
      var ancestor = this.target.getAncestorWithNativeCreated();
      if (ancestor) {
        var baseNativeIndex = this.anchor.getInsertionNativeIndex();
        if (this.target.isCreated && !this.target.isVirtual) {
          this._attach(wrapper, this.target, ancestor, counters, baseNativeIndex);
        } else {
          this.target.children.forEach((child) => {
            if (child.isCreated && !child.isVirtual) {
              this._attach(wrapper, child, ancestor, counters, baseNativeIndex);
            }
          });
        }
      }
    }
  }

  private _attach(wrapper: ReactNativeWrapper, node: Node, ancestor: Node, counters: Map<Node, number>, baseNativeIndex: number): void {
    var shift = counters.get(this.anchor) || 0;
    var nativeIndex = baseNativeIndex + shift;
    if (!node.toBeMoved) {
      NativeCommand.addToMergers(ancestor, null, node.nativeTag, null);
      ancestor.nativeChildren.splice(nativeIndex, 0, node.nativeTag);
    } else {
      var currentIndex = ancestor.nativeChildren.indexOf(node.nativeTag);
      if (currentIndex != nativeIndex) {
        NativeCommand.addToMergers(ancestor, node.nativeTag, null, null);
        ancestor.nativeChildren.splice(currentIndex, 1);
        ancestor.nativeChildren.splice(nativeIndex, 0, node.nativeTag);
      }
      node.toBeMoved = false;
    }
    counters.set(this.anchor, shift + 1);
  }
}

export class NativeCommandDetach extends NativeCommand {
  constructor(public target: Node) {
    super(target);
  }

  execute(wrapper: ReactNativeWrapper) {
    var parent = this.target.parent;
    var toDetach = this.target.nativeTag > -1 ? this.target : (this.target.isVirtual ? this.target.getFirstCreatedChild() : null);
    if (toDetach) {
      if (toDetach.toBeDestroyed) {
        var nativeIndex = parent.nativeChildren.indexOf(toDetach.nativeTag);
        NativeCommand.addToMergers(parent, null, null, toDetach.nativeTag);
        parent.nativeChildren.splice(nativeIndex, 1);
        toDetach.destroyNative();
      }
      else {
        //Node is being moved
        this.target.toBeMoved = true;
      }
    }
  }
}