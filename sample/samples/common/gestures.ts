import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {RippleFeedback} from 'angular2-react-native';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'gestures-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [NgFor, RippleFeedback],
  template: `
<View [styleSheet]="styles.surface"
  (doubletap)="handleEvent($event)"
  (pan)="handleEvent($event)"
  (panstart)="handleEvent($event)"
  (panmove)="handleEvent($event)"
  (panend)="handleEvent($event)"
  (pancancel)="handleEvent($event)"
  (panleft)="handleEvent($event)"
  (panright)="handleEvent($event)"
  (panup)="handleEvent($event)"
  (pandown)="handleEvent($event)"
  (pinch)="handleEvent($event)"
  (pinchstart)="handleEvent($event)"
  (pinchmove)="handleEvent($event)"
  (pinchend)="handleEvent($event)"
  (pinchcancel)="handleEvent($event)"
  (pinchin)="handleEvent($event)"
  (pinchout)="handleEvent($event)"
  (press)="handleEvent($event)"
  (pressup)="handleEvent($event)"
  (rotate)="handleEvent($event)"
  (rotatestart)="handleEvent($event)"
  (rotatemove)="handleEvent($event)"
  (rotateend)="handleEvent($event)"
  (rotatecancel)="handleEvent($event)"
  (swipe)="handleEvent($event)"
  (swipeleft)="handleEvent($event)"
  (swiperight)="handleEvent($event)"
  (swipeup)="handleEvent($event)"
  (swipedown)="handleEvent($event)"
  (tap)="handleEvent($event)"
  (tapstart)="handleEvent($event)"
  (tapcancel)="handleEvent($event)">
  <Text [styleSheet]="styles.buttonText">TOUCH ME</Text>
</View>
<View [styleSheet]="styles.button" rippleFeedback (tap)="clearLogs()">
  <Text [styleSheet]="styles.buttonText">Clear logs</Text>
</View>
<ScrollView [style]="{flex: 12}">
  <View [styleSheet]="styles.logs">
    <Text *ngFor="let log of logs">{{log}}</Text>
  </View>
</ScrollView>
`
})
export class GesturesApp {
  logs: Array<string> = [];
  styles: any;
  private _begin: number;
  constructor() {
    this.styles = StyleSheet.create({
      surface: {
        backgroundColor: '#ABABAB',
        flex: 6
      },
      logs: {
        flex: 1
      },
      button: {
        padding: 10,
        backgroundColor: '#005eb8',
        flex: 1
      },
      buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 20
      }
    });
  }

  handleEvent(event: any) {
    if (this.logs.length == 0) {
      this._begin = event.timeStamp;
    }
    this.logs.push(`${event.timeStamp - this._begin}ms - ${event.type}`);
  }

  clearLogs() {
    this.logs = [];
  }
}