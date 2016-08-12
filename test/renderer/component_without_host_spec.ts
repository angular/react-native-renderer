import {Component} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {configureTestingModule, initTest} from "../../src/testing";

describe('Component without host', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent, [SubComponent, SubComponentWithIf, SubComponentWithProjection]);
  });

  it('should render', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View></View>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should support nesting', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><View></View></View>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
  });

  it('should support heavy nesting', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><View><View><View><View></View></View></View></View></View>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},' +
      'CREATE+5+native-view+{},CREATE+6+native-view+{},CREATE+7+native-view+{},' +
      'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+6+7+0,ATTACH+5+6+0,ATTACH+4+5+0,ATTACH+3+4+0');
  });

  it('should support sub-components', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><sub></sub></View>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+sub+{},CREATE+5+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+4+5+0,ATTACH+3+4+0');
  });

  it('should support ngIf', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View *ngIf="b"></View>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0');

    mock.clearLogs();
    fixture.componentInstance.b = false;
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual('DETACH+2+0');

    mock.clearLogs();
    fixture.componentInstance.b = true;
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual('CREATE+4+native-view+{},ATTACH+2+4+0');
  });

  it('should support nested ngIf', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View> <View *ngIf="b"> </View> </View>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');

    mock.clearLogs();
    fixture.componentInstance.b = false;
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual('DETACH+3+0');

    mock.clearLogs();
    fixture.componentInstance.b = true;
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual('CREATE+5+native-view+{},ATTACH+3+5+0');
  });

  it('should support ngFor', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View *ngFor="let item of a"></View>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+2+4+1');

    mock.clearLogs();
    fixture.componentInstance.a.pop();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual('DETACH+2+1');
  });

  it('should support ngFor on an element next to a component', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View></View><native-view *ngFor="let item of a"></native-view>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},CREATE+5+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+2+4+1,ATTACH+2+5+2');

    mock.clearLogs();
    fixture.componentInstance.a.pop();
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual('DETACH+2+2');
  });

  it('should support projection', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<proj><sub></sub><Text></Text></proj>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+proj+{},CREATE+4+native-text+{},CREATE+5+sub+{},CREATE+6+native-view+{},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1,ATTACH+5+6+0');
  });

  it('should support components with ngIf in their templates', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View></View><Picker></Picker>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-dialogpicker+{"items":[],"mode":"dialog","height":50},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+2+4+1');
  });

  it('should support sub-components with ngIf in their templates', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<sub-with-if></sub-with-if>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+sub-with-if+{},CREATE+4+native-view+{},CREATE+5+native-view+{},CREATE+6+native-text+{},' +
      'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+2,ATTACH+3+6+1');
  });

  it('should not attach twice components with ngIf in their templates', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><View></View><Picker></Picker><View></View></View>`);
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-view+{},CREATE+4+native-view+{},CREATE+5+native-view+{},CREATE+6+native-dialogpicker+{"items":[],"mode":"dialog","height":50},' +
      'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+2,ATTACH+3+6+1');
  });

});

@Component({
  selector: 'sub',
  template: `<View></View>`
})
class SubComponent {
}
@Component({
  selector: 'sub-with-if',
  template: `<View></View><Text *ngIf="b"></Text><View></View>`
})
class SubComponentWithIf {
  b: boolean = true;
}
@Component({
  selector: 'proj',
  template: `<ng-content select="Text"></ng-content><ng-content></ng-content>`
})
class SubComponentWithProjection {
}
@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  s: string = 'bar';
  b: boolean = true;
  a: Array<number> = [1,2];
  d: Array<Object> = [{a:0,b:1}, {a:8, b:9}];
  n: number = 20;

  handleEvent(evt: any) {
    this.b = false;
  }
}