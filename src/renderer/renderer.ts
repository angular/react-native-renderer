import {
  RendererFactory2,
  Renderer2,
  RendererType2,
  RendererStyleFlags2,
  InjectionToken,
  Inject,
  Injectable,
  NgZone,
  Sanitizer,
  SecurityContext,
  AnimationPlayer,
  SchemaMetadata,
  Compiler
} from "@angular/core";
import {ElementSchemaRegistry} from "@angular/compiler";
import {Node, ElementNode, TextNode, nodeMap, CommentNode} from "./node";
import {ReactNativeWrapper} from "./../wrapper/wrapper";
import {
  NativeCommand,
  NativeCommandCreate,
  NativeCommandUpdate,
  NativeCommandAttach,
  NativeCommandDetach,
  NativeCommandAttachAfter
} from "./native_command";

export const REACT_NATIVE_WRAPPER: InjectionToken<string> = new InjectionToken("ReactNativeWrapper");

export class ReactNativeElementSchemaRegistry extends ElementSchemaRegistry {
  getDefaultComponentElementName(): string {
    return 'def-cpt';
  }
  hasProperty(tagName: string, propName: string): boolean {
    return true;
  }
  hasElement(tagName: string, schemaMetas: SchemaMetadata[]): boolean {
    return true;
  }
  getMappedPropName(propName: string): string {
    return propName;
  }
  securityContext(tagName: string, propName: string): any {
    return 0;
  }
  validateProperty(name: string): {error: boolean; msg?: string} {
    return {error: false};
  }
  validateAttribute(name: string): {error: boolean; msg?: string} {
    return {error: false};
  }
  allKnownElementNames(): string[] {
    return [];
  }
  normalizeAnimationStyleProperty(propName: string): string {
    return propName;
  }
  normalizeAnimationStyleValue(
    camelCaseProp: string, userProvidedProp: string,
    val: string|number): {error: string, value: string} {
      return {error: null, value: '' + val}
  }
}

export class ReactNativeSanitizer implements Sanitizer {
  sanitize(ctx: SecurityContext, value: any): string {
    return value;
  }
}

@Injectable()
export class ReactNativeRootRenderer implements RendererFactory2 {
  public zone: NgZone;
  public wrapper: ReactNativeWrapper;

  private _registeredComponents: Map<string, ReactNativeRenderer> = new Map<string, ReactNativeRenderer>();

  private _createCommands: Map<Node, NativeCommandCreate> = new Map<Node, NativeCommandCreate>();
  private _updateCommands: Map<Node, NativeCommandUpdate> = new Map<Node, NativeCommandUpdate>();
  private _attachCommands: Map<Node, NativeCommandAttach> = new Map<Node, NativeCommandAttach>();
  private _attachAfterCommands: Map<Node, NativeCommandAttachAfter> = new Map<Node, NativeCommandAttachAfter>();
  private _detachCommands: Map<Node, NativeCommandDetach> = new Map<Node, NativeCommandDetach>();

  constructor(@Inject(REACT_NATIVE_WRAPPER) _wrapper: ReactNativeWrapper) {
    this.wrapper = _wrapper;
    this.wrapper.patchReactNativeEventEmitter(nodeMap);
  }

  createRenderer(hostElement: any, type: RendererType2 | any): Renderer2 {
    return new ReactNativeRenderer(this);
  }

  addCreateCommand(node: Node, props: {[s: string]: any } = null) {
    var cmd = new NativeCommandCreate(node);
    if (props) {
      cmd.props = props;
    }
    this._createCommands.set(node, cmd);
  }

  addUpdateCommand(node: Node, key: string, value: any) {
    var propEater: NativeCommandCreate | NativeCommandUpdate =
      <NativeCommandCreate | NativeCommandUpdate>this._createCommands.get(node) || this._updateCommands.get(node);
    if (propEater) {
      propEater.props[key] = value;
    } else {
      this._updateCommands.set(node, new NativeCommandUpdate(node, key, value));
    }
  }

  addAttachCommand(node: Node, toRoot: boolean) {
    this._attachCommands.set(node, new NativeCommandAttach(node, toRoot));
  }

  addAttachAfterCommand(node: Node, anchor: Node) {
    this._attachAfterCommands.set(node, new NativeCommandAttachAfter(node, anchor));
  }

  addDetachCommand(node: Node) {
    this._detachCommands.set(node, new NativeCommandDetach(node));
  }

  executeCommands(): void {
    this._detachCommands.forEach((command: NativeCommandDetach) => command.execute(this.wrapper));
    this._createCommands.forEach((command: NativeCommandCreate) => command.execute(this.wrapper));
    this._updateCommands.forEach((command: NativeCommandUpdate) => command.execute(this.wrapper));
    this._attachCommands.forEach((command: NativeCommandAttach) => command.execute(this.wrapper));
    var counters: Map<Node,number> = new Map<Node, number>();
    this._attachAfterCommands.forEach((command: NativeCommandAttachAfter) => command.executeWithCounters(this.wrapper, counters));
    counters.clear();
    NativeCommand.mergeAndApply(this.wrapper);

    this._detachCommands.clear();
    this._createCommands.clear();
    this._updateCommands.clear();
    this._attachCommands.clear();
    this._attachAfterCommands.clear();
  }
}

