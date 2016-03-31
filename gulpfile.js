var gulp = require('gulp');
var filter = require('gulp-filter');
var jade = require('gulp-jade');
var rename = require("gulp-rename");
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
    doc: 'doc/pages/*.jade',
    docAssets: 'doc/assets/**/*.*',
    src: 'src/**/*.ts',
    sample: 'sample/**/*.ts',
    sampleAssets: 'sample/**/*.png',
    test: 'test/**/*.ts'
  },
  destination: 'dist/code',
  app: 'dist/app',
  doc: 'dist/doc',
  tmp: 'dist/tmp',
  modules: [
    'node_modules/angular2/**/*',
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
  var tmpHack2 = filter('reflect-metadata/Reflect.js', {restore: true});
  return gulp.src(PATHS.modules, { base: './node_modules/' })
  .pipe(filterJS)
  .pipe(strip())
  .pipe(filterJS.restore)
  .pipe(tmpHack)
  .pipe(transformSymbolShim())
  .pipe(tmpHack.restore)
  .pipe(tmpHack2)
  .pipe(transformReflect())
  .pipe(tmpHack2.restore)
  .pipe(gulp.dest(PATHS.app + '/' + APP_NAME + '/node_modules'));
});


gulp.task('!assets', function () {
  return gulp.src(PATHS.sources.sampleAssets).pipe(gulp.dest(PATHS.app + '/' + APP_NAME));
});
gulp.task('!transpile', ['!assets'], function () {
  return ts2js([PATHS.sources.sample, PATHS.sources.src], PATHS.tmp);
});
gulp.task('!copyToNodeModules', ['!transpile'], function () {
  return gulp.src(PATHS.tmp + '/src/**/*').pipe(gulp.dest(PATHS.app + '/' + APP_NAME + '/node_modules/react-native-renderer'));
});
gulp.task('!compile', ['!copyToNodeModules'], function () {
  return gulp.src(PATHS.tmp + '/sample/**/*').pipe(gulp.dest(PATHS.app + '/' + APP_NAME));
});

gulp.task('!launch.android', ['!compile'], function(done) {
  executeInAppDir('react-native run-android', done);
});
gulp.task('!launch.ios', ['!compile'], function(done) {
  executeInAppDir('react-native run-ios', done);
});
gulp.task('!start.android', ['!launch.android'], function(neverDone) {
  if (/^win/.test(process.platform)) {
    executeInAppDir('react-native start');
  }
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
  var cmd = 'mkdir -p dist' + path.sep + 'app';
  exec(cmd, function(e, stdout) {
    var dir = './dist/app';
    if (!inParentFolder) dir += '/' + APP_NAME;
    exec(command, {cwd: dir, maxBuffer: 5000 * 1024}, function(e, stdout) {
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
  return ts2js([PATHS.sources.src, PATHS.sources.test], PATHS.destination);
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
  return ts2js([PATHS.sources.src, PATHS.sources.test], PATHS.destination, true);
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
/*********************************   DOC    ***************************************/
/**********************************************************************************/
gulp.task('!doc.assets', function () {
  return gulp.src(PATHS.sources.docAssets, { base: './doc/' }).pipe(gulp.dest(PATHS.doc));
});

var parser = require('./doc/parser');
gulp.task('!doc', ['!doc.assets'], function() {
  var components = parser.parseComponents();
  gulp.src(PATHS.sources.doc)
    .pipe(jade({
      locals: {components: components}
    }))
    .pipe(gulp.dest(PATHS.doc));
  for (var key in components) {
    var name = components[key].description.name.toLowerCase();
    gulp.src('doc/template/component.jade')
      .pipe(rename(name + '.html'))
      .pipe(jade({
        locals: {components: components, component: components[key]}
      }))
      .pipe(gulp.dest(PATHS.doc));
  }
});

gulp.task('doc', ['!doc'], function (neverDone) {
      watch(['./doc/**/*', PATHS.sources.src], function() {
        runSequence('!doc');
      });
});


/**********************************************************************************/
/*******************************    UTIL     **************************************/
/**********************************************************************************/
gulp.task('clean.code', function (done) {
  var del = require('del');
  del([PATHS.destination], done);
});

function ts2js(path, dest, toSystem) {
  var tsResult = gulp.src(path.concat(['typings/main.d.ts', 'src/react-native-renderer.d.ts']), {base: './'})
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

function transformReflect() {
  return through2.obj(function (file, encoding, done) {
    var content = String(file.contents).replace('&& require("crypto")', '');
    file.contents = new Buffer(content);
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
