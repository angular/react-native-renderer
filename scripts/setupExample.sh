EXAMPLE_NAME=$1
mkdir -p dist
cd dist

../node_modules/.bin/react-native init $EXAMPLE_NAME
cd $EXAMPLE_NAME
# symbolic link instead of: npm install ../../src
# ln -s ../../../src/ ./node_modules/angular-react-native-renderer
# TODO: use above when issue is fixed: https://github.com/facebook/react-native/issues/637

# can't use the setup from npm, because it installs the npm version of the package.
# ./node_modules/angular-react-native-renderer/setup/setup.sh $EXAMPLE_NAME
cp -r ../../src/examples/$EXAMPLE_NAME/* .
# replace npm version with local version
npm install --save ../../src
npm install

npm install --save node_modules/angular-react-native-renderer/crypto

cp -r node_modules/angular-react-native-renderer/setup/tsconfig.json tsconfig.json
cd node_modules
../../../node_modules/.bin/tsc