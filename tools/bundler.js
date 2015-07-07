// adapted from react-native/local-cli/bundle.js:getBundle(flags)
// this is meant to do the same thing, but is exported and
// returns a promise
var fs = require('fs');
var path = require('path');
var blacklist = require('../dist/node_modules/react-native/packager/blacklist.js');
var ReactPackager = require('../dist/node_modules/react-native/packager/react-packager');

var OUT_PATH = 'dist/iOS/main.jsbundle';

function bundle(flags) {
  flags = flags || [];
  flags.dev = flags.dev || 0;
  flags.minify = flags.minify || 0;

  var options = {
    projectRoots: [path.resolve(__dirname, '../dist')],
    transformModulePath: require.resolve('../dist/node_modules/react-native/packager/transformer.js'),
    assetRoots: [path.resolve(__dirname, '../dist')],
    cacheVersion: '2',
    blacklistRE: blacklist('ios')
  };

  var url = '/index.ios.bundle?dev=' + flags.dev;

  return ReactPackager.buildPackageFromUrl(options, url)
    .then(function(bundle) {
      return new Promise(function(resolve, reject) {
        fs.writeFile(OUT_PATH, bundle.getSource({
          inlineSourceMap: false,
          minify: flags.minify
        }), function(err) {
          if (err) {
            reject();
            throw err;
          } else {
            resolve();
          }
        });
      });
    });
}

exports.bundle = bundle;