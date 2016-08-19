'use strict';

var glob = require('glob');
var JasmineRunner = require('jasmine');
var path = require('path');

require('zone.js/dist/zone-node.js');
require('zone.js/dist/async-test.js');
require('zone.js/dist/fake-async-test.js');
require('reflect-metadata/Reflect');

global.angularDevMode = true;

var jrunner = new JasmineRunner();

// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jrunner.jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

// Support passing multiple globs
var globsIndex = process.argv.indexOf('--');
var args;
if (globsIndex < 0) {
  args = [process.argv[2]];
} else {
  args = process.argv.slice(globsIndex + 1);
}

var specFiles = args.map(function(globstr) { return glob.sync(globstr); })
  .reduce(function(specFiles, paths) { return specFiles.concat(paths); }, []);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

jrunner.configureDefaultReporter({showColors: process.argv.indexOf('--no-color') === -1});

jrunner.onComplete(function(passed) { process.exit(passed ? 0 : 1); });
jrunner.projectBaseDir = __dirname;
jrunner.specDir = '';
jrunner.addSpecFiles(specFiles);

var testingPlatformServer = require('@angular/platform-server/testing/server.js');
var testing = require('@angular/core/testing.js');

testing.TestBed.initTestEnvironment(
  testingPlatformServer.ServerTestingModule, testingPlatformServer.platformServerTesting());
require('zone.js/dist/jasmine-patch.js');

jrunner.execute();