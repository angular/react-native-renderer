var gulp = require('gulp');
var filter = require('gulp-filter');
var strip = require('gulp-strip-comments');
var through2 = require('through2');

exports.doCopy = function(source, destination) {
  var filterJS= filter('angular2/**/*.js', {restore: true});
  //TODO: remove hack once Babbel is somehow fixed
  var tmpHack = filter('rxjs/util/SymbolShim.js', {restore: true});
  var tmpHack2 = filter('reflect-metadata/Reflect.js', {restore: true});
  return gulp.src(source, { base: './node_modules/' })
    .pipe(filterJS)
    .pipe(strip())
    .pipe(filterJS.restore)
    .pipe(tmpHack)
    .pipe(transformSymbolShim())
    .pipe(tmpHack.restore)
    .pipe(tmpHack2)
    .pipe(transformReflect())
    .pipe(tmpHack2.restore)
    .pipe(gulp.dest(destination));
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
