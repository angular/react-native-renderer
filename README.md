# angular-react-native-renderer

A **proof of concept** renderer to build native applications with with Angular 2 and React Native.
Based on https://github.com/angular/react-native-renderer
**Only tested on Windows targeting Android**

## Development

### Preparing your environment
* Set up React Native for Android following [Getting started](https://facebook.github.io/react-native/docs/getting-started.html) and [Android setup](https://facebook.github.io/react-native/docs/android-setup.htmlt)
* Clone this repository or a fork of it
* Install Gulp and React Native CLI globally: `npm install -g gulp react-native-cli`
* Install local npm modules: `npm install`

### Running scripts

To launch the sample:
* `gulp init` to create the react-native project
* `gulp start` to launch it on the connected device or emulator, and watch sources for auto update (if enabled in F2/shake dev menu)
(the `Reload JS` button may have to be hit sometimes)

Tip: if your computer is too slow to start the file watcher, increase the timer in `.\dist\app\ngReactNative\node_modules\react-native\packager\react-packager\src\FileWatcher\index.js`

To run tests in node:
* Launch `gulp test.node`

To run tests in Chrome:
* Launch `gulp test.browser`
