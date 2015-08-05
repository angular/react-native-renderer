EXAMPLE=$1

./node_modules/.bin/gulp init -x $EXAMPLE

# uncomment the "OPTION 2", so the javascript bundle is used in the built app
# the packager still gets uselessly launched: https://github.com/facebook/react-native/issues/1430
sed -i '.old' -E '/^ *\/\/ *jsCodeLocation/ s/^ *\/\/*//' dist/$EXAMPLE/iOS/AppDelegate.m

./node_modules/.bin/gulp bundle -x $EXAMPLE

xctool -project dist/$EXAMPLE/$EXAMPLE.xcodeproj/ -scheme $EXAMPLE -sdk iphonesimulator8.3 clean CONFIGURATION_BUILD_DIR=$(pwd)/dist/$EXAMPLE/build
xctool -project dist/$EXAMPLE/$EXAMPLE.xcodeproj/ -scheme $EXAMPLE -sdk iphonesimulator8.3 build CONFIGURATION_BUILD_DIR=$(pwd)/dist/$EXAMPLE/build
zip -r dist/$EXAMPLE/build/$EXAMPLE.app.zip dist/$EXAMPLE/build/$EXAMPLE.app

# revert AppDelegate.m back to the normal development version
rm dist/$EXAMPLE/iOS/AppDelegate.m
mv dist/$EXAMPLE/iOS/AppDelegate.m.old dist/$EXAMPLE/iOS/AppDelegate.m