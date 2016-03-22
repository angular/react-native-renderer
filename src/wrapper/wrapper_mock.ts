import {ReactNativeWrapper, overridePlatform} from "./wrapper";

class Command {
  constructor(public name: string, public target: number, public details: string) { }
  toString(): string {
    return `${this.name}+${this.target}+${this.details}`;
  }
}

export class MockReactNativeWrapper extends ReactNativeWrapper {
  commandLogs: Array<Command>;
  root: NativeElement;
  nativeElementMap: Map<number, NativeElement>;
  private _lastTagUsed: number;
  private _platform: string;

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
    this._platform = 'android';
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
    var toBeDeleted: Array<any> = [];
    var toBeAdded: Array<any> = [];
    if (moveFrom && moveTo && moveFrom.length != moveTo.length) {
      throw new Error(`manageChildren - MOVE - Invalid lengths: ${moveFrom.length} vs ${moveTo.length}`);
    }
    if (addTags && addAt && addTags.length != addAt.length) {
      throw new Error(`manageChildren - MOVE - Invalid lengths: ${addTags.length} vs ${addAt.length}`);
    }
    //Detach commands
    if (removeFrom) {
      for (var i = 0; i < removeFrom.length; i++) {
        var index = removeFrom[removeFrom.length - i - 1];
        toBeDeleted.push(index);
        this.commandLogs.push(new Command('DETACH', parentTag, '' + index));
      }
    }
    //Move commands
    if (moveFrom) {
      for (var i = 0; i < moveFrom.length; i++) {
        var tag = parentElement.children[moveFrom[i]].tag;
        toBeDeleted.push(moveFrom[i]);
        toBeAdded.push({index: moveTo[i], tag: tag});
      }
      this.commandLogs.push(new Command('MOVE', parentTag, '' + moveFrom.join(',') + '+' + moveTo.join(',')));
    }
    //Attach commands
    if (addTags) {
      for (var i = 0; i < addTags.length; i++) {
        toBeAdded.push({index: addAt[i], tag: addTags[i]});
        this.commandLogs.push(new Command('ATTACH', parentTag, addTags[i] + '+' + addAt[i]));
      }
    }
    //Update data structure
    toBeDeleted.sort();
    toBeAdded.sort((a, b) => { return a.index - b.index});
    for (var i = 0; i < toBeDeleted.length; i++) {
      parentElement.children.splice(toBeDeleted[toBeDeleted.length - i - 1], 1);
    }
    for (var i = 0; i < toBeAdded.length; i++) {
      var item = toBeAdded[i];
      var element = this.nativeElementMap.get(item.tag);
      element.parent = parentElement;
      if (item.index <= parentElement.children.length) {
        parentElement.children.splice(item.index, 0, element);
      } else {
        throw new Error(`manageChildren - ATTACH - Invalid index ${item.index},  size is ${parentElement.children.length}`);
      }
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
  }

  processColor(color: string): number {
    return 42;
  }

  resolveAssetSource(source: any): any {
    return source;
  }

  dismissKeyboard(): void {
    this.commandLogs.push(new Command('DISMISS_KEYBOARD', -1, ''));
  }

  requestNavigatorLock(tag: number, callback: (b: boolean) => any): void {
    this.commandLogs.push(new Command('REQUEST_NAVIGATOR_LOCK', tag, ''));
    callback(true);
  }

  getUIManager(): any {
    return {
      AndroidDrawerLayout: {
        Constants: {DrawerPosition: {Right: 1, Left: -1}}
      },
      AndroidSwipeRefreshLayout: {
        Constants: {SIZE: {DEFAULT: 1, LARGE: 0}}
      },
      ToolbarAndroid: {
        Constants: {ShowAsAction: {always: 2, never: 0, ifRoom: 1}}
      },
      RCTScrollView: {
        Constants : {DecelerationRate: {normal: 0.9, fast: 0.998}}
      }
    };

  }

  isAndroid(): boolean {
    return this._platform == 'android';
  }

  blur(tag: number): void {
    this.commandLogs.push(new Command('COMMAND', tag, 'blur'));
  }

  focus(tag: number): void {
    this.commandLogs.push(new Command('COMMAND', tag, 'focus'));
  }

  setPlatform(platform: string): void {
    this._platform = platform;
    overridePlatform(platform);
  }

  $log(...args: any[]) {
    //console.log(...args);
  }
}

export class NativeElement {
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