[![Join the chat at https://gitter.im/angular/react-native-renderer](https://badges.gitter.im/angular/react-native-renderer.svg)](https://gitter.im/angular/react-native-renderer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/angular/react-native-renderer.svg?branch=master)](https://travis-ci.org/angular/react-native-renderer)

# angular2-react-native

Use Angular 2 and React Native to build applications for Android and iOS.

## Documentation
http://angular.github.io/react-native-renderer/

## Development

### Preparing your environment
* Set up React Native for iOS and/or Android following [Getting started](https://facebook.github.io/react-native/docs/getting-started.html) and [Android setup](https://facebook.github.io/react-native/docs/android-setup.htmlt)
* Clone this repository or a fork of it
* Install Gulp, React Native CLI  and Typings globally: `npm install -g gulp react-native-cli typings`
* Install local npm modules: `npm install`

### Running scripts

Creating the sample project:
* `gulp init` to create the react-native project

Android:
* `gulp start.android` to launch the sample on the connected device or emulator, and watch sources for auto update (if enabled in F2/shake dev menu)
* `gulp start.android.aot` to launch the some with AoT compilation

iOS:
* `gulp start.ios` to launch the sample on an emulator, and watch sources for auto update (it will fail the first due to initial compilation, simply restart it)
* `gulp start.ios.aot` to launch the some with AoT compilation

Tests:
* `gulp test.browser` to run tests in Chrome

Doc:
`gulp doc` to generate the documentation in `./dist/doc`
