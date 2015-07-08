"use strict";

var wd = require("wd");
var path = require("path");
// var bundler = require("./bundle");
var travis = process.env.TRAVIS;
var desired = {
	browserName: '',
	appiumVersion: "1.4.7",
	deviceName: "iPhone Simulator",
	deviceOrientation: "portrait",
	// platformVersion: "8.3",
	// platformVersion: "8.2",
	platformName: "iOS",
	// app: path.resolve("dist/build/dist.app.zip"),
	// app: "sauce-storage:dist2.app.zip",
	launchTimeout: 600000
};
if (travis) {
	desired.app = "sauce-storage:" + process.env.SAUCE_APP_NAME
	desired.platformVersion = "8.2"
} else {
	desired.app = path.resolve("dist/build/dist.app.zip")
	desired.platformVersion = "8.3"
}
//appium also closes a session after 60s, no reason to wait longer than that. (capability newCommandTimeout)
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
var APPIUM_INIT_TIMEOUT = 1200000;

describe('todo-app', function() {
	var browser;
	var catchSpy;
	beforeEach(function(done) {
		catchSpy = jasmine.createSpy("catchSpy");
		if (travis) {
			browser = wd.promiseChainRemote("http://angular-ci:" + process.env.SAUCE_ACCESS_KEY + "@ondemand.saucelabs.com/wd/hub", 80);
		} else {
			browser = wd.promiseChainRemote("0.0.0.0", 4723);
		}
		browser.on('status', function(info) {
		  console.log('status\n', arguments);
		});
		browser.on('command', function(eventType, command, response) {
		  console.log('command\n', arguments);
		});
		browser.on('http', function(meth, path, data) {
		  console.log('http\n', arguments);
		});

		browser.init(desired)
		.catch(function(err){
			console.log(err);
		})
		.then(function() {
			console.log(arguments);
			done();
		})
		.catch(function(err) {
			console.log(err);
			throw err;
		})
	}, APPIUM_INIT_TIMEOUT);
	it('should connect to appium without error', function(done) {
		browser
			.elementByXPath("//UIAApplication[1]/UIAWindow[1]")
			.catch(function() {
				console.log('CAUGHT\n', arguments);
			})
			.finally(function() {
				expect(catchSpy).not.toHaveBeenCalled();
				done();
			})
	});
	it('should have text next to switches', function(done) {
		browser
			.elementByXPath("//UIAApplication[1]/UIAWindow[1]/UIAScrollView[1]/UIASwitch[1]/following-sibling::UIAStaticText").text(function(err, text){
				if (err) throw err;
			})
			.catch(catchSpy)
			.finally(function() {
				expect(catchSpy).not.toHaveBeenCalled();
				done();
			})
	});
	afterEach(function(done) {
		browser.quit().done(done);
	});
})
