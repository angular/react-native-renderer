var fs = require('fs');

var gulp = require('gulp');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var typescript = require('gulp-typescript');
var watch = require('gulp-watch');

var Builder = require('systemjs-builder');
var exec = require('child_process').exec;
var karma = require('karma').Server;
var merge = require('merge2');
var path = require('path');
var runSequence = require('run-sequence');
var through2 = require('through2');
var isWin = /^win/.test(process.platform);
var ngcExecutable = isWin ? 'node_modules\\.bin\\ngc.cmd' : './node_modules/.bin/ngc';
var tscExecutable = isWin ? 'node_modules\\.bin\\tsc.cmd' : './node_modules/.bin/tsc';

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

//--------------------------- INIT ---------------------------
gulp.task('clean', function (done) {
  var del = require('del');
  del([PATHS.app], done);
});
gulp.task('!create', ['clean'], function(done) {
  executeInAppDir('react-native init ' + APP_NAME, done, true);
});
gulp.task('!postcreate', ['!create'], function() {
  gulp.src(PATHS.app + '/' + APP_NAME + '/node_modules/react-native/Libraries/Renderer/ReactNativeStack*')
    .pipe(transformReactNativeStack())
    .pipe(gulp.dest(PATHS.app + '/' + APP_NAME + '/node_modules/react-native/Libraries/Renderer/'));
  return gulp.src(PATHS.app + '/' + APP_NAME + '/android/app/src/main/AndroidManifest.xml')
    .pipe(transformAndroidManifest())
    .pipe(gulp.dest(PATHS.app + '/' + APP_NAME + '/android/app/src/main/'));

});
gulp.task('init', ['!postcreate'], function() {
  return gulp.src(PATHS.modules, { base: './node_modules/' })
    .pipe(gulp.dest(PATHS.app + '/' + APP_NAME + '/node_modules'));
});

//--------------------------- JIT compilation---------------------------
gulp.task('!assets', function () {
  return gulp.src(PATHS.sources.sampleAssets).pipe(gulp.dest(PATHS.app + '/' + APP_NAME));
});
gulp.task('!transpile', ['!assets'], function () {
  return ts2js([PATHS.sources.sample, PATHS.sources.src], PATHS.tmp, false, false);
});
gulp.task('!copyToNodeModules', ['!transpile'], function () {
  return gulp.src(PATHS.tmp + '/src/**/*').pipe(gulp.dest(PATHS.app + '/' + APP_NAME + '/node_modules/angular-react-native'));
});
gulp.task('compile.jit', ['!copyToNodeModules'], function () {
  return gulp.src(PATHS.tmp + '/sample/**/*').pipe(gulp.dest(PATHS.app + '/' + APP_NAME));
});


//--------------------------- AOT compilation---------------------------
gulp.task('compile.assets', function () {
  return gulp.src(PATHS.sources.sampleAssets).pipe(gulp.dest(PATHS.tmp));
});
gulp.task('compile.copy.source', ['!tmp.clean'], function () {
  return gulp.src(['src/**/*', 'sample/**/*'], { base: './' }).pipe(gulp.dest(PATHS.tmp));
});
gulp.task('compile.transform', ['compile.copy.source'], function (done) {
  runSequence('transform', 'compile.assets', done);
});
gulp.task('compile.ngc.src', ['compile.transform'], function (done) {
  exec(ngcExecutable + ' -p ./dist/tmp/src', function(e, stdout) {
    if (e) console.log(e);
    if (done) done();
  }).stdout.on('data', function(data) {
    console.log(data);
  });
});
gulp.task('compile.ngc.sample', ['compile.ngc.src'], function (done) {
  exec(ngcExecutable + ' -p ./dist/tmp/sample', function(e, stdout) {
    if (e) console.log(e);
    if (done) done();
  }).stdout.on('data', function(data) {
    console.log(data);
  });
});
gulp.task('compile.tsc.factories', ['compile.ngc.sample'], function (done) {
  exec('cp ./factory.tsconfig.json ./dist/tmp/factories/tsconfig.json', function(e, stdout) {
    exec(tscExecutable + ' -p ./dist/tmp/factories', function (e, stdout) {
      if (done) done();
    })
  })
});
gulp.task('compile.finalize', ['compile.tsc.factories'], function (done) {
  exec('cp -rf ./dist/tmp/factories_out/* ./dist/tmp/', function(e, stdout) {
    var del = require('del');
    del([PATHS.tmp + '/factories', PATHS.tmp + '/factories_out', PATHS.tmp + '/sample', PATHS.tmp + '/src', PATHS.tmp + '/waste'], done);
  })
});
gulp.task('compile.copy', ['compile.finalize'], function () {
  return gulp.src(PATHS.tmp +'/**/*').pipe(gulp.dest(PATHS.app + '/' + APP_NAME));
});
gulp.task('compile.aot', ['compile.copy'], function (done) {
  exec('cp ./sample/index.android.aot.js ./dist/app/ngReactNative/index.android.js', function(e, stdout) {
    exec('cp ./sample/index.ios.aot.js ./dist/app/ngReactNative/index.ios.js', function(e, stdout) {
      done();
    });
  });
});


