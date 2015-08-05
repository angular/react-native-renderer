EXAMPLE_NAME=$1
cd dist/$EXAMPLE_NAME
cp -r ../../src/examples/$EXAMPLE_NAME/* .
npm install --save ../../src
cd node_modules
../../../node_modules/.bin/tsc