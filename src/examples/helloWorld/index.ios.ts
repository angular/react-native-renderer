/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/angular2/angular2.d.ts" />
/// <reference path="node_modules/angular-react-native-renderer/angular-react-native-renderer.d.ts" />

require('AppRegistry');
import {reactNativeBootstrap} from 'angular-react-native-renderer'
import {Component, View, Directive, NgFor} from 'angular2/angular2';

@Component({
	selector: 'todo-app',
	host: {
		"position": "absolute",
		"top": "0",
		"right": "0",
		"bottom": "0",
		"left": "0",
		"justifyContent": "center"
	}
})
@View({
	template:
	    	"<TextField (topchange)='name = $event.text' height=40 fontSize=30 placeholder='name'></TextField>" +
	    	"<Text>Hello, {{name}}.</Text>",
	directives: [NgFor]
})
class TodoAppComponent {
	name = ""
}

reactNativeBootstrap("helloWorld", TodoAppComponent);