//--------------------------- Launchers---------------------------
var mode = 'jit';
gulp.task('!launch.android', function(done) {
  executeInAppDir('react-native run-android', done);
});
gulp.task('!launch.ios', function(done) {
  executeInAppDir('react-native run-ios', done);
});
gulp.task('watch', function(neverDone) {
  watch([PATHS.sources.src, PATHS.sources.sample], function() {
    runSequence('compile.' + mode);
  });
});

gulp.task('start.android', function (neverDone) {
  runSequence('compile.jit', '!launch.android', 'watch')
});
gulp.task('start.ios', function (neverDone) {
  runSequence('compile.jit', '!launch.ios', 'watch')
});

gulp.task('start.android.aot', function (neverDone) {
  mode = 'aot';
  runSequence('compile.aot', '!launch.android', 'watch')
});
gulp.task('start.ios.aot', function (neverDone) {
  mode = 'aot';
  runSequence('compile.aot', '!launch.ios', 'watch')
});

/**********************************************************************************/
/*******************************   BROWSER   **************************************/
/**********************************************************************************/
gulp.task('ts2system', ['clean.code'], function () {
  return ts2js([PATHS.sources.src, PATHS.sources.test], PATHS.destination, true, false);
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
  return gulp.src(PATHS.destination + '/src/**/*').pipe(gulp.dest(PATHS.destination + '/angular-react-native'));
});
gulp.task('bundle', ['!pre-bundle'], function(done) {
  return systemBuilder.bundle('angular-react-native/testing', path.join(PATHS.publish, 'bundles/testing.dev.js'),
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
gulp.task('publish.transpile', ['!publish.assets', 'clean.code'], function () {
  return ts2js([PATHS.sources.src], PATHS.tmp, false, true);
});
gulp.task('publish.copy.commonjs', ['publish.transpile', 'bundle'], function () {
  return gulp.src(PATHS.tmp + '/src/**/*').pipe(gulp.dest(PATHS.publish));
});
gulp.task('publish.reset', ['publish.copy.commonjs'], function (done) {
  var del = require('del');
  del([PATHS.tmp], done);
});
gulp.task('publish.copy.source', ['publish.reset'], function () {
  return gulp.src(['src/**/*'], { base: './' }).pipe(gulp.dest(PATHS.tmp));
});
gulp.task('publish.transform', ['publish.copy.source'], function (done) {
  runSequence('transform', done);
});
gulp.task('publish.ngc.src', ['publish.transform'], function (done) {
  exec(ngcExecutable + ' -p ./dist/tmp/src', function(e, stdout) {
    if (e) console.log(e);
    if (done) done();
  }).stdout.on('data', function(data) {
    console.log(data);
  });
});
gulp.task('publish', ['publish.ngc.src'], function (done) {
  return gulp.src(PATHS.tmp + '/node_modules/angular-react-native/**/*').pipe(gulp.dest(PATHS.publish));
});

/**********************************************************************************/
/***************************   TRANSFORM SOURCE    ********************************/
/**********************************************************************************/
var generics = null;
gulp.task('transform.init', function (done) {
  generics = retrieveGenericsFromSource();
  done();
});
gulp.task('transform.android', ['transform.init'], function () {
  return gulp.src(PATHS.tmp + '/src/components/android/*')
    .pipe(transformComponents(generics, true))
    .pipe(gulp.dest(PATHS.tmp + '/src/components/android'));
});
gulp.task('transform.ios', ['transform.android'], function () {
  return gulp.src(PATHS.tmp + '/src/components/ios/*')
    .pipe(transformComponents(generics, true))
    .pipe(gulp.dest(PATHS.tmp + '/src/components/ios'));
});
gulp.task('transform.common.android', ['transform.ios'], function () {
  return gulp.src(PATHS.tmp + '/src/components/common/*')
    .pipe(transformComponents(generics, true))
    .pipe(rename({prefix: '_'}))
    .pipe(gulp.dest(PATHS.tmp + '/src/components/android'));
});
gulp.task('transform.common.ios', ['transform.common.android'], function () {
  return gulp.src(PATHS.tmp + '/src/components/common/*')
    .pipe(transformComponents(generics, false))
    .pipe(rename({prefix: '_'}))
    .pipe(gulp.dest(PATHS.tmp + '/src/components/ios'));
});
gulp.task('transform', ['transform.common.ios'], function (done) {
  var del = require('del');
  del([PATHS.tmp+ '/src/components/common'], done);
});

function transformComponents(generics, isAndroid) {
  return through2.obj(function (file, encoding, done) {
    var content = String(file.contents);

    const matches_ai = content.match(/ANDROID_INPUTS([^;\[])+\[(([^;])*)\];/);
    const android_inputs = matches_ai ? matches_ai[2] : null;
    const matches_ii = content.match(/IOS_INPUTS([^;\[])+\[(([^;])*)\];/);
    const ios_inputs = matches_ii ? matches_ii[2] : null;
    const matches_ab = content.match(/ANDROID_BINDINGS([^;`])+`(([^;])*)`;/);
    const android_bindings = matches_ab ? matches_ab[2] : null;
    const matches_ib = content.match(/IOS_BINDINGS([^;`])+`(([^;])*)`;/);
    const ios_bindings = matches_ib ? matches_ib[2] : null;

    content = content.replace('from "./component";', 'from "./_component";');
    content = content.replace('from "../common/component";', 'from "./_component";');

    content = content.replace(/\]\.concat\(GENERIC_INPUTS\)/g, ', ' + (isAndroid ? generics.android.inputs : generics.ios.inputs) + ']');
    content = content.replace(/\]\.concat\(isAndroid\(\) \? ANDROID_INPUTS : IOS_INPUTS\)/g, ', ' + (isAndroid ? android_inputs : ios_inputs) + ']');

    content = content.replace(/\$\{GENERIC_BINDINGS\}/g, isAndroid ? generics.android.bindings : generics.ios.bindings);
    content = content.replace(/\$\{isAndroid\(\) \? ANDROID_BINDINGS : IOS_BINDINGS\}/g, isAndroid ? android_bindings : ios_bindings);

    const matches = content.match(/\$\{isAndroid\(\) \? '(.*)' : '(.*)'\}/);
    if (matches) {
      content = content.replace(matches[0], isAndroid ? matches[1] : matches[2]);
    }

    file.contents = new Buffer(content);
    this.push(file);
    done();
  });
}

function retrieveGenericsFromSource() {
  const source = fs.readFileSync('./src/components/common/component.ts', 'utf8');

  const generic_inputs = source.match(/GENERIC_INPUTS([^;\[])+\[(([^;])+)\]./)[2];
  const android_inputs = source.match(/ANDROID_INPUTS([^;\[])+\[(([^;])+)\];/)[2] + ', ' + generic_inputs;
  const ios_inputs = source.match(/IOS_INPUTS([^;\[])+\[(([^;])+)\];/)[2] + ', ' + generic_inputs;

  const generic_bindings = source.match(/GENERIC_BINDINGS([^;`])+`(([^;])+)\s\$/)[2];
  const android_bindings = source.match(/ANDROID_BINDINGS([^;`])+`(([^;])+)`;/)[2] + ' ' + generic_bindings;
  const ios_bindings = source.match(/IOS_BINDINGS([^;`])+`(([^;])+)`;/)[2] + ' ' + generic_bindings;

  return {
    android : {
      inputs: android_inputs,
      bindings: android_bindings
    },
    ios: {
      inputs: ios_inputs,
      bindings: ios_bindings
    }
  }
}

/**********************************************************************************/
/*******************************    UTIL     **************************************/
/**********************************************************************************/
gulp.task('clean.code', function (done) {
  var del = require('del');
  del([PATHS.destination], done);
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

function ts2js(path, dest, toSystem, withDeclaration) {
  var tsResult = gulp.src(path.concat(['typings/index.d.ts', 'src/angular-react-native.d.ts', 'src/angular-react-native-android.d.ts', 'src/angular-react-native-ios.d.ts']), {base: './'})
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

function transformReactNativeStack() {
  return through2.obj(function (file, encoding, done) {
    var content = String(file.contents);
    content = content.replace('module.exports = ReactNativeStackEntry;',
      `ReactNativeStackEntry.ReactNativeEventEmitter = ReactNativeEventEmitter_1;
ReactNativeStackEntry.ReactNativeTagHandles = ReactNativeTagHandles_1;
ReactNativeStackEntry.ReactNativeAttributePayload = ReactNativeAttributePayload_1;

module.exports = ReactNativeStackEntry;`);
    file.contents = new Buffer(content);
    this.push(file);
    done();
  });
}

function customReporter() {
  return {
    error: (error) => {
      if (error.relativeFilename && error.message.indexOf(`Module '"react-native"' has no exported member`) == -1 &&
        error.message.indexOf(`Module ''angular-react-native'' has no exported member`) == -1 &&
        error.message.indexOf(`Module ''angular-react-native/android'' has no exported member`) == -1 &&
        error.message.indexOf(`Module ''angular-react-native/ios'' has no exported member`) == -1 &&
        error.message.indexOf(`src\\angular-react-native.d.ts`) == -1 &&
        error.message.indexOf(`src\\angular-react-native-android.d.ts`) == -1 &&
        error.message.indexOf(`src\\angular-react-native-ios.d.ts`) == -1 &&
        error.message.indexOf(`does not exist on type 'Global'.`) == -1) {
        console.error(error.message);
      }
    },
    finish: typescript.reporter.defaultFinishHandler
  };
}
