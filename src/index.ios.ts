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
	    "<TextField (topsubmitediting)='submit($event)' placeholder='new item' height=40 fontSize=30></TextField>" +
		"<ScrollView flex=1><View>" +
		  "<View *ng-for='#item of items' flexDirection='row' height=40 fontSize=20 alignItems='center'>" +
		    "<switch (topchange)='remove(item)' width=61 height=31 paddingRight=10></switch>" +
		    "<Text fontSize=20>{{item.label}}</Text>" +
		  "</View>" +
		"</View></ScrollView>",
	directives: [NgFor]
})
class TodoAppComponent {

	items = parksToVisit;

	submit(event) {
		this.items.push({"label": event.text});
		event.target.setProperty("text", "");
		event.target.focus();
	}
	remove(item) {
		this.items.splice(this.items.indexOf(item), 1)
	}
}

var parksToVisit = [
	{"label": 'Bryce Canyon'},
	{"label": 'Crater Lake'},
	{"label": 'Death Valley'},
	{"label": 'Denali'},
	{"label": 'Everglades'},
	{"label": 'Glacier Bay'},
	{"label": 'Grand Canyon'},
	{"label": 'Grand Teton'},
	{"label": 'Great Basin'},
	{"label": 'Haleakalā'},
	{"label": 'Joshua Tree'},
	{"label": 'Kings Canyon'},
	{"label": 'Lassen Volcanic'},
	{"label": 'Mount Rainier'},
	{"label": 'Redwood'},
	{"label": 'Rocky Mountain'},
	{"label": 'Sequoia'},
	{"label": 'Yellowstone'},
	{"label": 'Zion'}
];


reactNativeBootstrap(TodoAppComponent);