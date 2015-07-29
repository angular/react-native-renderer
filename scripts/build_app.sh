./node_modules/.bin/gulp build

# uncomment the "OPTION 2", so the javascript bundle is used in the built app
# the packager still gets uselessly launched: https://github.com/facebook/react-native/issues/1430
sed -i '.old' -E '/^ *\/\/ *jsCodeLocation/ s/^ *\/\/*//' dist/iOS/AppDelegate.m

./node_modules/.bin/gulp main.jsbundle

xctool -project dist/dist.xcodeproj/ -scheme dist -sdk iphonesimulator8.3 clean CONFIGURATION_BUILD_DIR=$(pwd)/dist/build
xctool -project dist/dist.xcodeproj/ -scheme dist -sdk iphonesimulator8.3 build CONFIGURATION_BUILD_DIR=$(pwd)/dist/build
zip -r dist/build/dist.app.zip dist/build/dist.app

# revert AppDelegate.m back to the normal development version
rm dist/iOS/AppDelegate.m
mv dist/iOS/AppDelegate.m.old dist/iOS/AppDelegate.m