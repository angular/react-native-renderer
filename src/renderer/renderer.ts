import {RootRenderer, Renderer, RenderComponentType, OpaqueToken, Inject, Injectable, NgZone} from '@angular/core';
import {ElementSchemaRegistry} from '@angular/compiler';
import {Node, ElementNode, AnchorNode, TextNode, nodeMap} from './node';
import {ReactNativeWrapper} from './../wrapper/wrapper';
import {NativeCommand, NativeCommandCreate, NativeCommandUpdate, NativeCommandAttach, NativeCommandDetach, NativeCommandAttachAfter} from "./native_command";

export const REACT_NATIVE_WRAPPER: OpaqueToken = new OpaqueToken("ReactNativeWrapper");

export class ReactNativeElementSchemaRegistry extends ElementSchemaRegistry {
  hasProperty(tagName: string, propName: string): boolean {
    return true;
  }
  getMappedPropName(propName: string): string {
    return propName;
  }
  securityContext(tagName: string, propName: string): any {
    return 0;
  }
}

export class ReactNativeRootRenderer implements RootRenderer {
  private _registeredComponents: Map<string, ReactNativeRenderer> = new Map<string, ReactNativeRenderer>();

  private _createCommands: Map<Node, NativeCommandCreate> = new Map<Node, NativeCommandCreate>();
  private _updateCommands: Map<Node, NativeCommandUpdate> = new Map<Node, NativeCommandUpdate>();
  private _attachCommands: Map<Node, NativeCommandAttach> = new Map<Node, NativeCommandAttach>();
  private _attachAfterCommands: Map<Node, NativeCommandAttachAfter> = new Map<Node, NativeCommandAttachAfter>();
  private _detachCommands: Map<Node, NativeCommandDetach> = new Map<Node, NativeCommandDetach>();

  constructor(public wrapper: ReactNativeWrapper, public zone: NgZone) {
    wrapper.patchReactNativeEventEmitter(nodeMap);
  }

  renderComponent(componentType: RenderComponentType): Renderer {
    var renderer = this._registeredComponents.get(componentType.id);
    if (renderer == null) {
      renderer = new ReactNativeRenderer(this, componentType);
      this._registeredComponents.set(componentType.id, renderer);
    }
    return renderer;
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

@Injectable()
export class ReactNativeRootRenderer_ extends ReactNativeRootRenderer {
  constructor(@Inject(REACT_NATIVE_WRAPPER) _wrapper: ReactNativeWrapper, _zone: NgZone) {
    super(_wrapper, _zone);
  }
}

export class ReactNativeRenderer implements Renderer {

  constructor(private _rootRenderer: ReactNativeRootRenderer, private componentProto: RenderComponentType) { }

  renderComponent(componentType: RenderComponentType):Renderer {
    return this._rootRenderer.renderComponent(componentType);
  }

  selectRootElement(selector: string): Node {
    var root = this.createElement(null, selector.startsWith('#root') ? 'test-cmp' : selector);
    this._createElementCommand(root);
    this._rootRenderer.addAttachCommand(root, true);
    return root;
  }

  createElement(parentElement: Node, name: string): Node {
    var node = new ElementNode(name, this._rootRenderer.wrapper, this._rootRenderer.zone);
    node.attachTo(parentElement);
    if (!node.isVirtual && node.getAncestorWithNativeCreated()) {
      this._createElementCommand(node);
      this._rootRenderer.addAttachCommand(node, false);
    }
    return node;
  }

  private _createElementCommand(node: Node): void {
    this._rootRenderer.addCreateCommand(node);
    node.isCreated = true;
  }

  createViewRoot(hostElement: Node): Node {
    return hostElement;
  }

  createTemplateAnchor(parentElement: Node): Node {
    var node = new AnchorNode(this._rootRenderer.wrapper, this._rootRenderer.zone);
    node.attachTo(parentElement);
    return node;
  }

  createText(parentElement: Node, value: string): Node {
    var node = new TextNode(value, this._rootRenderer.wrapper, this._rootRenderer.zone);
    if (parentElement && parentElement.isCreated) {
      this._createTextCommand(<TextNode>node);
      this._rootRenderer.addAttachCommand(node, false);
    }
    node.attachTo(parentElement);
    return node;
  }

  private _createTextCommand(node: TextNode): void {
    this._rootRenderer.addCreateCommand(node, {text: node.properties['text']});
    var cmd = new NativeCommandCreate(node);
    node.isCreated = true;
  }

  projectNodes(parentElement: Node, nodes: Node[]): void {
    if (parentElement) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.attachTo(parentElement);
        if (node.getAncestorWithNativeCreated()) {
          if (this._createNativeRecursively(node)) {
            this._rootRenderer.addAttachCommand(node, false);
          }
        }
      }
    }
  }

