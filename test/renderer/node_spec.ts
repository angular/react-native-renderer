import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component} from 'angular2/core';
import {Node} from '../../src/renderer/node';
import {ReactNativeRootRenderer} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {getTestingProviders} from "../../src/test_helpers/utils";

describe('Node', () => {
  var mock:MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));


  it('should getElementByTestId', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb:TestComponentBuilder, _rootRenderer:ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View><Text testID="foo">Foo</Text><Text testID="bar">Bar</Text></View>`)
      .createAsync(TestComponent).then((fixture:ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();

        var root:Node = <Node>fixture.nativeElement;
        var res = root.getElementByTestId('bar');
        expect(res.tagName).toEqual('Text');
        expect(res.properties['testID']).toEqual('bar');
      });
  }));

  it('should querySelector', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb:TestComponentBuilder, _rootRenderer:ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View><Text testID="foo">Foo</Text><Text testID="bar">Bar</Text></View>`)
      .createAsync(TestComponent).then((fixture:ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();

        var root:Node = <Node>fixture.nativeElement;
        var res = root.querySelector('Text');
        expect(res.tagName).toEqual('Text');
        expect(res.properties['testID']).toEqual('foo');
      });
  }));

  it('should querySelectorAll', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb:TestComponentBuilder, _rootRenderer:ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View><Text testID="foo">Foo</Text><Text testID="bar">Bar</Text></View>`)
      .createAsync(TestComponent).then((fixture:ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();

        var root:Node = <Node>fixture.nativeElement;
        var res = root.querySelectorAll('Text');
        expect(res.length).toEqual(2);
        expect(res[0].tagName).toEqual('Text');
        expect(res[0].properties['testID']).toEqual('foo');
        expect(res[1].tagName).toEqual('Text');
        expect(res[1].properties['testID']).toEqual('bar');
      });
  }));

  it('should querySelectorAll', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb:TestComponentBuilder, _rootRenderer:ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View><Text testID="foo">Foo</Text><Text testID="bar">Bar</Text></View>`)
      .createAsync(TestComponent).then((fixture:ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();

        var root:Node = <Node>fixture.nativeElement;
        var res = root.querySelectorAll('[testID=foo]');
        expect(res.length).toEqual(1);
        expect(res[0].tagName).toEqual('Text');
        expect(res[0].properties['testID']).toEqual('foo');
      });
  }));
});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {}