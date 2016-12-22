import {Component, ViewChild} from "@angular/core";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {fireFunctionalEvent, configureTestingModule, initTest} from "../../src/test_helpers/utils";
import {ScrollView} from "../../src/components/common/scrollview";

describe('ScrollView component', () => {
  const mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should render vertically', () => {
    initTest(TestComponent, `<ScrollView></ScrollView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-scrollview+{"flexDirection":"column","overflow":"scroll"},CREATE+4+native-view+{"collapsable":false,"flexDirection":null},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
  });

  it('should render horizontally', () => {
    initTest(TestComponent, `<ScrollView horizontal="true"></ScrollView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-horizontalscrollview+{"horizontal":true,"flexDirection":"row","overflow":"scroll"},CREATE+4+native-view+{"collapsable":false,"flexDirection":"row"},' +
      'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
  });

  it('should switch direction', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<ScrollView [horizontal]="isHorizontal"></ScrollView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-scrollview+{"horizontal":false,"flexDirection":"column","overflow":"scroll"},CREATE+4+native-view+{"collapsable":false,"flexDirection":null},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');

    mock.clearLogs();
    fixture.componentInstance.isHorizontal = true;
    fixture.detectChanges();
    rootRenderer.executeCommands();
    expect(mock.commandLogs.toString()).toEqual('UPDATE+3+native-horizontalscrollview+{"horizontal":true,"flexDirection":"row"},UPDATE+4+native-view+{"flexDirection":"row"}');
  });

  it('should render with properties', () => {
    initTest(TestComponent, `<ScrollView scrollEnabled="{{false}}" removeClippedSubviews="true"></ScrollView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-scrollview+{"scrollEnabled":false,"flexDirection":"column","removeClippedSubviews":true,"overflow":"scroll"},' +
      'CREATE+4+native-view+{"collapsable":false,"removeClippedSubviews":true,"flexDirection":null},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
  });

  it('should render with styles', () => {
    initTest(TestComponent, `<ScrollView [styleSheet]="20" [style]="{fontSize: 42}" [contentContainerStyle]="20"></ScrollView>`);
    expect(mock.commandLogs.toString()).toEqual(
      'CREATE+2+test-cmp+{},CREATE+3+native-scrollview+{"flexDirection":"column","overflow":"scroll","flex":1,"collapse":true,"fontSize":42},' +
      'CREATE+4+native-view+{"collapsable":false,"flexDirection":null,"flex":1,"collapse":true},ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0');
  });

  it('should fire scroll events', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<ScrollView (scroll)="handleChange($event)"></ScrollView>`);
    mock.clearLogs();

    const target = fixture.elementRef.nativeElement.children[0].children[1];
    fireFunctionalEvent('topScroll', target, {title: 'foo'});

    fixture.whenStable().then(() => {
      rootRenderer.executeCommands();
      expect(fixture.componentInstance.log.join(',')).toEqual('foo');
    });

  });

  it('should dispatch commands', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<ScrollView></ScrollView>`);
    mock.clearLogs();

    fixture.componentInstance.scrollView.scrollTo(42);
    expect(mock.commandLogs.toString()).toEqual(
      'COMMAND+3+scrollTo+42');
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  @ViewChild(ScrollView) scrollView: ScrollView
  log: Array<any> = [];
  isHorizontal: boolean = false;

  handleChange(event: any) {
    this.log.push(event.title);
  }
}