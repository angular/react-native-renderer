import {
  Renderer,
  RenderElementRef,
  RenderFragmentRef,
  RenderProtoViewRef,
  RenderViewRef,
  RenderViewWithFragments,
  RenderTemplateCmd,
  RenderEventDispatcher
} from 'angular2/angular2';
import {RenderComponentTemplate} from 'angular2/src/core/render/api';
import {Node, ComponentNode, ElementNode, TextNode, AnchorNode} from './node';
import {BuildContext, ReactNativetRenderViewBuilder} from "./builder";

class ReactNativeProtoViewRef extends RenderProtoViewRef {
  constructor(public template: RenderComponentTemplate, public cmds: RenderTemplateCmd[]) { super(); }
}

class ReactNativeRenderFragmentRef extends RenderFragmentRef {
  constructor(public nodes: Node[]) { super(); }
}

class ReactNativeViewRef extends RenderViewRef {
  hydrated: boolean = false;
  constructor(public fragments: ReactNativeRenderFragmentRef[], public boundTextNodes: TextNode[],
              public boundElementNodes: Node[]) { super(); }
}

export class ReactNativeRenderer extends Renderer {
  private _componentTpls: Map<string, RenderComponentTemplate> = new Map<string, RenderComponentTemplate>();
  private _rootView: RenderViewWithFragments;

  constructor() {
    super();
  }

  createProtoView(componentTemplateId: string, cmds:RenderTemplateCmd[]):RenderProtoViewRef {
    return new ReactNativeProtoViewRef(this._componentTpls.get(componentTemplateId), cmds);
  }

  registerComponentTemplate(template: RenderComponentTemplate): void {
    this._componentTpls.set(template.id, template);
  }

  createRootHostView(hostProtoViewRef:RenderProtoViewRef, fragmentCount:number, hostElementSelector:string):RenderViewWithFragments {
    //TODO: Init with selector?
    this._rootView = this._createView(hostProtoViewRef);
    this._refresh();
    return this._rootView;
  }

  _refresh() {
    //TODO: manage refresh?
    console.log((<ReactNativeRenderFragmentRef>this._rootView.fragmentRefs[0]).nodes[0]);
  }

  createView(protoViewRef:RenderProtoViewRef, fragmentCount:number):RenderViewWithFragments {
    return this._createView(protoViewRef);
  }

  _createView(protoViewRef:RenderProtoViewRef): RenderViewWithFragments {
    var context = new BuildContext();
    var builder = new ReactNativetRenderViewBuilder(this._componentTpls, (<ReactNativeProtoViewRef>protoViewRef).cmds, null, context);
    context.build(builder);
    var fragments: ReactNativeRenderFragmentRef[] = [];
    for (var i = 0; i < context.fragments.length; i++) {
      fragments.push(new ReactNativeRenderFragmentRef(context.fragments[i]));
    }
    var view = new ReactNativeViewRef(fragments, context.boundTextNodes, context.boundElementNodes);
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
      if (nodes.length > 0 && sibling.parent) {
        for (var i = 0; i < nodes.length; i++) {
          var index = sibling.parent.children.indexOf(sibling);
          sibling.parent.children.splice(index + i + 1, 0, nodes[i]);
          nodes[i].parent = sibling.parent;
        }
        this._refresh();
      }
    }
  }

  attachFragmentAfterElement(location:RenderElementRef, fragmentRef:RenderFragmentRef): void {
    var sibling = (<ReactNativeViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
    var nodes = (<ReactNativeRenderFragmentRef>fragmentRef).nodes;
    if (nodes.length > 0 && sibling.parent) {
      for (var i = 0; i < nodes.length; i++) {
        var index = sibling.parent.children.indexOf(sibling);
        sibling.parent.children.splice(index + i + 1, 0, nodes[i]);
        nodes[i].parent = sibling.parent;
      }
      this._refresh();
    }
  }

  detachFragment(fragmentRef:RenderFragmentRef): void {
    var nodes = (<ReactNativeRenderFragmentRef>fragmentRef).nodes;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var index = node.parent.children.indexOf(node);
      node.parent.children.splice(index, 1);
    }
    this._refresh();
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
    //Do nothing
  }

}
