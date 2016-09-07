import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {Picker} from "../../src/components/common/picker";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('Picker component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render in dialog mode', () => {
    initTest(TestComponent, `<Picker></Picker>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-dialogpicker+{"items":[],"mode":"dialog","height":50},ATTACH+1+2+0,ATTACH+2+3+0');

  });

  it('should render in dropdown mode', () => {
    initTest(TestComponent, `<Picker mode="dropdown"></Picker>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-dropdownpicker+{"items":[],"mode":"dropdown","height":50},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<Picker [items]="[{label:'a',value:0},{label:'b',value:1}]"></Picker>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-dialogpicker+{"items":[{"label":"a","value":0},{"label":"b","value":1}],"mode":"dialog","height":50},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<Picker [styleSheet]="20" [style]="{height: 100}"></Picker>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-dialogpicker+{"items":[],"mode":"dialog","height":100,"flex":1,"collapse":true},ATTACH+1+2+0,ATTACH+2+3+0');
  });

  it('should fire select event', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<Picker (select)="handleChange($event)"></Picker>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[2];
    fireFunctionalEvent('topSelect', target, {position: 0});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(fixture.componentInstance.log.join(',')).toEqual('0');
      expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-dialogpicker+{"selected":0}');
    });
  });
});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(Picker) picker: Picker;
  log: Array<any> = [];

  handleChange(value: any) {
    this.log.push(value);
  }
}