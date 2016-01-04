var gulp = require('gulp');
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
gulp.task('init', ['!create'], function() {
  return gulp.src(PATHS.modules, { base: './node_modules/' }).pipe(gulp.dest(PATHS.app + '/' + APP_NAME + '/node_modules'));
});

gulp.task('!compile', function () {
  ts2js(PATHS.sources.sample, PATHS.app + '/' + APP_NAME);
  return ts2js(PATHS.sources.src, PATHS.app + '/' + APP_NAME);
});
gulp.task('!launch', ['!compile'], function(done) {
  executeInAppDir('react-native run-android', done);
});
gulp.task('!start', ['!launch'], function(neverDone) {
  executeInAppDir('react-native start');
});
gulp.task('!watch', function(neverDone) {
  watch([PATHS.sources.src, PATHS.sources.sample], function() {
    runSequence('!compile');
  });
});
gulp.task('start', ['!start', '!watch'], function (neverDone) {
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
  ts2js(PATHS.sources.test, PATHS.destination + '/test', false, true);
  return ts2js(PATHS.sources.src, PATHS.destination + '/src');
});

gulp.task('transformTests', ['ts2commonjs'], function() {
  return gulp.src(PATHS.destination + '/test/**/*')
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
  ts2js(PATHS.sources.test, PATHS.destination + '/test', true, true);
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

function ts2js(path, dest, toSystem, isSilent) {
  var tsResult = gulp.src(path)
    .pipe(typescript({
      noImplicitAny: true,
      module: toSystem ? 'system' : 'commonjs',
      target: 'ES5',
      moduleResolution: 'node',
      emitDecoratorMetadata: true,
      experimentalDecorators: true
    },
      undefined,
      //TODO: remove once angular2/testing typings are solved
      isSilent ? typescript.reporter.nullReporter() : typescript.reporter.defaultReporter()));
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
