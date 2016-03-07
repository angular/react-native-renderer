var gulp = require('gulp');
var filter = require('gulp-filter');
var strip = require('gulp-strip-comments');
var typescript = require('gulp-typescript');
var watch = require('gulp-watch');
var exec = require('child_process').exec;
var fork = require('child_process').fork;
var karma = require('karma').Server;
var path = require('path');
var runSequence = require('run-sequence');
var through2 = require('through2');

var APP_NAME = 'ngReactNative';
var PATHS = {
  sources: {
    src: 'src/**/*.ts',
    sample: 'sample/**/*.ts',
    sampleAssets: 'sample/**/*.png',
    test: 'test/**/*.ts'
  },
  destination: 'dist/code',
  app: 'dist/app',
  modules: [
    'node_modules/angular2/**/*',
    'node_modules/es6-shim/**/*',
    'node_modules/hammerjs/**/*',
    'node_modules/reflect-metadata/**/*',
    'node_modules/rxjs/**/*',
    'node_modules/zone.js/**/*'
  ]
};

/**********************************************************************************/
/*******************************   SAMPLE    **************************************/
/**********************************************************************************/
gulp.task('clean', function (done) {
  var del = require('del');
  del([PATHS.app], done);
});
gulp.task('!create', ['clean'], function(done) {
  executeInAppDir('react-native init ' + APP_NAME, done, true);
});
gulp.task('!postcreate', ['!create'], function() {
  return gulp.src(PATHS.app + '/' + APP_NAME + '/android/app/src/main/AndroidManifest.xml')
    .pipe(transformAndroidManifest())
    .pipe(gulp.dest(PATHS.app + '/' + APP_NAME + '/android/app/src/main/'));

});
gulp.task('init', ['!postcreate'], function() {
  var filterJS = filter('angular2/**/*.js', {restore: true});
  //TODO: remove hack once Babbel is somehow fixed
  var tmpHack = filter('rxjs/util/SymbolShim.js', {restore: true});
  return gulp.src(PATHS.modules, { base: './node_modules/' })
  .pipe(filterJS)
  .pipe(strip())
  .pipe(filterJS.restore)
  .pipe(tmpHack)
  .pipe(transformSymbolShim())
  .pipe(tmpHack.restore)
  .pipe(gulp.dest(PATHS.app + '/' + APP_NAME + '/node_modules'));
});


gulp.task('!assets', function () {
  return gulp.src(PATHS.sources.sampleAssets).pipe(gulp.dest(PATHS.app + '/' + APP_NAME));
});
gulp.task('!compile', ['!assets'], function () {
  ts2js(PATHS.sources.sample, PATHS.app + '/' + APP_NAME);
  return ts2js(PATHS.sources.src, PATHS.app + '/' + APP_NAME + '/node_modules/react-native-renderer');
});
gulp.task('!launch.android', ['!compile'], function(done) {
  executeInAppDir('react-native run-android', done);
});
gulp.task('!launch.ios', ['!compile'], function(done) {
  executeInAppDir('react-native run-ios', done);
});
gulp.task('!start.android', ['!launch.android'], function(neverDone) {
  executeInAppDir('react-native start');
});
gulp.task('watch', function(neverDone) {
  watch([PATHS.sources.src, PATHS.sources.sample], function() {
    runSequence('!compile');
  });
});
gulp.task('start.android', ['!start.android', 'watch'], function (neverDone) {
});
gulp.task('start.ios', ['!launch.ios', 'watch'], function (neverDone) {
});

function executeInAppDir(command, done, inParentFolder) {
  var cmd = 'mkdir dist' + path.sep + 'app';
  exec(cmd, function(e, stdout) {
    var dir = './dist/app';
    if (!inParentFolder) dir += '/' + APP_NAME;
    exec(command, {cwd: dir}, function(e, stdout) {
      if (e) console.log(e);
      if (done) done();
    }).stdout.on('data', function(data) {
      console.log(data);
    });
  });
}

/**********************************************************************************/
/*******************************    NODE     **************************************/
/**********************************************************************************/
gulp.task('ts2commonjs', ['clean.code'], function () {
  ts2js(PATHS.sources.sample, PATHS.destination + '/sample');
  ts2js(PATHS.sources.test, PATHS.destination + '/test', false);
  return ts2js(PATHS.sources.src, PATHS.destination + '/src');
});

gulp.task('transformTests', ['ts2commonjs'], function() {
  return gulp.src(PATHS.destination + '/test/**/*_spec.js')
    .pipe(transformCommonJSTests())
    .pipe(gulp.dest(PATHS.destination + '/test'));
});

var treatTestErrorsAsFatal = true;
gulp.task('test.node/ci', ['transformTests'], function(done) {
  runJasmine([PATHS.destination + '/test/**/*_spec.js'], done);
});

gulp.task('test.node', function(neverDone) {
  treatTestErrorsAsFatal = false;
  runSequence(
    'test.node/ci',
    function() {
      watch([PATHS.sources.src, PATHS.sources.test], function() {
        runSequence('test.node/ci');
      });
    }
  );
});

/**********************************************************************************/
/*******************************   BROWSER   **************************************/
/**********************************************************************************/
gulp.task('ts2system', ['clean.code'], function () {
  ts2js(PATHS.sources.sample, PATHS.destination + '/sample', true);
  ts2js(PATHS.sources.test, PATHS.destination + '/test', true);
  return ts2js(PATHS.sources.src, PATHS.destination + '/src', true);
});

gulp.task('karma-launch', function() {
  new karma({
    configFile: path.join(__dirname, 'karma.conf.js')
  }).start();
});

