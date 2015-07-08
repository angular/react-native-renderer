var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('default', ['build', 'watchbuild']);

gulp.task('watchbuild', function() {
	gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('build', shell.task([
	'./node_modules/.bin/tsc -p src',
	"find dist -not \\( -path dist/node_modules -prune \\) -name '*.js' -type f -exec sed -i '' -e '$a\\' {} \\;",
]));

gulp.task('init', ['initTypings', 'initFakeCrypto', 'initDistModules', 'initDistAngular'], shell.task([]));

gulp.task('cleanDist', shell.task([
	"rm -rf dist"
]));

gulp.task('cleanSrcAngularTypings', shell.task([
	"rm -rf src/angular2"
]));

gulp.task('initSubmodule', shell.task([
	"git submodule update --init --recursive",
	// "./node_modules/.bin/tsd reinstall --config angular/modules/angular2/tsd.json",
		"rm -rf angular/modules/angular2/typings",
		"cp -r angular_typings angular/modules/angular2/typings"
]));

gulp.task('initDist', ['cleanDist'], shell.task([
	"./node_modules/.bin/react-native init dist",	
]));

gulp.task('initFakeCrypto', ['initDist'], shell.task([
	"cp -r crypto/ dist/node_modules/crypto",
]));

gulp.task('initDistModules', ['initDist'], shell.task([
	"cp src/package.json dist/package.json",
	"cd dist && npm install",
]));

gulp.task('initDistAngular', ['initDist', 'cleanSrcAngularTypings', 'initSubmodule', 'initDistModules'], shell.task([
	"cp -r angular/modules/angular2/ src/angular2/",
	"./node_modules/.bin/tsc -p src",
		"mv dist/node_modules/angular2/package.json tmp",
	"rm -r dist/node_modules/angular2",
	"mv dist/angular2 dist/node_modules/angular2",
		"mv tmp dist/node_modules/angular2/package.json",
	"rm -r src/angular2",
]));

gulp.task('initDistNewlines', ['initDistModules', 'initDistAngular'], shell.task([	
	"find dist -name '*.js' -print0 | xargs -0 -p -P 9 -n 1 -I {} sed -i '' -e '$a\\' {}"
]));

gulp.task('initTypings', ['initDistAngular'], shell.task([
	"cp -r dist/node_modules/angular2 src/angular2",
	"cp angular/modules/angular2/*.d.ts src/angular2",
	"cp -r angular/modules/angular2/typings src/angular2/typings"
]));

gulp.task('build.app', ['init'], shell.task([
	"./scripts/build_app.sh",
]));

gulp.task('main.jsbundle', function() {
	return require('./tools/bundler').bundle();
})