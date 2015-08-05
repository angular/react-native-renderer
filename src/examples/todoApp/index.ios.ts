require('AppRegistry');
import {reactNativeBootstrap} from 'angular-react-native-renderer/angular_reactnative'
import {Component, View, Directive, NgFor} from 'angular2/angular2';

var precomputeStyle = require('precomputeStyle');
var NativeModules = require('NativeModules');

@Component({
	selector: 'todo-app',
	host: {
		"position": "absolute",
		"top": "0",
		"bottom": "0",
		"left": "0",
		"right": "0",
		"padding": "5",
		"paddingTop": "15"
	}
})
@View({
	template:
	    "<TextField (topsubmitediting)='submit($event)' placeholder='new item' height=40 fontSize=30></TextField>" +
		"<ScrollView automaticallyAdjustContentInsets=false flex=1 [scrollEnabled]='scrollEnabled'><View paddingBottom=600>" +
		  "<View [transformMatrix]='item.transformMatrix' (topTouchStart)='handleStart($event, item)' (topTouchMove)='handleMove($event, item)' (topTouchEnd)='handleEnd($event, item)'  *ng-for='#item of items' flexDirection='row' [height]='item.height || 40' fontSize=20 alignItems='center'>" +
		    "<switch (topchange)='handleSwitch(item)' width=61 height=31 paddingRight=10></switch>" +
		    "<Text fontSize=20>{{item.label}}</Text>" +
		  "</View>" +
		"</View></ScrollView>",
	directives: [NgFor]
})
class TodoAppComponent {
	items = parksToVisit;
	scrollEnabled = true;

	submit(event) {
		this.items.push({ "label": event.text });
		NativeModules.UIManager.configureNextLayoutAnimation({
			duration: 1000,
			create: {
				duration: 500,
				delay: 0,
				property: "scaleXY",
				type: "easeInEaseOut"
			}
		}, function() {
			console.log("success", arguments);
		}, function() {
			console.log("failure", arguments);
		});
		event.target.setProperty("text", "");
		event.target.focus();
	}
	handleSwitch(item) {
		this.collapseItem(item);
	}
	removeRaw(item) {
		this.items.splice(this.items.indexOf(item), 1)
	}
	handleStart(event, item) {
		item.prevEvent = event;
		item.controlledByAnimation = false;
		item.x = item.x || 0;
		item.dxList = [item.x];
		item.dxListIterator = 0;
		item.dxListMaxLength = 5;
		item.startedSwipe = false;
	}
	handleMove(event, item) {
		var prevX = item.prevEvent.pageX;
		var curX = event.pageX;
		var dx = curX - prevX;
		if (!item.startedSwipe) {
			var prevY = item.prevEvent.pageY;
			var curY = event.pageY;
			var dy = curY - prevY;
			if (Math.abs(dx) - Math.abs(dy) > 10) {
				this.scrollEnabled = false;
				item.startedSwipe = true;
				dx = 0;
			} else {
				return;
			}
		}
		item.x = item.x + dx;

		//record last 5 frames of dx
		item.dxList[item.dxListIterator++] = dx
		if (item.dxListIterator >= item.dxListMaxLength) item.dxListIterator = 0;

		this.drawItem(item);
		item.prevEvent = event;
	}
	handleEnd(event, item) {
		this.handleMove(event, item);
		item.controlledByAnimation = true;
		this.finishSwipe(item);
		this.scrollEnabled = true;
	}
	collapseItem(item) {
		var frame = 0;
		var height = 40;
		var self = this;
		function animate() {
			//NOTE: velocity is based on change in X over change in frames,
			//                       NOT change in X over change in time
			// it should probably be changed to be base on time.
			height--;
			item.height = height;
			self.drawItem(item);
			if (height <= 0) {
				self.removeRaw(item);
			} else {
				requestAnimationFrame(animate);
			}
		} animate();
	}
	//given item.x and the dx of last 5 frames, finish the animation, and remove the item if needed.
	finishSwipe(item) {
		//choose max absolute velocity.
		var velocity = 0;
		for (var i = 0; i < item.dxList.length; i++) {
			if (Math.abs(item.dxList[i]) > Math.abs(velocity)) {
				velocity = item.dxList[i];
			}
		}

		var self = this;
		var destination = "";
		var directionValue = item.x + velocity * 20;
		var directionThreshold = 200;
		if (directionValue > directionThreshold) {
			destination = "right";
		} else if (directionValue < -directionThreshold) {
			destination = "left";
		} else {
			destination = "center";
		}
		function animate() {
			//NOTE: velocity is based on change in X over change in frames,
			//                       NOT change in X over change in time
			// it should probably be changed to be base on time.
			if (!item.controlledByAnimation) return;
			if (destination === "center") {
				velocity = (velocity*9 - item.x)/10;
				velocity *= 0.8;
			} else if (destination === "right") {
				velocity += 4;
			} else {
				velocity -= 4;
			}
			item.x += velocity;
			self.drawItem(item);
			if (item.x > 1000 || item.x < -1000) {
				self.removeRaw(item);
			} else if (Math.abs(item.x) > 0.1 || Math.abs(velocity) > 0.1) {
				requestAnimationFrame(animate);
			}
		} animate();
	}
	drawItem(item) {
		var translateX = item.x || 0;
		var scaleY = item.height/40 || 1;
		item.transformMatrix = precomputeStyle({
			transform: [
				{ translateX: translateX },
				{ scaleY: scaleY }
			]
		}).transformMatrix;
	}
}

var parksToVisit = global.tmpParks = [
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


reactNativeBootstrap("todoApp", TodoAppComponent);
