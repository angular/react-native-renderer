**ATTENTION:** This pacakge is an *experimental* renderer for Angular 2 and React Native.

A react-native renderer for Angular 2. For more info about this project, see the [github repo](https://github.com/angular/react-native-renderer).

# Getting started

To run any react-native app, you need a Mac with XCode and node.

Create a React Native project:

	npm install -g react-native-cli
	react-native init myProjectName
	cd myProjectName

Add angular-react-native-renderer as a depenedency:

	npm install angular-react-native-renderer

A `setup.sh` script is provided for initial setup:

	./node_modules/angular-react-native-renderer/setup/setup.sh todoApp

It copies the following to the current directory:

 - `package.json` with needed peer dependencies. This will be `npm install`ed by this script too.
 - `tsconfig.json` for use with the typescript compiler. This is only needed for a typescript workflow.
 - example files from the 'todoApp' example, including `index.ios.ts`.
 - a fake crypto module, needed to get Reflect.js to work in JavaScriptCore.

When this script runs `npm install`, it will also modify node_modules/angular2 to use the typescript sources directly.

The copied `index.ios.ts` file will have the wrong application name. Open it and replace "todoApp" on the last line with "theNameOfYourReactNativeProject".

Compile the .ts sources to .js:

	npm install alexeagle/typescript#error_is_class
	$( cd node_modules && ../node_modules/.bin/tsc )

And run the app:

	open myProjectName.xcodeproj

XCode should open. Click the run button in the top left.