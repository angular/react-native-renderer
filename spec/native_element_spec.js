var objectAssign = require('object-assign');
var proxyquire = require('proxyquire').noCallThru();
var NativeModules = require('./NativeModules_mock');
var UIManager = NativeModules.UIManager;
var ReactNativeTagHandles = require('./ReactNativeTagHandles_mock');
var native_element = proxyquire('../dist/native_element', {
	'NativeModules': NativeModules, 
	'ReactNativeTagHandles': ReactNativeTagHandles
});
var ReactNativeElement = native_element.ReactNativeElement


describe("A React Native element wrapper", function() {
	it("should default to RCTView", function() {
		var element = new ReactNativeElement("not a valid name");
		expect(element.viewName).toBe("RCTView");
	});
	it("should accept names without the RCT prefix", function() {
		var element = new ReactNativeElement("switch");
		expect(element.viewName).toBe("RCTSwitch");
	});
	it("should apply initial properties to native", function() {
		spyOn(UIManager, "createView");
		var element = new ReactNativeElement("view", {"foo": "bar"});
		expect(UIManager.createView.calls.mostRecent().args[2]).toEqual({"foo":"bar"});
	})
	it("should apply added properties to native", function() {
		var element = new ReactNativeElement();
		spyOn(UIManager, "updateView");
		element.setProperty("foo", "bar");
		expect(UIManager.updateView.calls.mostRecent().args[2]).toEqual({"foo":"bar"});
	})
	it("should track its parent when being inserted", function() {
		var parent = new ReactNativeElement();
		var child = new ReactNativeElement();
		parent.insertChildAtIndex(child, 0);
		expect(child.parent).toBe(parent);
	});
	it("should track its children when inserting children", function() {
		var parent = new ReactNativeElement();
		var child1 = new ReactNativeElement();
		var child2 = new ReactNativeElement();
		var child3 = new ReactNativeElement();
		parent.insertChildAtIndex(child3, 0);
		parent.insertChildAtIndex(child1, 0);
		parent.insertChildAtIndex(child2, 1);
		expect(parent.children.length).toBe(3);
		expect(parent.children[0]).toBe(child1);
		expect(parent.children[1]).toBe(child2);
		expect(parent.children[2]).toBe(child3);
	});
	describe("with children", function() {
		var parent;
		var child1;
		var child2;
		var child3;
		beforeEach(function() {
			parent = new ReactNativeElement();
			child1 = new ReactNativeElement();
			child2 = new ReactNativeElement();
			child3 = new ReactNativeElement();
			parent.insertChildAtIndex(child1, 0);
			parent.insertChildAtIndex(child2, 1);
			parent.insertChildAtIndex(child3, 2);
		});
		it("should track its children when removing a child", function() {
			parent.removeAtIndex(1);
			expect(parent.children.length).toBe(2);
			expect(parent.children[0]).toBe(child1);
			expect(parent.children[1]).toBe(child3);
		});
		it("should cause any removed children to update their parent", function() {
			parent.removeAtIndex(1);
			expect(child2.parent).not.toBe(parent);
		});
	});
	it("should be able to attach to native", function() {
		spyOn(UIManager, "manageChildren");

		var element = new ReactNativeElement();
		element.attachToNative();

		expect(UIManager.manageChildren.calls.mostRecent().args[0]).toEqual(1); // 1 is the native tag.
	});
	describe("that uses a UIManager that destroys elements upon detach", function() {
		var root;
		beforeEach(function() {
			root = new ReactNativeElement();
			root.attachToNative();
		})
		it("should recreate itself upon reattachment", function() {
			var element = new ReactNativeElement();
			root.insertChildAtIndex(element, 0);

			spyOn(UIManager, "createView");
			root.removeAtIndex(0);
			root.insertChildAtIndex(element, 0);
			expect(UIManager.createView).toHaveBeenCalled();
		});
		it("should recreate itself with the same viewName upon reattachment", function() {
			var element = new ReactNativeElement("switch");
			root.insertChildAtIndex(element, 0);

			spyOn(UIManager, "createView");
			root.removeAtIndex(0);
			root.insertChildAtIndex(element, 0);
			expect(UIManager.createView.calls.mostRecent().args[1]).toEqual("RCTSwitch");
		});
		it("should recreate its children upon reattachment", function() {
			var parent = new ReactNativeElement();
			root.insertChildAtIndex(parent, 0);
			var child = new ReactNativeElement();
			parent.insertChildAtIndex(child, 0);

			spyOn(UIManager, "createView");
			root.removeAtIndex(0);
			root.insertChildAtIndex(parent, 0);
			expect(UIManager.createView.calls.count()).toEqual(2);
		});
		it("should recreate itself with the same properties upon reattachment", function() {
			var element = new ReactNativeElement("view", {"foo": "bar"});
			root.insertChildAtIndex(element, 0);

			spyOn(UIManager, "createView");
			spyOn(UIManager, "updateView");
			root.removeAtIndex(0);
			root.insertChildAtIndex(element, 0);
			
			//build properties object from the most recent calls to createView and updateView
			var mostRecentCalls = [];
			mostRecentCalls.push(UIManager.createView.calls.mostRecent())
			if (UIManager.updateView.calls.mostRecent() !== undefined) {
				mostRecentCalls.push(UIManager.updateView.calls.mostRecent())
			}
			var resultingProperties = {}
			for (var i = 0; i < mostRecentCalls.length; i++) {
				var call = mostRecentCalls[i];
				objectAssign(resultingProperties, call.args[2]);
			}

			expect(resultingProperties).toEqual({"foo": "bar"})
		});
	});
	it("should be focusable", function() {
		spyOn(UIManager, "focus");

		var element = new ReactNativeElement();
		element.focus();

		expect(UIManager.focus).toHaveBeenCalled();
	});
	it("should fire events to an added listener", function() {
		var spy = jasmine.createSpy("eventListenerSpy");

		var element = new ReactNativeElement();
		element.setEventListener(spy);
		element.fireEvent("eventName", "eventObject");

		expect(spy).toHaveBeenCalledWith("eventName", "eventObject");
	});
	it("maintains the tagElementMap", function() {
		spyOn(ReactNativeTagHandles, "allocateTag").and.returnValue(123);
		
		var element = new ReactNativeElement();

		expect(native_element.tagElementMap[123]).toBe(element);
	});
})