EXAMPLE_NAME=$1

cp -r node_modules/angular-react-native-renderer/examples/$EXAMPLE_NAME/* .
cp -r node_modules/angular-react-native-renderer/setup/tsconfig.json tsconfig.json
npm install

npm install --save node_modules/angular-react-native-renderer/crypto