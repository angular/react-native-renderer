export function getGlobalZone() {
  return global.zone;
}

export class ReactNativeWrapper {
  computeStyle(styles: Object): Object {return undefined;}
  createView(tagName: string, root: number, properties: Object): number {return 0;}
  updateView(tag: number, tagName: string, properties: Object): void {}
  manageChildren(parentTag: number, moveFrom: Array<number>, moveTo: Array<number>, addTags: Array<number>, addAt: Array<number>, removeAt: Array<number>): void{}
  dispatchCommand(tag: number, command: string): void {}
  patchReactUpdates(zone: any): void {}
  patchReactNativeEventEmitter(nodeMap: Map<number, any>): void {}
}
