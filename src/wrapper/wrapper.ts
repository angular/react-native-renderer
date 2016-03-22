var IS_ANDROID = true;

export function isAndroid(): boolean {
  return IS_ANDROID;
}

export function overridePlatform(platform: string): void {
  IS_ANDROID = platform == 'android';
}

export class ReactNativeWrapper {
  computeStyle(styles: Object): Object {return undefined;}
  processColor(color: string): number {return -1}
  resolveAssetSource(source: any): any {return null};
  dismissKeyboard(): void {};
  requestNavigatorLock(tag: number, callback: (b: boolean) => any): void {}
  getUIManager(): any {return null;};
  createView(tagName: string, root: number, properties: Object): number {return 0;}
  updateView(tag: number, tagName: string, properties: Object): void {}
  manageChildren(parentTag: number, moveFrom: Array<number>, moveTo: Array<number>, addTags: Array<number>, addAt: Array<number>, removeAt: Array<number>): void{}
  dispatchCommand(tag: number, command: string, params: any): void {}
  patchReactUpdates(zone: any): void {}
  patchReactNativeEventEmitter(nodeMap: Map<number, any>): void {}
  isAndroid(): boolean {return true;}
  blur(tag: number): void {}
  focus(tag: number): void {}
  $log(...args: any[]): void {};
}
