Getting Started
---------------

	npm install

If you are having issues with tsd, run `tsd rate` to make sure you are not being rate limited by GitHub. If you see a 0/60, then you need to add a GitHub OAuth token with `tsd token`. More information can be found on the [tsd repo](https://github.com/DefinitelyTyped/tsd).

Then build:

	gulp build

Or, to continuously build, just:

	gulp

Then open `dist/dist.xcodeproj` in XCode
