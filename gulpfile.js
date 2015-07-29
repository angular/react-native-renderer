var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('default', ['build', 'watchbuild']);

gulp.task('watchbuild', function() {
	gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('build', shell.task([
	"cd src/node_modules && ../../node_modules/.bin/tsc"
]));

gulp.task('init', ['initSrc', 'initDist'], shell.task([]));

gulp.task('initSrc', ['cleanSrc'], shell.task([
	"cd src && npm install",

	//prune angular2 to only use angular2/ts
	"mv src/node_modules/angular2/ts src/node_modules/tmpSrcAngular2",
	"rm -rf src/node_modules/angular2",
	"mv src/node_modules/tmpSrcAngular2 src/node_modules/angular2"
]));

gulp.task('cleanSrc', shell.task([
	"rm -rf src/node_modules"
]));

gulp.task('initDist', ['cleanDist'], shell.task([
	"./node_modules/.bin/react-native init dist",
	"cp src/package.json dist/package.json",
	"cd dist && npm install",

	//add the fake, empty crypto package
	"cp -r crypto/ dist/node_modules/crypto"
]));

gulp.task('cleanDist', shell.task([
	"rm -rf dist"
]));

gulp.task('main.jsbundle', function() {
	return require('./tools/bundler').bundle();
})