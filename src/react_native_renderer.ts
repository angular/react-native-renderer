import {
  Renderer,
  RenderElementRef,
  RenderFragmentRef,
  RenderProtoViewRef,
  RenderViewRef,
  RenderViewWithFragments,
  RenderTemplateCmd,
  RenderEventDispatcher,
  RenderComponentTemplate,
  Inject,
  OpaqueToken,
  NgZone
} from 'angular2/core';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {Node, ComponentNode, ElementNode, TextNode, AnchorNode, nodeMap} from './node';
import {BuildContext, ReactNativetRenderViewBuilder} from "./builder";
import {ReactNativeWrapper} from './wrapper';

export const REACT_NATIVE_WRAPPER: OpaqueToken = new OpaqueToken("ReactNativeWrapper");

export class ReactNativeElementSchemaRegistry extends ElementSchemaRegistry {
  hasProperty(tagName: string, propName: string): boolean {
    return true;
  }
  getMappedPropName(propName: string): string {
    return propName;
  }
}

class ReactNativeProtoViewRef extends RenderProtoViewRef {
  constructor(public template: RenderComponentTemplate, public cmds: RenderTemplateCmd[]) { super(); }
}

class ReactNativeRenderFragmentRef extends RenderFragmentRef {
  constructor(public nodes: Node[]) { super(); }
}

class ReactNativeViewRef extends RenderViewRef {
  hydrated: boolean = false;
  eventDispatcher: RenderEventDispatcher = null;
  private _zone: NgZone;

  constructor(public fragments: ReactNativeRenderFragmentRef[], public boundTextNodes: TextNode[],
              public boundElementNodes: Node[], zone: NgZone) {
    super();
    this._zone = zone;
  }

  dispatchRenderEvent(boundElementIndex: number, eventName: string, event: any):any {
    if (this.eventDispatcher) {
      var locals = new Map<string, any>();
      locals.set('$event', event);
      this._zone.run(() => this.eventDispatcher.dispatchRenderEvent(boundElementIndex, eventName, locals));
    }
  }
}

export class ReactNativeRenderer extends Renderer {
  private _componentTpls: Map<string, RenderComponentTemplate> = new Map<string, RenderComponentTemplate>();
  private _rootView: RenderViewWithFragments;
  private rnWrapper: ReactNativeWrapper;
  private _zone: NgZone;

  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper, zone: NgZone) {
    super();
    wrapper.patchReactNativeEventEmitter(nodeMap);
    this.rnWrapper = wrapper;
    this._zone = zone;
  }

  createProtoView(componentTemplateId: string, cmds:RenderTemplateCmd[]):RenderProtoViewRef {
    return new ReactNativeProtoViewRef(this._componentTpls.get(componentTemplateId), cmds);
  }

  registerComponentTemplate(template: RenderComponentTemplate): void {
    this._componentTpls.set(template.id, template);
  }

  createRootHostView(hostProtoViewRef:RenderProtoViewRef, fragmentCount:number, hostElementSelector:string):RenderViewWithFragments {
    this._rootView = this._createView(hostProtoViewRef, true);
    return this._rootView;
  }

  createView(protoViewRef:RenderProtoViewRef, fragmentCount:number):RenderViewWithFragments {
    return this._createView(protoViewRef, false);
  }

  _createView(protoViewRef:RenderProtoViewRef, isHost: boolean): RenderViewWithFragments {
    var view: ReactNativeViewRef;
    var eventDispatcher = (boundElementIndex: number, eventName: string, event: any) =>
      view.dispatchRenderEvent(boundElementIndex, eventName, event);
    var context = new BuildContext(isHost, this.rnWrapper, eventDispatcher);
    var builder = new ReactNativetRenderViewBuilder(this._componentTpls, (<ReactNativeProtoViewRef>protoViewRef).cmds, null, context);
    context.build(builder);
    var fragments: ReactNativeRenderFragmentRef[] = [];
    for (var i = 0; i < context.fragments.length; i++) {
      fragments.push(new ReactNativeRenderFragmentRef(context.fragments[i]));
    }
    view = new ReactNativeViewRef(fragments, context.boundTextNodes, context.boundElementNodes, this._zone);
    return new RenderViewWithFragments(view, view.fragments);
  }

  destroyView(viewRef:RenderViewRef):any {
    console.error('NOT IMPLEMENTED: destroyView', arguments);
    return undefined;
  }

  attachFragmentAfterFragment(previousFragmentRef:RenderFragmentRef, fragmentRef:RenderFragmentRef): void {
    var previousNodes = (<ReactNativeRenderFragmentRef>previousFragmentRef).nodes;
    if (previousNodes.length > 0) {
      var sibling = previousNodes[previousNodes.length - 1];
      var nodes = (<ReactNativeRenderFragmentRef>fragmentRef).nodes;
      sibling.insertAfter(nodes);
    }
  }

  attachFragmentAfterElement(location:RenderElementRef, fragmentRef:RenderFragmentRef): void {
    var sibling = (<ReactNativeViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
    var nodes = (<ReactNativeRenderFragmentRef>fragmentRef).nodes;
    sibling.insertAfter(nodes);
  }

  detachFragment(fragmentRef:RenderFragmentRef): void {
    var nodes = (<ReactNativeRenderFragmentRef>fragmentRef).nodes;
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].detach();
    }
  }

  hydrateView(viewRef:RenderViewRef): void {
    (<ReactNativeViewRef>viewRef).hydrated = true;
  }

  dehydrateView(viewRef:RenderViewRef): void {
    (<ReactNativeViewRef>viewRef).hydrated = false;
  }

  getNativeElementSync(location:RenderElementRef):any {
    return (<ReactNativeViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
  }

  setElementProperty(location:RenderElementRef, propertyName:string, propertyValue:any): void {
    var node = (<ReactNativeViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
    node.setProperty(propertyName, propertyValue);
  }

  setElementAttribute(location:RenderElementRef, attributeName:string, attributeValue:string): void {
    var node = (<ReactNativeViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
    node.setProperty(attributeName, attributeValue);
  }

  setBindingDebugInfo(location: RenderElementRef, propertyName: string,
                      propertyValue: string): void {
    // Do nothing
  }

  setElementClass(location:RenderElementRef, className:string, isAdd:boolean): void {
    console.error('NOT IMPLEMENTED: setElementClass', arguments);
  }

  setElementStyle(location:RenderElementRef, styleName:string, styleValue:string): void {
    console.error('NOT IMPLEMENTED: setElementStyle', arguments);
  }

  invokeElementMethod(location:RenderElementRef, methodName:string, args:any[]): void {
    console.error('NOT IMPLEMENTED: invokeElementMethod', arguments);
  }

  setText(viewRef:RenderViewRef, textNodeIndex:number, text:string): void {
    (<TextNode>(<ReactNativeViewRef>viewRef).boundTextNodes[textNodeIndex]).setText(text);
  }

  setEventDispatcher(viewRef:RenderViewRef, dispatcher:RenderEventDispatcher): void {
    (<ReactNativeViewRef>viewRef).eventDispatcher = dispatcher;
  }

}