  attachViewAfter(node: Node, viewRootNodes: Node[]): void {
    if (viewRootNodes.length > 0) {
      var index = node.parent.children.indexOf(node);
      for (var i = 0; i < viewRootNodes.length; i++) {
        var viewRootNode = viewRootNodes[i];
        viewRootNode.attachToAt(node.parent, index + i + 1);
        if (viewRootNode.getAncestorWithNativeCreated()) {
          if (this._createNativeRecursively(viewRootNode)) {
            this._rootRenderer.addAttachAfterCommand(viewRootNode, node);
          }
        }
      }
    }
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

  detachView(viewRootNodes: Node[]): void {
    for (var i = 0; i < viewRootNodes.length; i++) {
      var node = viewRootNodes[i];
      var parent = node.parent;
      var index = parent.children.indexOf(node);
      parent.children.splice(index, 1);
      this._rootRenderer.addDetachCommand(node);
    }
  }

  destroyView(hostElement: any, viewAllNodes: Node[]): void {
    for (var i = 0; i < viewAllNodes.length; i++) {
      var node = viewAllNodes[i];
      node.toBeDestroyed = true;
    }
  }

  listen(renderElement: Node, name: string, callback: Function): Function {
    renderElement.addEventListener(name, callback);
    return () => {renderElement.removeEventListener(name, callback);};
  }

  listenGlobal(target: string, name: string, callback: Function): Function {
    console.error('NOT IMPLEMENTED: listenGlobal', arguments);
    return () => {};
  }

  setElementProperty(renderElement: Node, propertyName: string, propertyValue: any): void {
    if (typeof propertyValue !== 'undefined') {
      renderElement.setProperty(propertyName, propertyValue, false);
      if (renderElement.isCreated) {
        this._rootRenderer.addUpdateCommand(renderElement, propertyName, propertyValue);
      }
    }
  }

  setElementAttribute(renderElement: Node, attributeName: string, attributeValue: string): void {
    var val: any = attributeValue;
    if (attributeValue == "false") val = false;
    if (attributeValue == "true") val = true;
    if (attributeValue == "null") val = null;
    if (!isNaN(parseInt(val))) val = parseInt(val);
    if (attributeValue.startsWith('#')) val = this._rootRenderer.wrapper.processColor(attributeValue);
    this.setElementProperty(renderElement, attributeName, val);
  }

  setBindingDebugInfo(renderElement: Node, propertyName: string, propertyValue: string): void {
    //this.setElementProperty(renderElement, propertyName, propertyValue);
  }

  setElementClass(renderElement:any, className:string, isAdd:boolean):any {
    console.error('NOT IMPLEMENTED: setElementClass', arguments);
  }

  setElementStyle(renderElement:any, styleName:string, styleValue:string):any {
    console.error('NOT IMPLEMENTED: setElementStyle', arguments);
  }

  invokeElementMethod(renderElement: Node, methodName: string, args: any[]): void {
    renderElement.dispatchCommand(methodName, args);
  }

  setText(renderNode: Node, text: string): void {
    if (renderNode instanceof TextNode) {
      var trimedText = renderNode.setText(text);
      this.setElementProperty(renderNode, 'text', trimedText);
    }
  }
}