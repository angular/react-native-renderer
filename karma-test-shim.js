window.global = window;
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

__karma__.loaded = function () {
};


function isJsFile(path) {
  return path.slice(-3) == '.js';
}

function isSpecFile(path) {
  return path.slice(-8) == '_spec.js';
}

function isBuiltFile(path) {
  var builtPath = '/base/dist/';
  return isJsFile(path) && (path.substr(0, builtPath.length) == builtPath);
}

var allSpecFiles = Object.keys(window.__karma__.files)
  .filter(isSpecFile)
  .filter(isBuiltFile);

// Load our SystemJS configuration.
System.config({
  baseURL: '/base'
});

System.config(
  {
    defaultJSExtensions: true,
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    map: {
      // angular bundles
      '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
      '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',

      // angular testing umd bundles
      '@angular/animations/browser/testing': 'npm:@angular/animations/bundles/animations-browser-testing.umd.js',
      '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
      '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
      '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
      '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
      '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
      '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
      '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',

      // other
      'rxjs': 'npm:rxjs'
    },
    packages: {
      'rxjs': {
        defaultExtension: 'js'
      }
    }
  });

System.import('@angular/core/testing')
  .then(function(coreTesting){
    return Promise
      .all([
        System.import('@angular/platform-browser-dynamic/testing'),
        System.import('@angular/platform-browser/animations')
      ])
      .then(function(mods) {
        coreTesting.TestBed.initTestEnvironment(
          [mods[0].BrowserDynamicTestingModule, mods[1].NoopAnimationsModule],
          mods[0].platformBrowserDynamicTesting());
      });
  })
.then(function() {
  // Finally, load all spec files.
  // This will run the tests directly.
  return Promise.all(
    allSpecFiles.map(function (moduleName) {
      return System.import(moduleName);
    }));
}).then(function() { __karma__.start(); }, function(error) { console.error(error); });