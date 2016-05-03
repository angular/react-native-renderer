var gulp = require('gulp');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var typescript = require('gulp-typescript');
var watch = require('gulp-watch');

var Builder = require('systemjs-builder');
var exec = require('child_process').exec;
var fork = require('child_process').fork;
var karma = require('karma').Server;
var merge = require('merge2');
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
  publish: 'dist/publish',
  modules: [
    'node_modules/@angular/**/*',
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
  var copier = require('./tools/copy-dependencies');
  return copier.doCopy(PATHS.modules, PATHS.app + '/' + APP_NAME + '/node_modules');
});


gulp.task('!assets', function () {
  return gulp.src(PATHS.sources.sampleAssets).pipe(gulp.dest(PATHS.app + '/' + APP_NAME));
});
gulp.task('!transpile', ['!assets'], function () {
  return ts2js([PATHS.sources.sample, PATHS.sources.src], PATHS.tmp);
});
gulp.task('!copyToNodeModules', ['!transpile'], function () {
  return gulp.src(PATHS.tmp + '/src/**/*').pipe(gulp.dest(PATHS.app + '/' + APP_NAME + '/node_modules/angular2-react-native'));
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
  if (!/^darwin/.test(process.platform)) {
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
    singleRun: true,
    browsers: [process.env.TRAVIS ? 'ChromeNoSandbox' : 'Chrome']
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
        locals: {components: components, component: components[key], path: key}
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
/*******************************   PUBLISH    *************************************/
/**********************************************************************************/
var systemBuilder = new Builder(PATHS.destination);
systemBuilder.config({
  meta: {
    '@angular/*': { build: false },
    'rxjs/*': { build: false },
    'reflect-metadata': {build: false},
    'zone.js/dist/zone.js': {build: false}
  },
  defaultJSExtensions: true
});
gulp.task('!pre-bundle', ['ts2system'], function () {
  return gulp.src(PATHS.destination + '/src/**/*').pipe(gulp.dest(PATHS.destination + '/angular2-react-native'));
});
gulp.task('bundle', ['!pre-bundle'], function(done) {
  return systemBuilder.bundle('angular2-react-native/testing', path.join(PATHS.publish, 'bundles/testing.dev.js'),
    {}).catch(function (e) { console.log(e); });
});

gulp.task('!tmp.clean', function (done) {
  var del = require('del');
  del([PATHS.tmp], done);
});
gulp.task('!publish.clean', ['!tmp.clean'], function (done) {
  var del = require('del');
  del([PATHS.publish], done);
});
gulp.task('!publish.assets', ['!publish.clean'], function () {
  return gulp.src([
    'LICENSE',
    'package.json',
    'README.md',
    'tools/*'
  ], {base: './'})
    .pipe(gulp.dest(PATHS.publish));
});
gulp.task('!publish.transpile', ['!publish.assets', 'clean.code'], function () {
  return ts2js([PATHS.sources.src], PATHS.tmp, false, true);
});
gulp.task('publish', ['!publish.transpile', 'bundle'], function () {
  return gulp.src(PATHS.tmp + '/src/**/*').pipe(gulp.dest(PATHS.publish));
});

/**********************************************************************************/
/*******************************    UTIL     **************************************/
/**********************************************************************************/
gulp.task('clean.code', function (done) {
  var del = require('del');
  del([PATHS.destination], done);
});

function ts2js(path, dest, toSystem, withDeclaration) {
  var tsResult = gulp.src(path.concat(['typings/main.d.ts', 'src/angular2-react-native.d.ts']), {base: './'})
    .pipe(typescript({
      noImplicitAny: true,
      module: toSystem ? 'system' : 'commonjs',
      target: 'ES5',
      moduleResolution: 'node',
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      declaration: withDeclaration
    },
      undefined,
      customReporter()));
  if (withDeclaration) {
    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
      tsResult.dts.pipe(gulp.dest(dest)),
      tsResult.js.pipe(gulp.dest(dest))
    ]);
  } else {
    return tsResult.js.pipe(gulp.dest(dest));
  }
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
    var content = `var parse5Adapter = require('@angular/platform-server/src/parse5_adapter');\r\n` +
      `parse5Adapter.Parse5DomAdapter.makeCurrent();\r\n` + String(file.contents);
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
        error.message.indexOf(`Module ''angular2-react-native'' has no exported member`) == -1 &&
        error.message.indexOf(`src\\angular2-react-native.d.ts`) == -1 &&
        error.message.indexOf(`does not exist on type 'Global'.`) == -1) {
        console.error(error.message);
      }
    },
    finish: typescript.reporter.defaultFinishHandler
  };
}
