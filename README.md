# angular-react-native-renderer

A **proof of concept** of building native applications with Angular 2 and React Native.
Based on https://github.com/angular/react-native-renderer
**Only tested on Windows targeting Android**

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
*use the `Reload JS` button after the initial red screen*

iOS:
* `gulp start.ios` to launch the sample on an emulator, and watch sources for auto update (it will fail the first due to initial compilation, simply restart it)
* OR, `gulp watch` and  open `.dist/app/ngReactNative/ios/ngReactNative.xcodeproj` in Xcode and hit `Run`

Tests:
* `gulp test.node` to run tests in Node
* `gulp test.browser` to run tests in Chrome

Doc:
`gulp doc` to generate the documentation in `./dist/doc`
