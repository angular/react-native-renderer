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

Copy the example todo app:

	cp node_modules/angular-react-native-renderer/examples/todoApp/index.ios.ts .

The copied `index.ios.ts` file will have the wrong application name. Open it and replace "todoApp" on the last line with "theNameOfYourReactNativeProject".

Install needed .d.ts files with tsd:

	npm install -g tsd
	tsd install angular2 node

Compile the example's .ts sources to .js:

	npm install -g typescript
	tsc index.ios.ts -m commonjs -t es5 --experimentalDecorators

And run the app:

	open myProjectName.xcodeproj

XCode should open. Click the run button in the top left.