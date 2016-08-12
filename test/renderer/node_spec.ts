import {Component} from "@angular/core";
import {Node} from "../../src/renderer/node";
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {configureTestingModule, initTest} from "../../src/test_helpers/utils";

describe('Node', () => {
  const mock:MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    configureTestingModule(mock, TestComponent);
  });

  it('should getElementByTestId', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><Text testID="foo">Foo</Text><Text testID="bar">Bar</Text></View>`);
    rootRenderer.executeCommands();

    const root:Node = <Node>fixture.nativeElement;
    const res = root.getElementByTestId('bar');
    expect(res.tagName).toEqual('Text');
    expect(res.properties['testID']).toEqual('bar');
  });

  it('should querySelector', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><Text testID="foo">Foo</Text><Text testID="bar">Bar</Text></View>`);
    rootRenderer.executeCommands();

    const root:Node = <Node>fixture.nativeElement;
    const res = root.querySelector('Text');
    expect(res.tagName).toEqual('Text');
    expect(res.properties['testID']).toEqual('foo');
  });

  it('should querySelectorAll', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><Text testID="foo">Foo</Text><Text testID="bar">Bar</Text></View>`);
    rootRenderer.executeCommands();

    const root:Node = <Node>fixture.nativeElement;
    const res = root.querySelectorAll('Text');
    expect(res.length).toEqual(2);
    expect(res[0].tagName).toEqual('Text');
    expect(res[0].properties['testID']).toEqual('foo');
    expect(res[1].tagName).toEqual('Text');
    expect(res[1].properties['testID']).toEqual('bar');
  });

  it('should querySelectorAll', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<View><Text testID="foo">Foo</Text><Text testID="bar">Bar</Text></View>`);
    rootRenderer.executeCommands();

    const root:Node = <Node>fixture.nativeElement;
    const res = root.querySelectorAll('[testID=foo]');
    expect(res.length).toEqual(1);
    expect(res[0].tagName).toEqual('Text');
    expect(res[0].properties['testID']).toEqual('foo');
  });
});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {}