import {
  RenderCommandVisitor,
  RenderBeginElementCmd,
  RenderBeginComponentCmd,
  RenderEmbeddedTemplateCmd,
  RenderNgContentCmd,
  RenderTemplateCmd,
  RenderTextCmd
  } from 'angular2/core';
import {RenderComponentTemplate} from 'angular2/src/core/render/api';
import {Node, ComponentNode, ElementNode, TextNode, AnchorNode} from './node';
import {ReactNativeWrapper} from "./wrapper";

export class ReactNativetRenderViewBuilder implements RenderCommandVisitor {
  private parentStack: Array<Node> = [];
  private rootNodes: Array<Node> = [];

  constructor(public componentTemplates: Map<string, RenderComponentTemplate>, public commands: RenderTemplateCmd[], public parentComponent: ComponentNode, context: BuildContext) {
    if (parentComponent) {
      this.parentStack.push(parentComponent);
    } else {
      context.fragments.push(this.rootNodes);
    }
  }

  build(context: BuildContext) {
    for (var i = 0; i < this.commands.length; i++) {
      this.commands[i].visit(this, context);
    }
  }

  visitText(cmd:RenderTextCmd, context: BuildContext):any {
    var text = new TextNode(cmd.value, cmd.isBound, context.rnWrapper);
    this._addChild(text, cmd.ngContentIndex);
    if (cmd.isBound) {
      context.boundTextNodes.push(text);
    }
    return undefined;
  }

  visitNgContent(cmd:RenderNgContentCmd, context: BuildContext):any {
    if (this.parentComponent) {
      if (this.parentComponent.isRoot) {
        console.error('TODO: isRoot case in visitNgContent')
      } else {
        var projectedNodes = this.parentComponent.project(cmd.index);
        for (var i = 0; i < projectedNodes.length; i++) {
          var node = projectedNodes[i];
          this._addChild(node, cmd.ngContentIndex);
        }
      }
    }
    return undefined;
  }

  visitBeginElement(cmd: RenderBeginElementCmd, context: BuildContext):any {
    var element = new ElementNode(cmd.name, cmd.isBound, this._processAttributes(cmd), context.rnWrapper);
    this._addChild(element, cmd.ngContentIndex);
    this.parentStack.push(element);
    if (cmd.isBound) {
      context.boundElementNodes.push(element);
    }
    return undefined;
  }

  visitEndElement(context: BuildContext):any {
    this.parentStack.pop();
    return undefined;
  }

  visitBeginComponent(cmd: RenderBeginComponentCmd, context: BuildContext):any {
    var isRoot = context.componentsCount == 0;
    var component = new ComponentNode(cmd.name, cmd.isBound, this._processAttributes(cmd), isRoot, context.rnWrapper);
    this._addChild(component, cmd.ngContentIndex);
    this.parentStack.push(component);
    if (cmd.isBound) {
      context.boundElementNodes.push(component);
    }
    context.componentsCount++;
    var cptBuilder = new ReactNativetRenderViewBuilder(this.componentTemplates, this.componentTemplates.get(cmd.templateId).commands, component, context);
    context.enqueueBuilder(cptBuilder);
    return undefined;
  }

  visitEndComponent(context: BuildContext):any {
    var node = <ComponentNode>this.parentStack.pop();
    if (node.isRoot && context.isHost) {
      node.attachRoot();
    }
    return undefined;
  }

  visitEmbeddedTemplate(cmd: RenderEmbeddedTemplateCmd, context: BuildContext):any {
    var anchor = new AnchorNode(context.rnWrapper);
    this._addChild(anchor, cmd.ngContentIndex);
    context.boundElementNodes.push(anchor);
    if (cmd.isMerged) {
      console.error('TODO: isMerged case in visitEmbeddedTemplate');
    }
    return undefined;
  }

  _addChild(node: Node, ngContentIndex: number) {
    var parent = this.parentStack[this.parentStack.length - 1];
    if (parent) {
      if (ngContentIndex != null && parent instanceof ComponentNode) {
        parent.addContentNode(ngContentIndex, node);
      } else {
        parent.children.push(node);
        node.parent = parent;
        node.attachToParent();
      }
    } else {
      if (node instanceof ComponentNode) this.parentComponent = node;
      this.rootNodes.push(node);
    }
  }

  _processAttributes(cmd: RenderBeginElementCmd): {[s: string]: string} {
    var attributes: {[s: string]: string} = {};
    for (var i = 0; i < cmd.attrNameAndValues.length / 2; i++) {
      var val: any = cmd.attrNameAndValues[i *2 + 1];
      if (val == "false") val = false;
      if (!isNaN(parseInt(val))) val = parseInt(val);
      attributes[cmd.attrNameAndValues[i * 2]] = val;
    }
    return attributes;
  }
}

export class BuildContext {
  boundElementNodes: Node[] = [];
  boundTextNodes: TextNode[] = [];
  fragments: Node[][] = [];
  componentsCount: number = 0;
  _builders: ReactNativetRenderViewBuilder[] = [];
  rnWrapper: ReactNativeWrapper;

  constructor(public isHost: boolean, wrapper: ReactNativeWrapper) {
    this.rnWrapper = wrapper;
  }

  public enqueueBuilder(builder: ReactNativetRenderViewBuilder) {
    this._builders.push(builder);
  }

  public build(builder: ReactNativetRenderViewBuilder) {
    this._builders = [];
    builder.build(this);
    var enqueuedBuilders = this._builders;
    for (var i = 0; i < enqueuedBuilders.length; i++) {
      this.build(enqueuedBuilders[i]);
    }
  }
}