gulp.task('karma-run', function (done) {
  runKarma('karma.conf.js', done);
});

gulp.task('test.browser', ['ts2system'], function (neverDone) {
  runSequence(
    'karma-launch',
    function() {
      watch([PATHS.sources.src, PATHS.sources.test], function() {
        runSequence('ts2system', 'karma-run');
      });
    }
  );
});

gulp.task('test.browser/ci', ['ts2system'], function(done) {
  new karma({
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: true
  }, done).start();
});

/**********************************************************************************/
/*******************************    UTIL     **************************************/
/**********************************************************************************/
gulp.task('clean.code', function (done) {
  var del = require('del');
  del([PATHS.destination], done);
});

function ts2js(path, dest, toSystem) {
  var tsResult = gulp.src([path].concat(['typings/main.d.ts', 'src/react-native-renderer.d.ts']))
    .pipe(typescript({
      noImplicitAny: true,
      module: toSystem ? 'system' : 'commonjs',
      target: 'ES5',
      moduleResolution: 'node',
      emitDecoratorMetadata: true,
      experimentalDecorators: true
    },
      undefined,
      customReporter()));
  return tsResult.js.pipe(gulp.dest(dest));
}

function runKarma(configFile, done) {
  var cmd = process.platform === 'win32' ? 'node_modules\\.bin\\karma run ' :
    'node node_modules/.bin/karma run ';
  cmd += configFile;
  exec(cmd, function(e, stdout) {
    // ignore errors, we don't want to fail the build in the interactive (non-ci) mode
    // karma server will print all test failures
    done();
  });
}

function runJasmine(globs, done) {
  var args = ['--'].concat(globs);
  fork('./jasmine-test-shim', args, {stdio: 'inherit'})
    .on('close', function jasmineCloseHandler(exitCode) {
      if (exitCode && treatTestErrorsAsFatal) {
        var err = new Error('Jasmine tests failed');
        // Mark the error for gulp similar to how gulp-utils.PluginError does it.
        // The stack is not useful in this context.
        err.showStack = false;
        done(err);
      } else {
        done();
      }
    });
}

function transformCommonJSTests() {
  return through2.obj(function (file, encoding, done) {
    var content = `var parse5Adapter = require('angular2/src/platform/server/parse5_adapter');\r\n` +
      `parse5Adapter.Parse5DomAdapter.makeCurrent();\r\n` + String(file.contents);
    file.contents = new Buffer(content);
    this.push(file);
    done();
  });
}

function transformSymbolShim() {
  return through2.obj(function (file, encoding, done) {
    file.contents = new Buffer(fixedSymbolShim);
    this.push(file);
    done();
  });
}

function transformAndroidManifest() {
  return through2.obj(function (file, encoding, done) {
    var content = String(file.contents);
    content = content.replace('<uses-permission android:name="android.permission.INTERNET" />',
    `<uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />`);
    file.contents = new Buffer(content);
    this.push(file);
    done();
  });
}

function customReporter() {
  return {
    error: (error) => {
      if (error.relativeFilename && error.message.indexOf(`Module '"react-native"' has no exported member`) == -1 &&
        error.message.indexOf(`Module '"react-native-renderer/react-native-renderer"' has no exported member`) == -1 &&
        error.message.indexOf(`src\\react-native-renderer.d.ts`) == -1 &&
        error.message.indexOf(`does not exist on type 'Global'.`) == -1) {
        console.error(error.message);
      }
    },
    finish: typescript.reporter.defaultFinishHandler
  };
}

var fixedSymbolShim = `var root_1 = require('./root');
function polyfillSymbol(root) {
    var Symbol = ensureSymbol(root);
    ensureIterator(Symbol, root);
    ensureObservable(Symbol);
    ensureFor(Symbol);
    return Symbol;
}
exports.polyfillSymbol = polyfillSymbol;
function ensureFor(Symboll) {
    if (!Symboll.for) {
        Symboll.for = symbolForPolyfill;
    }
}
exports.ensureFor = ensureFor;
var id = 0;
function ensureSymbol(root) {
    if (!root.Symbol) {
        root.Symbol = function symbolFuncPolyfill(description) {
            return "@@Symbol(" + description + "):" + id++;
        };
    }
    return root.Symbol;
}
exports.ensureSymbol = ensureSymbol;
function symbolForPolyfill(key) {
    return '@@' + key;
}
exports.symbolForPolyfill = symbolForPolyfill;
function ensureIterator(Symboll, root) {
    if (!Symboll.iterator) {
        if (typeof Symboll.for === 'function') {
            Symboll.iterator = Symboll.for('iterator');
        }
        else if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
            // Bug for mozilla version
            Symboll.iterator = '@@iterator';
        }
        else if (root.Map) {
            // es6-shim specific logic
            var keys = Object.getOwnPropertyNames(root.Map.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (key !== 'entries' && key !== 'size' && root.Map.prototype[key] === root.Map.prototype['entries']) {
                    Symboll.iterator = key;
                    break;
                }
            }
        }
        else {
            Symboll.iterator = '@@iterator';
        }
    }
}
exports.ensureIterator = ensureIterator;
function ensureObservable(Symboll) {
    if (!Symboll.observable) {
        if (typeof Symboll.for === 'function') {
            Symboll.observable = Symboll.for('observable');
        }
        else {
            Symboll.observable = '@@observable';
        }
    }
}
exports.ensureObservable = ensureObservable;
exports.SymbolShim = polyfillSymbol(root_1.root);
//# sourceMappingURL=SymbolShim.js.map`;