export class ReactNativeRenderer implements Renderer2 {
  data: {[key: string]: any;} = {};

  constructor(private _rootRenderer: ReactNativeRootRenderer) {}

  selectRootElement(selector: string): Node {
    const root = this.createElement(selector.startsWith('#root') ? 'test-cmp' : selector);
    this._createElementCommand(root);
    this._rootRenderer.addAttachCommand(root, true);
    return root;
  }

  createElement(name: string, namespace?: string | any): Node {
    //console.log('createElement:' + name);
    return new ElementNode(name, this._rootRenderer.wrapper, this._rootRenderer);
  }

  createComment(value: string): any {
    return new CommentNode(this._rootRenderer.wrapper, this._rootRenderer);
  }

  createText(value: string): Node {
    //console.log('createText:' + value);
    return new TextNode(value, this._rootRenderer.wrapper, this._rootRenderer);
  }

  destroyNode(node: Node): any {
    node.toBeDestroyed = true;
  }

  destroy(): void {
    //console.log('NOT IMPLEMENTED: destroy', arguments);
  }

  appendChild(parent: Node, newChild: Node): void {
    //console.log('appendChild');
    newChild.attachTo(parent);
    if (newChild.getAncestorWithNativeCreated()) {
      if (this._createNativeRecursively(newChild)) {
        this._rootRenderer.addAttachCommand(newChild, false);
      }
    }
  }

  insertBefore(parent: any, newChild: any, refChild: any): void {
    //console.log('insertBefore');
    const index = parent.children.indexOf(refChild);
    newChild.attachToAt(parent, index);
    if (newChild.getAncestorWithNativeCreated()) {
      if (this._createNativeRecursively(newChild)) {
        this._rootRenderer.addAttachCommand(newChild, false);
      }
    }
  }

  removeChild(parent: any, oldChild: any): void {
    const index = parent.children.indexOf(oldChild);
    parent.children.splice(index, 1);
    this._rootRenderer.addDetachCommand(oldChild);
  }

  parentNode(node: Node): Node {
    return node.parent;
  }

  nextSibling(node: Node): any {
    let res = null;
    const parent = node.parent;
    if (parent) {
      const index = parent.children.indexOf(node) + 1;
      if (parent.children.length > index) {
        res = parent.children[index];
      }
    }
    return res;
  }

  setAttribute(el: Node, name: string, value: string, namespace?: string | any): void {
    var val: any = value;
    if (name == "ng-version") return;
    if (value == "false") val = false;
    if (value == "true") val = true;
    if (value == "null") val = null;
    if (!isNaN(parseInt(val))) val = parseInt(val);
    if (value.startsWith('#')) val = this._rootRenderer.wrapper.processColor(value);
    this.setProperty(el, name, val);
  }

  removeAttribute(el: any, name: string, namespace?: string | any): void {
  }

  addClass(el: any, name: string): void {
    console.error('NOT IMPLEMENTED: addClass', arguments);
  }

  removeClass(el: any, name: string): void {
    console.error('NOT IMPLEMENTED: removeClass', arguments);
  }

  setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void {
    console.error('NOT IMPLEMENTED: setStyle', arguments);
  }

  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    console.error('NOT IMPLEMENTED: removeStyle', arguments);
  }

  setProperty(el: Node, name: string, value: any): void {
    if (typeof value !== 'undefined') {
      const cleanPropertyName = name.startsWith('_on') ? name.substr(1) : name;
      el.setProperty(cleanPropertyName, value, false);
      if (el.isCreated) {
        this._rootRenderer.addUpdateCommand(el, cleanPropertyName, value);
      }
    }
  }

  setValue(node: Node, value: string): void {
    if (node instanceof TextNode) {
      const trimedText = node.setText(value);
      this.setProperty(node, 'text', trimedText);
    }
  }

  listen(target: 'window' | 'document' | 'body' | Node, eventName: string, callback: (event: any) => boolean | void): () => void {
    if (target === 'window' || target == 'document' || target == 'body') {
      console.error('NOT IMPLEMENTED: listen on ' + target, arguments);
      return () => {};
    } else {
      target.addEventListener(eventName, callback);
      return () => {target.removeEventListener(eventName, callback);};
    }

  }

  private _createElementCommand(node: Node): void {
    this._rootRenderer.addCreateCommand(node);
    node.isCreated = true;
  }

  private _createTextCommand(node: TextNode): void {
    this._rootRenderer.addCreateCommand(node, {text: node.properties['text']});
    var cmd = new NativeCommandCreate(node);
    node.isCreated = true;
  }

  private _createNativeRecursively(node: Node, isRoot: boolean = true): boolean {
    var didCreate: boolean = false;
    if (!node.isCreated) {
      if (!node.isVirtual) {
        node instanceof TextNode ? this._createTextCommand(node) : this._createElementCommand(node);
        didCreate = !(node instanceof TextNode) || isRoot;
      }
      for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        didCreate = this._createNativeRecursively(child, false) || didCreate;
        if (!child.isVirtual && !(isRoot && node.isVirtual)) {
          this._rootRenderer.addAttachCommand(child, false);
        }
      }
    }
    return didCreate;
  }
}