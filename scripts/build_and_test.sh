EXAMPLE=todoApp
./scripts/build_app.sh $EXAMPLE
if [ ! $TRAVIS ]; then
	./node_modules/appium/bin/appium.js --log-level debug &
	APPIUM_PID=$!
fi

#wait for appium server to accept http requests
if [ ! $TRAVIS ]; then
	until ( curl -s 0.0.0.0:4723 >/dev/null ); do sleep 1; done;
fi
export SAUCE_APP_NAME=build_local.app.zip
export SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`
if [ $TRAVIS ]; then
	export SAUCE_APP_NAME=build_${TRAVIS_BUILD_NUMBER}_${TRAVIS_BUILD_ID}_${RANDOM}.app.zip
	./scripts/start_tunnel.sh
	curl -u angular-ci:$SAUCE_ACCESS_KEY \
		 -X POST \
		 -H "Content-Type: application/octet-stream" \
		 https://saucelabs.com/rest/v1/storage/$SAUCE_USERNAME/$SAUCE_APP_NAME \
		 --data-binary @./dist/$EXAMPLE/build/$EXAMPLE.app.zip
fi
./node_modules/jasmine/bin/jasmine.js
EXIT_STATUS=$?
if [ ! $TRAVIS ]; then
	kill $APPIUM_PID
fi
exit $EXIT_STATUS