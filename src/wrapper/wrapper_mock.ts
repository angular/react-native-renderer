import {ReactNativeWrapper} from "./wrapper";

export class MockReactNativeWrapper extends ReactNativeWrapper {
  commandLogs: Array<Command>;
  root: NativeElement;
  nativeElementMap: Map<number, NativeElement>;
  private _lastTagUsed: number;

  constructor() {
    super();
    this.reset();
  }

  reset() {
    this.commandLogs = [];
    this.root = new NativeElement('root', 1, {});
    this.nativeElementMap = new Map<number, NativeElement>();
    this._lastTagUsed = 1;
    this.nativeElementMap.set(1, this.root);
  }

  clearLogs() {
    this.commandLogs = [];
  }

  createView(tagName: string, root: number, properties: Object): number {
    this._lastTagUsed++;
    var element = new NativeElement(tagName, this._lastTagUsed, properties);
    this.nativeElementMap.set(this._lastTagUsed, element);
    this.commandLogs.push(new Command('CREATE', this._lastTagUsed, tagName + '+' + JSON.stringify(properties)));
    return this._lastTagUsed;
  }

  updateView(tag: number, tagName: string, properties: any) {
    var element: any = this.nativeElementMap.get(tag);
    element.name = tagName;
    for (var key in properties) {
      element.properties[key] = properties[key];
    }
    this.commandLogs.push(new Command('UPDATE', tag, tagName + '+' + JSON.stringify(properties)));
  }

  // moveFrom and removeFrom are both relative to the starting state of the View's children.
  // moveTo and addAt are both relative to the final state of the View's children.
  manageChildren(parentTag: number, moveFrom: Array<number>, moveTo: Array<number>, addTags: Array<number>, addAt: Array<number>, removeFrom: Array<number>) {
    var parentElement = this.nativeElementMap.get(parentTag);
    var toBeDeleted = removeFrom || [];
    var toBeAdded: Array<any> = [];
    var toBeMoved: Array<any> = [];
    if (moveFrom && moveTo && moveFrom.length == moveTo.length) {
      toBeDeleted = toBeDeleted.concat(moveFrom).sort();
      for (var i = 0; i < moveFrom.length; i++) {
        var tag = parentElement.children[moveFrom[i]].tag;
        toBeAdded.push({index: moveTo[i], tag: tag});
        toBeMoved.push(tag);
      }
    }
    if (addTags && addAt && addTags.length == addAt.length) {
      for (var i = 0; i < addTags.length; i++) {
        toBeAdded.push({index: addAt[i], tag: addTags[i]});
      }
    }
    //Detach
    for (var i = 0; i < toBeDeleted.length; i++) {
      var index = toBeDeleted[toBeDeleted.length - i - 1];
      var tag = parentElement.children[index].tag;
      parentElement.children.splice(index, 1);
      if (toBeMoved.indexOf(tag) == -1) {
        this.nativeElementMap.delete(tag);
      }
      this.commandLogs.push(new Command('DETACH', parentTag, '' + index));
    }
    //Attach
    toBeAdded.sort((a, b) => { return a.index - b.index});
    for (var i = 0; i < toBeAdded.length; i++) {
      var item = toBeAdded[i];
      var element = this.nativeElementMap.get(item.tag);
      element.parent = parentElement;
      parentElement.children.splice(item.index, 0, element);
      this.commandLogs.push(new Command('ATTACH', parentTag, item.tag + '+' + item.index));
    }
  }

  dispatchCommand(tag: number, command: string, params: any = null) {
    this.commandLogs.push(new Command('COMMAND', tag, command + (params ? '+' + params.toString() : "")));
  }

  computeStyle(styles: Array<any>): Object {
    var res: any = {};
    styles.forEach((style) => {
      if (!isNaN(parseInt(style))) {
        res['flex'] = 1;
        res['collapse'] = true;
      } else {
        for (var key in style) {
          res[key] = style[key];
        }
      }
    });
    return res;
  }

  patchReactUpdates(zone: any): void {
    //Not needed in Mock
  }
  patchReactNativeEventEmitter(nodeMap: Map<number, any>): void {
    //Not needed in Mock
  };
  processColor(color: string): number {
    return 42;
  }

  $log(...args: any[]) {
    //console.log(...args);
  }
}

class Command {
  constructor(public name: string, public target: number, public details: string) { }
  toString(): string {
    return `${this.name}+${this.target}+${this.details}`;
  }
}

class NativeElement {
  name: string;
  tag: number;
  properties: {[s: string]: any };
  children: Array<NativeElement>;
  parent: NativeElement;

  constructor(name: string, tag: number, properties: {[s: string]: any }) {
    this.name = name;
    this.tag = tag;
    this.properties = properties;
    this.parent = null;
    this.children = [];
  }
}