var gulp = require('gulp');
var shell = require('gulp-shell');

var minimist = require('minimist');

var options = minimist(process.argv.slice(2), {
	string: 'example',
	alias: {
		'example': 'x'
	}
})
console.log(options);

gulp.task('watch', function() {
	gulp.watch('src/examples/' + options.example + '/**', ['build']);
	gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('build', ['buildSrc'], shell.task([
	"./scripts/updateExample.sh " + options.example
]));

gulp.task('init', ['clean', 'buildSrc'], shell.task([
	"./scripts/setupExample.sh " + options.example
]));

gulp.task('clean', shell.task([
	"rm -rf dist/" + options.example
]));

gulp.task('open', shell.task([
	"open dist/" + options.example + "/" + options.example + ".xcodeproj"
]));

gulp.task('cleanAll', shell.task([
	"rm -rf dist"
]));

gulp.task('buildSrc', shell.task([
	"cd src && ../scripts/pruneAngular2.sh",
	"cd src/node_modules && ../../node_modules/.bin/tsc"
]));

gulp.task('publish', ['buildSrc'], shell.task([
	"cd src && npm publish"
]));

gulp.task('bundle', function() {
	return require('./tools/bundler').bundle(options.example);
})