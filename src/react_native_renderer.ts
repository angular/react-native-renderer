import {RootRenderer, Renderer, RenderComponentType, OpaqueToken, Inject, Injectable, NgZone} from 'angular2/core';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {Node, ElementNode, AnchorNode, TextNode, InertNode, nodeMap} from './node';
import {ReactNativeWrapper} from './wrapper';
import {NativeCommand, NativeCommandCreate, NativeCommandUpdate, NativeCommandAttach, NativeCommandDetach, NativeCommandAttachAfter} from "./native_command";

export const REACT_NATIVE_WRAPPER: OpaqueToken = new OpaqueToken("ReactNativeWrapper");

export class ReactNativeElementSchemaRegistry extends ElementSchemaRegistry {
  hasProperty(tagName: string, propName: string): boolean {
    return true;
  }
  getMappedPropName(propName: string): string {
    return propName;
  }
}

export class ReactNativeRootRenderer implements RootRenderer {
  private _registeredComponents: Map<string, ReactNativeRenderer> = new Map<string, ReactNativeRenderer>();

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

  executeCommands(): void {
    this._registeredComponents.forEach((renderer: ReactNativeRenderer, key: string) => {
      renderer.executeCommands();
    })
  }
}

@Injectable()
export class ReactNativeRootRenderer_ extends ReactNativeRootRenderer {
  constructor(@Inject(REACT_NATIVE_WRAPPER) _wrapper: ReactNativeWrapper, _zone: NgZone) {
    super(_wrapper, _zone);
  }
}

export class ReactNativeRenderer implements Renderer {
  private _nativeCommands: Array<NativeCommand> = [];
  private _propsEater: Map<Node, NativeCommandCreate | NativeCommandUpdate> = new Map<Node, NativeCommandCreate | NativeCommandUpdate>();

  constructor(private _rootRenderer: ReactNativeRootRenderer, private componentProto: RenderComponentType) {
    //Do nothing more as ViewEncapsulation.None is the only mode supported
  }

  renderComponent(componentType: RenderComponentType):Renderer {
    return this._rootRenderer.renderComponent(componentType);
  }

  selectRootElement(selector: string): Node {
    var root = this.createElement(null, selector.startsWith('#root') ? 'test-cmp' : selector);
    this._createElementCommand(root);
    this._nativeCommands.push(new NativeCommandAttach(root, true));
    return root;
  }

  createElement(parentElement: Node, name: string): Node {
    var node = new ElementNode(name, this._rootRenderer.wrapper, this._rootRenderer.zone);
    node.attachTo(parentElement);
    if (parentElement && parentElement.isCreated) {
      this._createElementCommand(node);
      this._nativeCommands.push(new NativeCommandAttach(node, false));
    }
    return node;
  }

  _createElementCommand(node: Node): void {
    var cmd = new NativeCommandCreate(node);
    node.isCreated = true;
    this._nativeCommands.push(cmd);
    this._propsEater.set(node, cmd);
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
    var node: InertNode | TextNode;
    if (!parentElement || (parentElement.tagName != "Text" && parentElement.tagName != "VirtualText")) {
      node = new InertNode(this._rootRenderer.wrapper, this._rootRenderer.zone);
    } else {
      node = new TextNode(value, this._rootRenderer.wrapper, this._rootRenderer.zone);
      if (parentElement && parentElement.isCreated) {
        this._createTextCommand(<TextNode>node);
        this._nativeCommands.push(new NativeCommandAttach(node, false));
      }
    }
    node.attachTo(parentElement);
    return node;
  }

  _createTextCommand(node: TextNode): void {
    var cmd = new NativeCommandCreate(node);
    node.isCreated = true;
    cmd.props['text'] = node.properties['text'];
    this._nativeCommands.push(cmd);
    this._propsEater.set(node, cmd);
  }

  projectNodes(parentElement: Node, nodes: Node[]): void {
    if (parentElement) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        this._createNativeRecursively(node);
        node.attachTo(parentElement);
        this._nativeCommands.push(new NativeCommandAttach(node, false));
      }
    }
  }

  attachViewAfter(node: Node, viewRootNodes: Node[]): void {
    if (viewRootNodes.length > 0) {
      var index = node.parent.children.indexOf(node);
      var shift = 0;
      for (var i = 0; i < viewRootNodes.length; i++) {
        var viewRootNode = viewRootNodes[i];
        viewRootNode.attachToAt(node.parent, index + i + 1);
        if (!(viewRootNode instanceof InertNode)) {
          this._createNativeRecursively(viewRootNode);
          this._nativeCommands.push(new NativeCommandAttachAfter(viewRootNode, node, shift));
          shift++;
        }
      }
    }
  }

  _createNativeRecursively(node: Node) {
    if (!node.isCreated && !(node instanceof InertNode)) {
      node instanceof TextNode ? this._createTextCommand(node) : this._createElementCommand(node);
      for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        this._createNativeRecursively(child);
        this._nativeCommands.push(new NativeCommandAttach(child, false));
      }
    }
  }

  detachView(viewRootNodes: Node[]): void {
    for (var i = 0; i < viewRootNodes.length; i++) {
      var node = viewRootNodes[i];
      this._nativeCommands.push(new NativeCommandDetach(node));
    }
  }

  destroyView(hostElement:any, viewAllNodes:any[]):any {
    //TODO: Nothing to do, detachView took care of it. Can it be improved to avoid destruction and creation?
  }

  listen(renderElement: Node, name: string, callback: Function): void {
    renderElement.addEventListener(name, callback);
  }

  listenGlobal(target: string, name: string, callback: Function): Function {
    console.error('NOT IMPLEMENTED: listenGlobal', arguments);
    return () => {};
  }

  setElementProperty(renderElement: Node, propertyName: string, propertyValue: any): void {
    renderElement.setProperty(propertyName, propertyValue, false);
    if (renderElement.isCreated) {
      var cmd = this._propsEater.get(renderElement);
      if (cmd == null) {
        cmd = new NativeCommandUpdate(renderElement, propertyName, propertyValue);
        this._nativeCommands.push(cmd);
        this._propsEater.set(renderElement, cmd);
      }
      cmd.props[propertyName] = propertyValue;
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
    this.setElementProperty(renderElement, propertyName, propertyValue);
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

  executeCommands(): void {
    this._nativeCommands.forEach((command: NativeCommand) => {
      command.execute(this._rootRenderer.wrapper);
    });
    this._nativeCommands = [];
    this._propsEater.clear();
  }
}