if [ -d node_modules/angular2/ts ]; then
	mv node_modules/angular2/ts node_modules/tmpAngular2
	mv node_modules/angular2/package.json node_modules/tmpPackage
	rm -rf node_modules/angular2
	mv node_modules/tmpAngular2 node_modules/angular2
	mv node_modules/tmpPackage node_modules/angular2/package.json
fi 
