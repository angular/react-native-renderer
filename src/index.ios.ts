import {reactNativeBootstrap} from './angular_reactnative'
import {Component, View, Directive, NgFor} from 'angular2/angular2';

@Component({
	selector: 'todo-app',
	hostAttributes: {
		"position": "absolute",
		"top": 0,
		"bottom": 0,
		"left": 0,
		"right": 0,
		"padding": 5,
		"paddingTop": 15
	}
})
@View({
	template:
		  "<TextField (topsubmitediting)='submit($event)' placeholder='new item' height=40 fontSize=30></TextField>"
		+ "<ScrollView flex=1><View>" 
			+ "<View *ng-for='#item of items' flexDirection='row' height=40 fontSize=20 alignItems='center'>"
				+ "<switch width=61 height=31 paddingRight=10 (topchange)='remove(item)'></switch>"
				+ "<Text fontSize=20>{{item.label}}</Text>"
			+ "</View>"
		+ "</View></ScrollView>",
	directives: [NgFor]
})
class TodoAppComponent {
	myText = "";
	items = [];
	submit(event) {
		this.items.push({"label": event.text});
		event.target.setProperty("text", "");
	}
	remove(item) {
		console.log(this.items, this.items.indexOf(item))
		this.items.splice(this.items.indexOf(item), 1)
	}
}

reactNativeBootstrap(TodoAppComponent);