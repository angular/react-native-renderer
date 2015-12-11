import {ReactNativeWrapper} from "../src/wrapper";

export class MockReactNativeWrapper extends ReactNativeWrapper {
  computeStyle(styles: Object) {
    console.log('MockReactNativeWrapper: computeStyle');
  }

  createView(tagName: string, root: number, properties: Object) {
    console.log('MockReactNativeWrapper: createView');
  }

  updateView(tag: number, tagName: string, properties: Object) {
    console.log('MockReactNativeWrapper: updateView');
  }

  manageChildren(parentTag: number, moveFrom: Array<number>, moveTo: Array<number>, addTags: Array<number>, addAt: Array<number>, removeAt: Array<number>) {
    console.log('MockReactNativeWrapper: manageChildren');
  }

  dispatchCommand(tag: number, command: string) {
    console.log('MockReactNativeWrapper: dispatchCommand');
  }

  patchReactUpdates(zone: any): void {
    console.log('MockReactNativeWrapper: patchReactUpdates');
  }

  patchReactNativeEventEmitter(nodeMap: Map<number, any>): void {
    console.log('MockReactNativeWrapper: patchReactNativeEventEmitter');
  };
}