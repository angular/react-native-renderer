EXAMPLE_NAME=$1
cd dist/$EXAMPLE_NAME
cp -r ../../src/examples/$EXAMPLE_NAME/* .
npm install --save ../../src
../../node_modules/.bin/tsc -m commonjs -t es5 index.ios.ts