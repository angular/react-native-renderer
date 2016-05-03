import {
  async, inject, beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {Component, ViewChild} from '@angular/core';
import {ReactNativeRootRenderer} from '../../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {Toolbar} from "../../../src/components/android/toolbar";
import {fireFunctionalEvent, getTestingProviders} from '../../../src/test_helpers/utils';

describe('Toolbar component (Android)', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should render', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Toolbar></Toolbar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-toolbar+{"subtitle":null},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should render with properties', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Toolbar [accessible]="true" testID="foo" [actions]="[{title:'foo', icon: 'require(icon.png)', show: 'ifRoom'}]" rtl="{{true}}"></Toolbar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-toolbar+{"nativeActions":[{"title":"foo","icon":"require(icon.png)","show":1}],"rtl":true,"subtitle":null,"accessible":true,"testID":"foo"},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should render with styles', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Toolbar [styleSheet]="20" [style]="{margin: 42}"></Toolbar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-toolbar+{"subtitle":null,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should fire select event', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<Toolbar (select)="handleChange($event)"></Toolbar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topSelect', target, {position: 1});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            rootRenderer.executeCommands();
            expect(fixture.componentInstance.log.join(',')).toEqual('1');
            resolve();
          }, 150);
        });

      });
  })));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [Toolbar]
})
class TestComponent {
  @ViewChild(Toolbar) toolbar: Toolbar
  log: Array<any> = [];

  handleChange(event: any) {
    this.log.push(event.position);
  }
}